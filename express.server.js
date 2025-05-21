import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { db } from './app/db/db.js';
import cors from 'cors'
import jwt from 'jsonwebtoken';
import { authenticateToken } from './app/middleware/authMiddleware.js';
import cookieParser from "cookie-parser";
import { Resend } from 'resend';
import multer from 'multer';
import path from 'path';
import OpenAI from "openai";

// multer will save files at the designated file path!
const storage = multer.diskStorage({
    destination: './public/uploads/profile/',
    filename: (req, file, cb) => {
        // sets the uploaded images filename to the users ID and file extension
        // this overides the image everytime there is a new upload!
        cb(null, `${req.user.id}${path.extname(file.originalname)}`);
    }
});


// creates image upload middleware!
export const upload = multer({ storage });

// will allow env file data to come to the server!
dotenv.config();
const app = express();

// will serve the uploaded files statically! as an image source!
app.use('/api/uploads', express.static('public/uploads'));

const corsOptions = {
    // allows origin requests from local host 3000
    origin: "http://localhost:3000",
    // allows cookies and authorization headers etc
    credentials: true,
};

// will inisialize the use of resend now! for pass word resets!
const resend = new Resend(process.env.RESEND_API_KEY);

// uses middleware!
app.use(express.json());
// allows use of cors
app.use(cors(corsOptions));
app.use(cookieParser());


const PORT = process.env.PORT;

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});

// ADD GPT IMPLEMENTATION IN STUDY CHAT!
// ADD REDIRECT AUTOMATICALLY FROM "/" to "/dashboard" not using "/" yet....

// will take the users entered messages and send them to Open AI!
app.post('/api/course-learner/ai-chat', authenticateToken, async (req, res) => {
    const { message, selectedCourse } = req.body;
    const userId = req.user.id;

    if (!message) {
        return res.status(400).json({ message: "Message is required!" });
    }

    try {
        // Get the course name associated with the courseID
        const [response] = await db
            .promise()
            .query('SELECT title FROM courses WHERE id = ?', [selectedCourse]);

        if (response.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Construct a system message based on the course title
        const courseTitle = response[0].title;
        // EDIT THIS TMR!!!!
        const systemMessage = `You are an AI tutor who ONLY answers questions about the course "${courseTitle}". Every answer you give to the user
        will be broken down step by step if the user asks you to answer a specific question. If propmted give practice problems only related to the course at hand.
        if the course is math basics the course material that can be covered is everything before geometry as well as algebra, so kindergarden to grade 5`

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: message },
            ],
        });

        const reply = completion.choices[0].message.content;
        res.status(200).json({ reply });
    } catch (err) {
        console.error("Error with AI chat", err);
        res.status(500).json({ message: "Failed to process AI response" });
    }
});


// basic endpoint that will send the user to the dahboard 
app.post('/api/redirect/dashboard', authenticateToken, async (req, res) => {
    router.push('/dashboard');
})

// will get the users for testing purposes ONLY!!!
app.get('/users', async (req, res) => { // TEST THIS WITH POSTMAN!
    // this will try and catch!
    try {
        // will grab grab the users and put them in a users array
        const [users] = await db.promise().query('SELECT * FROM users');
        // this will give the result in JSON
        res.json(users);
        // will catch for errors
    } catch (err) {
        console.error("Error: get failed", err);
        // will give a 500 error for a failed get!
        res.status(500).json({ message: 'An error has occured while fetching the users' });
    }
})

// will be used for the profile page!
app.get('/api/user', authenticateToken, async (req, res) => {
    const userid = req.user.id;
    try {
        const [user] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userid]);
        if (user.length === 0) {
            return res.status(400).json({ message: "failed to get the users info" });
        }
        res.json(user);
    } catch (err) {
        console.error('Error get failed', err);
        res.status(500).json({ message: 'An errror has occured while fetching the user info!' })
    }
})

// will allow the user to login! posting the user data
app.post('/api/login', async (req, res) => {
    try {
        // will get the users email and password from the input
        const { email, password } = req.body;
        // finds that email in the database itself!
        const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        // if that user doesn't exist throws a 400 error!
        if (user.length === 0) {
            return res.status(400).json({ message: 'that user doesn\'t exist' });
        }
        // will compare the hashed password to the typed password
        const match = await bcrypt.compare(password, user[0].password);
        // if the passwords match 
        if (match) {
            console.log("JWT_SECRET in use:", process.env.JWT_SECRET);
            // will create a token for the user when they login, it will expire in an hour
            const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, { expiresIn: '24h' });
            // will create a cookie that holds the token
            res.cookie('token', token, {
                // ensures http only
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
                // sets cookie to expire in 24 hours
                maxAge: 60 * 60 * 24000,
            });
            res.status(200).json({ message: 'user logged in successfully' })
        } else {
            return res.status(400).json({ message: 'the password is incorrect!' });
        }
        // catchs any other errors if all else fails!
    } catch (err) {
        console.error('error:', err);
        res.status(500).json({ message: 'something went wrong with user login!' })
    }
})

// will create a new user on sign up
app.post('/api/signup', async (req, res) => {
    // this will try and catch!
    try {
        // will get the name, email as well as the password in the users input
        const { name, email, password } = req.body;
        // will get the existing user from the users database and from the email
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        // if it is a existing user it will give a 400 error for this email already existing
        if (existingUser.length > 0) {
            // returns a 400 error for a bad request
            return res.status(400).json({ message: 'Email already in use' });
        }
        // will hash the users given password for security concerns
        const hashedPassword = await bcrypt.hash(password, 10);
        // will call to the database via a promise and await for the users input to be posted to the database
        const [result] = await db.promise().query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        // will make sure stuff was added to the database
        if (result.affectedRows > 0) {
            // adds a token to the new created user
            const token = jwt.sign({ id: result.insertId, email: email }, process.env.JWT_SECRET, { expiresIn: '24h' });
            // creates a cookie to hold the user auth token
            res.cookie('token', token, {
                // ensures http only
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
                // calculated to expire after 24 hours!
                maxAge: 60 * 60 * 24000,
            });
            // success
            res.status(200).json({ message: 'User signed up successfully' })
        }
        // if this is a success it will give a 201 status for a success
        res.status(201).json({ message: 'user created successfully' });
    } catch (err) {
        console.error('Error: Post failed to create user', err);
        // gives a error of 500 for a failed post
        res.status(500).json({ message: 'An error has occured while creating the user' });
    }
})

// this will allow the user to be logged out by removing the cookie!
app.post('/api/logout', authenticateToken, async (req, res) => {
    try {
        // will get the last login time and the total time spent overall from the current user that was logged in!
        const [result] = await db.promise().query('SELECT last_login_time, total_time_spent FROM users WHERE id = ?', [req.user.id]);

        // gets the time from the last login time
        const lastloginTime = new Date(result[0].last_login_time);
        // gets the time that is now!
        const now = new Date();

        // will subtract what time it is now from the login time! all over 1000
        const sessionDuration = Math.floor((now - lastloginTime) / 1000);

        // will add this to the overall total time spent to keep track of how long the user has been studying!
        const newTotal = result[0].total_time_spent + sessionDuration;

        // will await to update the total time to the database as well as makes the last login time null now so it resets at next login!
        await db.promise().query('UPDATE users SET total_time_spent = ?, last_login_time = NULL WHERE id = ?', [newTotal, req.user.id]);

        const [achievements] = await db.promise().query('SELECT * FROM achievements');

        for (const achievement of achievements) {
            const { name, required_seconds } = achievement;

            // If user qualifies for this achievement
            if (newTotal >= required_seconds) {
                // Check if user already has it
                const [existing] = await db.promise().query(
                    'SELECT * FROM user_achievements WHERE user_id = ? AND achievement_name = ?',
                    [req.user.id, name]
                );

                // If not, insert it
                if (existing.length === 0) {
                    await db.promise().query(
                        'INSERT INTO user_achievements (user_id, achievement_name) VALUES (?, ?)',
                        [req.user.id, name]
                    );
                }
            }
        }
        // removes the cookie by making the expiration date the past!
        res.clearCookie('token', {
            httpOnly: true,
            // will change based on development environment but will allow cookies either way
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.status(200).json({ message: 'Logged out successfully!' })
    } catch (err) {
        console.error('Logout Error', err);
        res.status(500).json({ message: 'Something went wrong during logout' })
    }




})

// this will post via the user when forgotten password happens
app.post('/api/forgot-password', async (req, res) => {
    // grabs the email from the front end
    const { email } = req.body;
    try {
        // gets the response from SQL via a promise query and finds the users email
        const [response] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        // if there is no response from the database
        if (response.length === 0) {
            return res.status(400).json({ message: "Error finding email" })
        }

        // creates a temporary jwt token to then reset the users password
        const resetToken = jwt.sign(
            { id: response[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )

        // the link to the reset password webpage
        const resetlink = `http://localhost:3000/authentication/resetpassword?token=${resetToken}`;

        // will use resend to send a email to reset the users password
        const send = await resend.emails.send({
            // grabs from env environmentals
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Reset your password",
            html: `<p>Click below to reset your password:</p><a href="${resetlink}">Reset Password</a>`
        });
        console.log("resend response:", send);
        // success
        res.status(200).json({ message: "password reset email sent" });
        // catchs any errors along the way
    } catch (err) {
        console.error('Error sending reset email:', err);
        res.status(500).json({ message: 'forgot password went wrong' })
    }
})

// this will update the users password from the reset password
app.put('/api/reset-password', async (req, res) => {
    const { password, token } = req.body;
    try {
        // grabs the token as well as the user id associated
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // grabs that id as the user id
        const userID = decoded.id;

        // hashes the new password entered
        const hashedPassword = await bcrypt.hash(password, 10);
        // updates the password in the database with the new hashed password
        const [result] = await db.promise().query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userID]);
        // if there is no password that gets updated
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'User not found or password not updated' });
        }
        // successful update of password
        res.status(200).json({ message: 'User passsword updated successfully!' })
        // catches any errors along the way!
    } catch (err) {
        console.error('Error resetting password', err);
        res.status(500).json({ message: 'something went wrong updating password' })
    }
}
)

// this will add the user selected course to the database from the frontend
app.post('/api/user/course', authenticateToken, async (req, res) => {
    const { courseID } = req.body;
    const userID = req.user.id;

    try {
        const [post] = await db.promise().query('INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)', [userID, courseID]);
        if (post.affectedRows === 0) {
            console.error('issues posting the course data');
            res.status(400).json({ message: "No post was made" });
        }
        res.status(200).json({ message: 'course successfully added!' })
    } catch (err) {
        console.error('issues adding course to user', err);

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'User already enrolled in this course' })
        }
        res.status(500).json({ message: "Error Updating user course!" })
    }
})

// will handle the users unerollment in a course in the settings page!
app.delete('/api/users/course', authenticateToken, async (req, res) => {
    const { courseID, password } = req.body;
    const userID = req.user.id;
    try {
        const [results] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userID]);
        if (!results.length) {
            return res.status(404).json({ message: 'User nout found!' })
        }
        const passwordCheck = await bcrypt.compare(password, results[0].password);
        if (!passwordCheck) {
            return res.status(400).json({ message: 'the passwords do not match!' });
        }
        await db.promise().query('DELETE FROM user_courses WHERE user_id = ? AND course_id = ?', [userID, courseID]);
        res.status(200).json({ message: 'the users course was successfully unenrolled!' });
    } catch (err) {
        console.error('Error un enrolling from course');
        res.status(500).json({ message: 'error with course delete!' });
    }
})

// will be responsible for saving the users profile image to the backend using multer!
app.post('/api/user/profile-image', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        // constructs the URL to access the image publicly
        const imagePath = `/uploads/profile/${req.file.filename}`;
        // awaits updating the specific users profile image at the database
        await db.promise().query('UPDATE users SET profile_image = ? WHERE id = ?', [imagePath, req.user.id]);
        // sends a success response!
        res.status(200).json({ message: 'Profile image uploaded successfully', imagePath });
        // catches any errors along the way!
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

// Will get the users courses they enrolled in!
app.get('/api/user/courses', authenticateToken, async (req, res) => {
    const userID = req.user.id;

    try {

        const [courses] = await db.promise().query('SELECT c.id, c.title AS course_name FROM courses c JOIN user_courses uc ON c.id = uc.course_id WHERE uc.user_id = ?', [userID]);

        res.status(200).json(courses);
    } catch (err) {
        console.error('Error getiing the user courses', err);
        res.status(500).json({ message: 'failed to get users' });
    }
})

// endpoint that gets the courses from the database!
app.get('/api/courses', authenticateToken, async (req, res) => {
    try {
        const [courses] = await db.promise().query('SELECT * FROM courses');
        res.status(200).json(courses);
    } catch (err) {
        console.error('error getting the courses!');
        res.status(500).json({ message: 'failed to get courses!' })
    }
})

// will be responsible for updating the username and email using middleware
app.put('/api//user/update', authenticateToken, async (req, res) => {
    try {
        // grabs the users info from the request body
        const { name, email, password } = req.body;
        const id = req.user.id;
        // makes sure a user cannot update another user that isnt their own
        if (req.user.id !== id) {
            return res.status(403).json({ message: "you are not allowed to update this user" })
        }
        // will ensure the user exists and has a name and email in the input validation
        if (!id || !name || !email) {
            return res.status(400).json({ message: 'The update requires a user to exist and a name and email' });
        }
        // gets the user info from the database!
        const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        // will compare the users typed password with the stored bcrypt password
        const bcryptPassword = await bcrypt.compare(password, user[0].password);
        if (!bcryptPassword) {
            return res.status(400).json({ message: 'Error password is incorrect!' });
        }
        // updates the user information within the database!
        await db.promise().query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        // gives a success status
        res.status(200).json({ message: 'Your user was updated successfully!' });
        // catches for errors when the issues arrives
    } catch (err) {
        console.log('Error:', err);
        res.status(500).json({ message: 'an error has occured while the user was being updated!' })
    }
})

// this will handle the deletion of the user using middleware
app.delete('/api/user/delete', authenticateToken, async (req, res) => {
    // will get the user id and delete the user
    try {
        const userId = req.user.id;
        const { password } = req.body;
        // makes sure a user cannot delete another user that isnt their own
        if (req.user.id !== userId) {
            return res.status(403).json({ message: "you are not allowed to delete this user" })
        }
        const [user] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
        const passwordCompare = await bcrypt.compare(password, user[0].password);

        if (!passwordCompare) {
            res.status(400).json({ message: 'Error password is incorrect!' })
        }
        // will grab the users id and delete the user!
        await db.promise().query('DELETE FROM user_courses WHERE user_id = ?', [userId]);
        await db.promise().query('DELETE FROM users WHERE id = ?', [userId]);
        res.status(200).json({ message: 'The deletion was successful!' })
        // will grab errors when needed!
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ message: 'An error has occured while deleting a user' })
    }

})

// will save the user chat data and messages from the AI itself!
app.post('/api/user/chat', authenticateToken, async (req, res) => {
    // gets the users messages and the AIs responses from the front end!
    const { message, aiResponse } = req.body;
    const userID = req.user.id;
    try {
        // will save the users chat data to the backend
        await db.promise().query('INSERT INTO user_chats (user_id, role, message) VALUES (?, ?, ?)',
            [userID, 'user', message]);
        // will save the AI responses data to the backend
        await db.promise().query('INSERT INTO user_chats (user_id, role, message) VALUES (?, ?, ?)',
            [userID, 'ai', aiResponse]);
        res.status(200).json({ message: "successfully updated the chat in the database!" });
    } catch (err) {
        console.error('error updating chat', err);
        res.status(500).json({ message: "error updating chat!" })
    }
})

// this will get the user chat information
app.get('/api/user/chats', authenticateToken, async (req, res) => {
    const userID = req.user.id;
    try {
        // grabs the user chats from the users id and orders them bases on the time they were created_at!
        const [result] = await db.promise().query('SELECT * FROM user_chats WHERE user_id = ? ORDER BY created_at ASC', [userID]);
        // if nothing is returned!
        if (result.length === 0) {
            res.status(400).json({ message: "failed to get the users chat!" });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error('Error getting user chat', err);
        res.status(500).json({ message: "failed to get users chat" });
    }
})

// will be responsible for starting a new chat for the user!
app.delete('/api/user/newchat', authenticateToken, async (req, res) => {
    const userID = req.user.id;
    if (userID !== req.user.id) {
        return res.status(400).json({ message: 'Delete not allowed!' });
    }
    try {
        await db.promise().query('DELETE FROM user_chats WHERE user_id = ?', [userID]);
        res.status(200).json({ message: 'Successfully reset the users chat' });
    } catch (err) {
        console.error('Error reseting the user chat', err);
        res.status(500).json({ message: 'chat reset failed' });
    }
})

// starts the server!
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
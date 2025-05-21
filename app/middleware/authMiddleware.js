import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// my security for the backend before the user enters the site
export function authenticateToken(req, res, next) {
    // grabs authorization header
    const token = req.cookies.token;

    // if no token is found
    if (!token) {
        // access is denied
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // verifys the token accordingly 
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // if an error is procted 
        if (err) {
            // throws a 403
            return res.status(403).json({ message: 'Token is invalid or expired' });
        }
        // ensures the req.user that was found is now user
        req.user = user;
        // the job is done allow the next middleware check or the user to procceed!
        next();
    });
}
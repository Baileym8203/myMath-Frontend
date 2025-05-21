
import {useState, useEffect} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// will be the main function that handles the user unenrolling in a course
export default function UnEnroll() {
const [password, setPassword] = useState("");
const [userCourses, setUserCourses] = useState([]);
const [allCourses, setAllCourses] = useState([]);
const [courseID, setCourseID] = useState("");
const [showPassword, setShowPassword] = useState(false);

const router = useRouter();

// will grab the users enrolled courses!
useEffect(() => {
const handleUserCourse = async () => {
try {
const res = await axios.get('http://localhost:5000/api/user/courses', {withCredentials: true});
setUserCourses(res.data);
} catch (err) {
console.error('Error has occured fetching the user courses', err);
}
}
handleUserCourse();
}, []);

// will grab all of the courses!
useEffect(() => {
const handleCourse = async () => {
try {
const res = await axios.get('http://localhost:5000/api/courses', {withCredentials: true});
setAllCourses(res.data);
} catch (err) {
console.error('Error getting the courses', err);
}
}
handleCourse();
}, []);

// will handle the deleting of the course from the users profile!
const handleUnenrollCourse = async (e) => {
e.preventDefault();
try {
await axios.delete('http://localhost:5000/api/users/course', {data: {courseID, password}, withCredentials: true});
alert('Successfully Unenrolled in course');
setTimeout(() => {
location.reload();
}, 2000)
} catch (err) {
console.error('Error deleting the users course from enrollment', err);
}
}

// will handle showing the password to the user in the front end!
const handlePasswordShown = () => {
if (!showPassword) {
setShowPassword(true);
} else {
setShowPassword(false);
}
}

const courses = allCourses.filter(ac => userCourses.some(uc => uc.id === ac.id))

return (
<main className='bg-white mt-3 p-10 mb-3 rounded-md'>
    <h1 className='font-extrabold mb-3 text-center'>Unenroll From Course</h1>
<form onSubmit={handleUnenrollCourse} className='flex flex-col items-center justify-center'>
<select className='mb-3' onChange={(e) => setCourseID(e.target.value)} required>
<option value="">Drop A Course</option>
{courses.map((course) => (
<option key={course.id} value={course.id}>
{course.title}
</option>
))}
</select>
<input className='mb-3 w-100 border-1 p-2 shadow-md max-md:w-50' type={!showPassword ? "password" : "text"} placeholder='Confirm with password' onChange={(e) => setPassword(e.target.value)} />
<div className='flex'>
<button className='bg-red-400 hover:bg-red-300 shadow-sm rounded-sm p-1 mr-3' type='submit'>Unenroll Course</button>
<button className='bg-red-400 hover:bg-red-300 shadow-sm rounded-sm p-1' type='button' onClick={handlePasswordShown}>{!showPassword ? "Show Password" : "Hide Password"}</button>
</div>
</form>
</main>
)
}
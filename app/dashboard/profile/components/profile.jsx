import { useEffect, useState } from "react"
import api from "@/app/utilitys/axiosconfig";


// will be the main profile component!
export default function ProfileComponent() {
const [user, setUser] = useState(null);
const [userCourses, setUserCourses] = useState([]);


// will grab the users data for the profile!
useEffect(() => {
const handleUserFetch = async () => {
try {
const res = await api.get('/api/user');
setUser(res.data[0]);
} catch (err) {
console.error('Failed to get the users info');
}
}
handleUserFetch();
}, [])

// will get the users courses that they are enrolled in!
useEffect(() => {
const handleUserCourseFetch = async () => {
try {
const res = await api.get('/api/user/courses');
setUserCourses(res.data.map(course => course.course_name))
} catch (err) {
console.error('Error getting the users courses');
}
}
handleUserCourseFetch();
}, []);

// FIX THIS PAGE LAYOUT WEIRD WHEN THE VIEWPORT SHRINKS TO PHONE SIZE!

return (
<main className="bg-white shadow-lg p-10 rounded-lg text-black">
<div className="flex justify-around text-center max-md:justify-center max-md:flex-col max-md:items-center">
{user?.profile_image && (
<img src={`${process.env.NEXT_PUBLIC_API_URL}${user.profile_image}`} alt="Profile" className="mb-3 mb-0 w-24 h-24 rounded-full mr-5 max-md:mr-0" />
)}
<div className="bg-gray-200/70 p-5 rounded-sm">
<div className="flex flex-col">
{ user ? <h1>{`Name: ${user.name}`}</h1> : <h1>Loading....</h1> }
{ user ? <h1>{`Email: ${user.email}`}</h1> : <h1>Loading....</h1>}
</div>
<div className="flex flex-col">
<h1>Your Enrolled Courses</h1>
<div className="flex flex-col">
<h1>{userCourses.length > 0 ? userCourses.join(', ') : 'None'}</h1>
</div>
</div>
</div>
</div>
</main>
)
}

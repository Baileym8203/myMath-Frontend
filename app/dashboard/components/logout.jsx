import { useRouter } from "next/navigation";
import axios from "axios";


// my main logout function!
export default function LogoutComponent() {
const router = useRouter();

// will handle the logout logic
const handleLogout = async () => {
try {
// will await a post to the backend logout endpoint
await axios.post("http://localhost:5000/api/logout", {}, {withCredentials: true});
console.log('Successfully logged out');
// redirects the user to the authentication page
router.push('/authentication');
// grabs any errors along the way
} catch (err) {
console.error('Error logging out:', err);
}
}

return (
<button onClick={handleLogout} className=" bg-red-400 hover:bg-red-500 p-2 rounded-sm shadow-md max-md:ml-3">Logout</button>
)
}
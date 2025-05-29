"use client";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import LogoutComponent from "./logout";

// will be the dashboards main navigational bar!
export default function NavbarComponent() {

const router = useRouter();

// used to navigate the user through a select menu rather than links!
const handleOptiosnNav = (e) => {
const value = e.target.value;
if (value) router.push(value);
}

return (
<nav className="bg-white mx-auto px-6 py-3 flex justify-between items-center fixed top-0 w-full z-50 shadow-xl">
<img src="mymathlogo.png" className='w-14 h-14'></img>
<div className="min-md:hidden">
<select className='p-2 px-0 bg-gray-100 rounded-sm shadow-lg appearance-none' onChange={handleOptiosnNav} >
<option className="text-center text-black" value="">&#9776;</option>
<option className="text-center" value="/dashboard">
Dashboard
</option>
<option className="text-center" value="/dashboard/profile">
Profile
</option>
<option className="text-center" value="/dashboard/settings">
Settings
</option>
<option className="text-center" value="/dashboard/courselearner">
Study Chat
</option>
</select>
<LogoutComponent />
</div>
<div className='max-md:hidden'>
<Link className="min-sm:mr-5 hover:text-blue-600" href="/dashboard">Dashboard</Link>
<Link className="min-sm:mr-5 hover:text-blue-600" href="/dashboard/profile">Profile</Link>
<Link className="min-sm:mr-5 hover:text-blue-600" href="/dashboard/settings">Settings</Link>
<Link className="min-sm:mr-5 hover:text-blue-600" href="/dashboard/courselearner">Study Chat</Link>
<LogoutComponent />
</div>
</nav>
)
}
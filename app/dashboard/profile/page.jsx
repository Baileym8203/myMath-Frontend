"use client";
import ProfileComponent from "./components/profile";

// will be the main /dashboard/profile page!
export default function ProfilePage() {

return (
<main className="flex flex-col justify-center items-center p-6 bg-linear-to-br from-sky-400 via-violet-500 to-purple-400 min-h-screen">
<div className="bg-indigo-500 px-30 py-10 max-md:px-15 rounded-lg mb-3 shadow-inner/70 mt-10 min-md:flex-wrap">
<h1 className="font-extrabold text-5xl text-white mb-3 text-shadow-lg/20">Profile</h1>
</div>
<ProfileComponent />
</main>
)
}
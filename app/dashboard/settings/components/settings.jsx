import DeleteUserComponent from "./deleteuser";
import UpdateUserComponent from "./updateuser";
import UnEnroll from "./unenroll";

// the main setings component!
export default function SettingsComponent() {
    return (
        <main className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-400 min-h-screen px-4">
        <div className="mt-10 mb-3 py-10 px-40 bg-indigo-500 rounded-lg shadow-inner/70 max-md:px-20">
        <h1 className="font-extrabold text-5xl text-white">Settings</h1>
        </div>
<div className="flex max-lg:flex-col max-lg:justify-center">
<UpdateUserComponent />
<DeleteUserComponent />
</div>
<div className="flex flex-col justify-center">
<UnEnroll />
</div>
     </main>
    )
}
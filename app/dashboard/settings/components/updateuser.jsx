import {useState} from 'react';
import api from '@/app/utilitys/axiosconfig';

// will allow the user to change their email and or name on their profile!
export default function UpdateUserComponent() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);


// will update the users information!
const updateUser = (e) => {
    e.preventDefault();
// will be in charge of handleing the user update!
const handleUserPutRequest = async () => {
try {
 await api.put('/api/user/update', {name, email, password});
 alert('Successful user update');
} catch (err) {
console.error('Error user update failed', err);
}
}
handleUserPutRequest();
}

// will allow the user to see their typed password!
const showThePassword = () => {
if (!showPassword) {
setShowPassword(true);
} else {
setShowPassword(false);
}
}

return (
<main className='mr-3 max-lg:mr-0 max-lg:mb-3'>
<form onSubmit={updateUser} className=''>
<div className='flex flex-col bg-white shadow-lg justify-center items-center p-10 rounded-md max-md:p-3'>
<h1 className='mb-3 font-extrabold'>Update Your User</h1>
<input type='text' className='border-1 p-2 mb-3 w-100 shadow-md max-md:w-50' placeholder='Update your name' onChange={(e) => setName(e.target.value)}/>
<input type='email' className='border-1 p-2 w-100 shadow-md max-md:w-50' placeholder='Update your email' onChange={(e) => setEmail(e.target.value)}/>
<h2 className='mt-3'>Enter Your Password To Confirm</h2>
<input type={ showPassword ? 'text' : 'password'} className='border-1 p-2 mb-3 w-100 shadow-md max-md:w-50' placeholder='Confirm with your password' onChange={(e) => setPassword(e.target.value)}/>
<div className='flex'>
<button onClick={showThePassword} type="button" className='bg-red-400 hover:bg-red-300 p-1 rounded-sm mr-3'>{showPassword ? "Hide Password" : "Show Password"}</button>
<button type="submit" className='p-1 rounded-sm bg-blue-400 hover:bg-blue-300 shadow-md'>Submit</button>
</div>
</div>
</form>
</main>
);

}
import {useState} from 'react';
import api from '@/app/utilitys/axiosconfig';
import { useRouter } from 'next/navigation';

// will be the main function for deleteing the current user that is logged in!
export default function DeleteUserComponent() {
const [password, Setpassword] = useState("");
const [showPassword, setShowPassword] = useState(false);

const router = useRouter();

// will be responsible for deleting the user taht is currently logged in!
const deleteUser = (e) => {
e.preventDefault();
const fetchDelete = async () => {
try {
await api.delete('/api/user/delete', {password});
alert('Successfully Deleted your user, now redirecting to login....');
setTimeout(() => {
router.push('/authentication');
console.log('Going back to login!');
}, 1000);

} catch (err) {
console.error('Error deleting the user', err);
}
}
fetchDelete();
}

// will handle the showing of the passwords!
const handleShowPassword = () => {
if (!showPassword) {
setShowPassword(true);
} else {
setShowPassword(false);
}
}

// ADD ENTER PASSWORD TO CONFIRM!!
return (
<main className='flex flex-col items-center justify-center bg-white p-10 shadow-lg rounded-md text-black'>
<form onSubmit={deleteUser} className='flex flex-col items-center'>
<h1 className='font-extrabold'>Delete Your User</h1>
<input className='w-100 p-2 border-1 mt-3 shadow-md max-md:w-50' placeholder='Confirm With Your password' type={showPassword ? 'text' : 'password'} onChange={(e) => Setpassword(e.target.value)}/>
<div className='flex mt-3'>
<button className='bg-red-400 hover:bg-red-300 p-1 rounded-sm shadow-sm mr-3' type='submit'>Delete User</button>
<button className='bg-red-400 hover:bg-red-300 p-1 rounded-sm shadow-sm' type='button' onClick={handleShowPassword}>{showPassword ? 'Hide Password' : 'Show Password'}</button>
</div>
</form>
</main>
)
}
import {useState} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// will handle the user when the forgot their password
export default function ForgotPasswordComponent() {

const [email, setEmail] = useState("");
const [checkEmail, setCheckEmail] = useState(false);
const router = useRouter();

// will handle when the user forgets their password!
const handleForgotPasssword = async (e) => {
// will prevent refresh on submit
e.preventDefault();

try {
// awaits a post request to the backend with the users entered email
const post = await axios.post('http://localhost:5000/api/forgot-password', {email}, {withCredentials: true});
// if no post was made
if (!post) {
console.error('failed due to a post issue');
// when successful
setCheckEmail(false);
} else {
console.log('successfull forgot password!');
setCheckEmail(true);
// router pushes the user back to the login page after 5 seconds
// this allows the user to know they need to check their inbox before redirecting
setTimeout(() => {
    router.push('/authentication');
}, 3000);

}
// catches any errors along the way!
} catch (err) {
setCheckEmail(false);
console.error('forgot password failed', err)
}
}

// will push the user back to login if they wish!
const handleGoBack = () => {
router.push('/authentication')
}

return (
<form className='bg-gradient-to-br from-gray-700 to-gray-800 mx-auto flex flex-col items-center justify-center min-h-screen' onSubmit={handleForgotPasssword}>
<div className='flex flex-col justify-center items-center bg-gray-800 p-10 rounded-lg shadow-lg'>
<h1 className='  text-3xl mb-3 text-white'>Forgot Password</h1>
<input className=' bg-white p-2 shadow-md focus:ring-2' type='email' placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)}/>
<div className='mt-5'>
<button type='submit' className='p-1 rounded-sm bg-blue-500 hover:bg-blue-400'>Submit</button>
<button type='button' onClick={handleGoBack} className='bg-red-400 hover:bg-red-300 p-1 rounded-sm ml-3'>Back To Login</button>
</div>
{checkEmail ? <p className='text-white mt-3 font-extrabold'>Check Your Inbox</p> : null}
</div>
</form>
)
}
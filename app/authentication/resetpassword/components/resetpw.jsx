import {useState} from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

// will handle the user being able to reset their passwords
export default function ResetPasswordComponent() {
const [password, setPassword] = useState("")
const [passwordUpdated, setPasswordUpdated] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [passwordUpper, setPasswordUpper] = useState(false);
const [passwordSymbol, setPasswordSymbol] = useState(false);
const [hasTypedPassword, setHasTypedPassword] = useState(false);

const router = useRouter();
// allows the use of search params
const searchParams = useSearchParams();
// grabs the token from the users url!
const token = searchParams.get('token');

const handlePasswordReset = async (e) => {
// will prevent page refresh after submit!
e.preventDefault()

try {
// awaits a update request to the backend with the user typed password!
const updatePW = await axios.put('http://localhost:5000/api/reset-password', {password, token}, {withCredentials: true});
// if the request fails
if (!updatePW) {
console.error('Error updating password');
setPasswordUpdated(false);
}
// success!
console.log('Successful password update!')
setPasswordUpdated(true);
// will send the user to the authentication page after 3 seconds
setTimeout(() => {
router.push('/authentication');
}, 3000);
// catches any errors along the way!
} catch (err) {
console.error('Error with put', err);
setPasswordUpdated(false);
}
}

// will allow the user to see the password they are typing!
const handlePasswordShown = () => {
    if (!showPassword) {
 setShowPassword(true);
    } else {
 setShowPassword(false);
    }
    }

  // will handle needing an uppercase letter in the passsword!
  const handleSecurePassword = (e) => {
  
    let input = e.target.value;

  if (input.length > 0) {
  setHasTypedPassword(true);
  } else {
  setHasTypedPassword(false);
  }

  // if they have an uppercase they typed
  if (/[A-Z]/.test(e.target.value)) {
  setPasswordUpper(true);
  // no uppercase letter
  } else {
  setPasswordUpper(false);
  }
  // if they have a symbol they typed
  if (/[!@#$%^&*(),.?":{}|<>]/.test(e.target.value)) {
  setPasswordSymbol(true);
  // no symbol
  } else {
  setPasswordSymbol(false);
  }
}




return (
<form onSubmit={handlePasswordReset} className='mx-auto flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 to-gray-800'>
<div className=' mx-auto flex flex-col mt-5 justify-center items-center bg-gray-800 p-10 rounded-lg shadow-lg'>
<h1 className='text-white text-3xl mb-3'>Reset Your Password</h1>
<input type={showPassword ? "text" : "password"} placeholder='Enter your new password!' onChange={(e) => {setPassword(e.target.value); handleSecurePassword(e);}} className='p-2 bg-white focus:ring-2' />
{hasTypedPassword && !passwordUpper ? <p className='text-red-400 mt-3'>Must have 1 uppercase letter</p> : null}
{hasTypedPassword && !passwordSymbol ? <p className='text-red-400 mt-3'>Must have 1 symbol !@#$%^&*</p> : null}
<div className='flex flex-row mt-5'>
<button type='button' className='bg-red-400 hover:bg-red-300 p-1 rounded-sm' onClick={handlePasswordShown}>{showPassword ? "Hide password" : "Show password"}</button>
<button type="submit" className='bg-blue-500 hover:bg-blue-400 rounded-sm shadow-sm p-1 ml-3'>Submit</button>
</div>
{passwordUpdated ? <p className='text-white mt-3 font-extrabold'>Successfully updated your Password! redirecting to login...</p> : null}
</div>
</form>
)
}
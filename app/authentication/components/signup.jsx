
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// this will be my main sign up function
export default function SignUpComponent() {
  // allows route navigation on sign up!
  const router = useRouter();

  // all of the signup inputs!
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordUpper, setPasswordUpper] = useState(false);
  const [passwordSymbol, setPasswordSymbol] = useState(false);
  const [hasTypedPassword, setHasTypedPassword] = useState(false);


 
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

  // will handle the sign up!
  const handleSignUp = async (e) => {
    // will prevent the page from refreshing
    e.preventDefault();

    try {
      // only signs up user if they have an uppercase letter in their password and a symbol
      if (passwordUpper && passwordSymbol) {
        // will await the post to the backend with the following data!
      const post = await axios.post("http://localhost:5000/api/signup", {
        name,
        email,
        password,
      }, {withCredentials: true});
      console.log("user signed up ", post);
    
      // will route the user to home on sign up!
      if (post) {
        console.log("successful Sign Up!");
        router.push("/dashboard");
      }
    }
    } catch (err) {
      console.error("error has occured during sign up!", err);
    }
  };

  return (
    <form
      onSubmit={handleSignUp}
      className="text-center items-center justify-center w-full max-w-md bg-white bg-opacity-80 p-6 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl text-center mb-5">Signup</h1>
      <h2>Name</h2>
      <input
        type="name"
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="border-1 mb-5 p-2 w-full focus:ring-2 focus:ring-blue-400 shadow-md"
      />
      <h2>Email</h2>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="mb-5 border-1 p-2 w-full focus:ring-2 focus:ring-blue-400 shadow-md"
      />
      <h2>Password</h2>
      <input
        type={!showPassword ? "password" : "text"}
        onChange={(e) => {setPassword(e.target.value); handleSecurePassword(e);}}
        placeholder="Enter your password"
        className="mb-0 border-1 p-2 w-full focus:ring-2 focus:ring-blue-400 shadow-md"
      />
      {!passwordUpper && hasTypedPassword ? <p className="text-red-600 mb-2">Need 1 Upper Case Letter</p> : <p className="mb-0"></p>}
      {!passwordSymbol && hasTypedPassword ? <p className="text-red-600 mb-5">Need 1 Symbol</p> : <p className="mb-5"></p>}
     <button onClick={handlePasswordShown} type="button" className="bg-red-400 hover:bg-red-300 rounded-sm shadow-sm p-2 mr-5">{!showPassword ? "Show Password" : "Hide Password"}</button>
      <button
        type="submit"
        className="p-2 rounded-sm bg-blue-400 hover:bg-blue-300 shadow-sm"
      >
        Sign Up
      </button>
    </form>
  );
}

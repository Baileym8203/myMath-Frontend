
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// my main login function!
export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

 // will allow the user to see the password they are typing!
 const handlePasswordShown = async () => {
    if (!showPassword) {
 setShowPassword(true);
    } else {
 setShowPassword(false);
    }
    }

  const handleLogin = async (e) => {
    // will do this without refreshing the page
    e.preventDefault();

    try {
      // will send the user and password typed!
      const post = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      }, {withCredentials: true});
      // ensures post data flow
      if (!post) {
        console.error("login failed due to post issues");
      } else {
        console.log("successful login!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("login has failed", err);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="text-center items-center justify-center w-full max-w-md bg-white bg-opacity-80 p-6 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl text-center mb-5">Login</h1>
      <h2>Email</h2>
      <input
        type="email"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border-1 mb-5 focus:ring-2 focus:ring-blue-400 shadow-md"
      />
      <h2>Password</h2>
      <input
        type= {!showPassword ? "password" : "text"}
        placeholder="Enter your password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border-1 mb-5 focus:ring-2 focus:ring-blue-400 shadow-md"
      />
      <button onClick={handlePasswordShown} type="button" className="bg-red-400 hover:bg-red-300 rounded-sm shadow-sm p-2 mr-5 mt-3">{!showPassword ? "Show Password" : "Hide Password"}</button>
      <button onClick={() => router.push('/authentication/forgotpassword')} type="button" className="bg-red-400 hover:bg-red-300 rounded-sm shadow-sm p-2 mr-5 mt-3">Forgot Password</button>
      <button
        type="submit"
        className="bg-blue-400 rounded-sm p-2 hover:bg-blue-300 shadow-sm mt-3"
      >
        Login
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import SignUpComponent from "./components/signup";
import LoginComponent from "./components/login";

// gets the user through authentication
export default function Auth() {
  const [loginShow, setLoginShow] = useState(false);
  const [buttonSwitch, setButtonSwitch] = useState(false);

  // hook function to add auth
  const handleAuthShown = () => {
    // if both login show and button switch is false
    if (!loginShow && !buttonSwitch) {
      setLoginShow(true);
      setButtonSwitch(true);
      // if they are both true!
    } else {
      setLoginShow(false);
      setButtonSwitch(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-400">
    {/* The header */}
    <h1 className="text-6xl font-extrabold text-white drop-shadow-2xl tracking-wide mb-10 shadow-[-1px_9px_10px_rgba(0,0,255,0.6)]">
      MyMath
    </h1>
    <div className="relative w-full max-w-md min-h-[500px] flex flex-col items-center justify-center">
      
      {/* Sign Up Form */}
      <div className={`absolute top-0 left-0 w-full transition-opacity duration-1250 ${loginShow ? 'opacity-100 ' : 'opacity-0 '} ${loginShow ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <SignUpComponent />
        <button
          onClick={handleAuthShown}
          className="p-2 bg-green-400 rounded-sm hover:bg-green-300 mb-5 mt-5 shadow-lg w-full"
        >
          Show Login
        </button>
      </div>

      {/* Login Form */}
      <div className={`absolute top-0 left-0 w-full transition-opacity duration-1250 ${!loginShow ? 'opacity-100 ' : 'opacity-0'} ${!loginShow ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <LoginComponent />
        <button
          onClick={handleAuthShown}
          className="p-2 bg-green-400 rounded-sm hover:bg-green-300 mb-5 mt-5 shadow-lg w-full"
        >
          Show Signup
        </button>
      </div>

    </div>
  </main>
      );

}

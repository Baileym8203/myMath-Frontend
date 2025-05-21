"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


// this will be the main function that will show the math stuff
export default function Home() {
const router = useRouter();
useEffect(() => {
router.push('/dashboard');
})
}

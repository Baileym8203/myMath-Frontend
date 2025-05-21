import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard", "dashboard/profile", "dashboard/settings", "/dashboard/courselearner"];

export async function middleware(req) {
const {pathname} = req.nextUrl;

// only protects certain routes that have the token/require it
if (protectedRoutes.includes(pathname)) {
// grabing the token from the cookies
const token = req.cookies.get("token")?.value;
// if there is no token found
if (!token) {
console.log("No token found, redirecting to authentication.");
// redirects to the new url authentication
return NextResponse.redirect(new URL("/authentication", req.url));
}
// will try to verify the token
try {
// awaiting the token verification
await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
// allows the user to go to the pages that are protected
return NextResponse.next();
// error checks
} catch (err) {
console.error("Token invalid or expired, redirecting.", err);
// will redirect the user back to authentication
return NextResponse.redirect(new URL("/authentication", req.url));
}
}
// allows the user through to the pages that are protected!
return NextResponse.next();
}
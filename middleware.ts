import NextAuth from 'next-auth';
// import { NextResponse } from "next/server";
// import { auth } from "./auth"; 
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;

// export function middleware(req) {
//   const session = auth();
  
//   if (!session?.user && req.nextUrl.pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
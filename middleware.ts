import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session"); 

  const { pathname } = req.nextUrl;

  if (session && pathname === "/dashboard") {

    // return NextResponse.redirect(new URL("/dashboard", req.url));
   
  }

  if (!session && pathname.startsWith("/dashboard")) {

    // return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: ["/","/register", "/dashboard/:path*"], 
};

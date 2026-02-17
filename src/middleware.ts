import {NextRequest, NextResponse} from "next/server";
import { auth } from "@/auth";

export default async function Middleware(request: NextRequest) {

  const pathname = request.nextUrl.pathname;
  
  const session = await auth();
  const userRole = session?.user?.role; 

  
   if (pathname === "/login" && userRole) {
    switch (userRole) {
      case "employee":
        return NextResponse.redirect(new URL("/dashboard/employee", request.url));
      case "reader":
        return NextResponse.redirect(new URL("/dashboard/reader", request.url));
      case "admin":
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      default:
        return NextResponse.redirect(new URL("/", request.url));
    }
  }


  // If user is employee, restrict access to reader and admin routes
  if (userRole === "employee") {
    if (pathname.startsWith("/dashboard/reader") || pathname.startsWith("/dashboard/admin")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // If user is reader, restrict access to employee and admin routes
  if (userRole === "reader") {
    if (pathname.startsWith("/dashboard/employee") || pathname.startsWith("/dashboard/admin")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}


 export const config = {
        matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],

 }

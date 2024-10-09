import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === "/")
    return NextResponse.redirect(new URL("/sign-in", request.url));

  const protectedRoutes = ["/auth"];

  if (!session && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (session) {
    if (pathname === "/sign-in" || pathname === "/sign-up")
      return NextResponse.redirect(new URL("/auth/dashboard", request.url));
    if (pathname === "/auth") {
      return NextResponse.redirect(new URL("/auth/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/auth/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|profilepic.webp|robots.txt|sitemap.xml|sw.js|site.webmanifest|fonts|images|assets|icons).*)",
  ],
};

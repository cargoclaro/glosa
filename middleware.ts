import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("glosa-session")?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === "/")
    return NextResponse.redirect(new URL("/sign-in", request.url));

  const protectedRoutes = ["/home", "/gloss"];

  if (!session && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (session) {
    if (pathname === "/sign-in" || pathname === "/sign-up")
      return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/gloss",
    "/sign-in",
    "/sign-up",
    "/((?!api|_next/static|_next/image|favicon.ico|profilepic.webp|robots.txt|sitemap.xml|sw.js|site.webmanifest|fonts|images|assets|icons).*)",
  ],
};

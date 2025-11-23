import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/", "/login", "/registser", "/auth/success"];

  const isPublicRoute = publicRoutes.some((route) => {
    pathname.startsWith(route);
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/candidate/:path*",
    "/recruiter/:path*",
    "/notifications/:path*",
    "/chat/:path*",
  ],
};


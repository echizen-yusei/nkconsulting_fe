import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { localesConfig } from "./locales/locales-config";
import { USER } from "./constants";
import { PAGE } from "./constants/page";

export default createMiddleware(localesConfig);

const pageActiveIsLoggedIn = [PAGE.USER, PAGE.PRIVACY, PAGE.MEMBERSHIP_TERMS, PAGE.LEGAL_NOTICE];

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get(USER)?.value;
  const { pathname } = request.nextUrl;
  const isActiveLink = pageActiveIsLoggedIn.some((link) => pathname.startsWith(link));

  if (currentUser && !isActiveLink) {
    return NextResponse.redirect(new URL(PAGE.USER, request.url));
  }

  if (currentUser && pathname === PAGE.LOGIN) {
    request.cookies.delete(USER);
  }

  if (!currentUser && pathname.startsWith(PAGE.USER)) {
    return NextResponse.redirect(new URL(PAGE.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|serviceWorker).*)",
  ],
};

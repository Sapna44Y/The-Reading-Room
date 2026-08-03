import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has("session");

  if (!hasSession) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/books/:path*"],
};

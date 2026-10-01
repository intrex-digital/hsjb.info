import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/admin/login";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    // In dev without a secret set, fall back to a placeholder so the app doesn't crash.
    // The actual login will still fail because the backend uses its own secret.
    return new TextEncoder().encode("change-me-before-production");
  }
  return new TextEncoder().encode(secret);
}

async function verifyAccessToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isLoginPage = pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);

  if (!isAdminRoute) return NextResponse.next();

  const accessToken = request.cookies.get("access")?.value;

  // --- Authenticated user hitting login page → redirect to /admin
  if (isLoginPage && accessToken) {
    const valid = await verifyAccessToken(accessToken);
    if (valid) {
      return NextResponse.redirect(new URL(ADMIN_PREFIX, request.url));
    }
    // Token exists but is invalid/expired — let them see the login page
    return NextResponse.next();
  }

  // --- Unauthenticated user hitting a protected admin page → redirect to login
  if (!isLoginPage) {
    if (!accessToken) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const valid = await verifyAccessToken(accessToken);
    if (!valid) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set("next", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clear the stale cookie so the login page starts fresh
      response.cookies.delete("access");
      response.cookies.delete("refresh");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

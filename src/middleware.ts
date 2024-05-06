import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "./lib/config";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const path = req.nextUrl.pathname;

  if (
    path !== "/" &&
    !path.startsWith("/fundamental") &&
    !path.startsWith("/cook") &&
    !path.startsWith("/analysis") &&
    !path.startsWith("/auth/signin") &&
    !path.startsWith("/auth/signup")
  ) {
    // Skip public routes
    return NextResponse.next();
  }
  const { isValid } = await validateRequestMiddleware(req.nextUrl.origin);

  if (!isValid) {
    if (path.startsWith("/auth/sign")) {
      /*
      User is not signed in, allow access to /auth/signin and /auth/signup
      But redirect to /auth/signin if the user attempts to access other routes
      that is not /auth/signin or /auth/signup
      */
      return NextResponse.next();
    }

    const url = req.nextUrl.origin + "/auth/signin";
    console.log(`[middleware] redirect to: ${url}`);
    return NextResponse.redirect(url);
  }
  // if path is /auth/signin, /auth/signup, we should redirect to the root if the user is already signed in
  if (path.startsWith("/auth/sign")) {
    return NextResponse.redirect(req.nextUrl.origin);
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/",
    "/fundamental/:path*",
    "/auth/signin",
    "/auth/signup",
    "/cook",
    "/analysis/:path*",
  ],
};

const validateRequestMiddleware = async (
  baseUrl: string
): Promise<{
  isValid: boolean;
  sessionId?: string;
}> => {
  const sessionId = cookies().get(COOKIE_NAME)?.value;

  if (!sessionId) {
    return {
      isValid: false,
    };
  }
  try {
    //prismadb is not available for edge middleware, so we handle via api route
    const resp = await fetch(`${baseUrl}/api/auth/validate-session`, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });
    if (!resp.ok) {
      return {
        isValid: false,
      };
    }
    const data = (await resp.json()) as {
      valid?: boolean;
    };
    if (data.valid !== true) {
      return {
        isValid: false,
      };
    }
    return {
      isValid: true,
      sessionId,
    };
  } catch (err) {
    return {
      isValid: false,
    };
  }
};

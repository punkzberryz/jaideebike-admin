import { generateState } from "arctic";
import { github } from "@/lib/auth/oauth-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const state = generateState();
  const url = await github.createAuthorizationURL(state);
  cookies().set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });
  return NextResponse.redirect(url);
}

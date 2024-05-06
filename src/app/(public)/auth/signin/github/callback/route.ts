import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { NextRequest, NextResponse } from "next/server";
import { github } from "@/lib/auth/oauth-client";
import { prismadb } from "@/lib/prismadb";
import { createSession } from "@/lib/auth/auth";
export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = request.nextUrl;
  const redirectedUrl = url.origin + "?redirectedFrom=auth/signin/github";
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.json(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();
    const existingUser = await prismadb.user.findFirst({
      where: {
        githubId: githubUser.id,
      },
    });
    if (existingUser) {
      await createSession(existingUser.id);
      return NextResponse.redirect(redirectedUrl, { status: 302 });
    }
    const userId = generateIdFromEntropySize(10); //16 characters long
    await prismadb.user.create({
      data: {
        id: userId,
        displayName: githubUser.login,
        githubId: githubUser.id,
      },
    });
    await createSession(userId);
    return NextResponse.redirect(redirectedUrl, { status: 302 });
  } catch (err) {
    if (err instanceof OAuth2RequestError) {
      // invalid code
      return NextResponse.json(null, {
        status: 400,
      });
    }
    console.log(err);
    return NextResponse.json(null, {
      status: 500,
    });
  }
}
interface GitHubUser {
  id: number;
  login: string;
}

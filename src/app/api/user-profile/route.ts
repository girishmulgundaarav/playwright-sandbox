import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization") || "";
  
  if (!authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized: Missing or invalid Bearer token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  let role = "admin";
  if (token.includes("editor")) {
    role = "editor";
  } else if (token.includes("viewer")) {
    role = "viewer";
  }

  return NextResponse.json({
    status: "success",
    user: {
      username: `${role}_user`,
      role: role,
      email: `${role}@example.com`,
      tokenPayload: {
        iss: "playwright-practice-web",
        sub: `user-${role}-123`,
        roles: [role],
        exp: Math.floor(Date.now() / 1000) + 3600
      }
    }
  });
}

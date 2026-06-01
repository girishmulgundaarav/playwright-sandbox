import { NextResponse } from "next/server";

async function handleMirror(request: Request) {
  const method = request.method;

  // Gather all request headers
  const headersObj: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headersObj[key] = value;
  });

  let bodyPayload: any = null;
  const contentType = request.headers.get("content-type") || "";

  if (method !== "GET" && method !== "HEAD" && contentType.includes("application/json")) {
    try {
      bodyPayload = await request.clone().json();
    } catch (e) {
      bodyPayload = { error: "Failed to parse JSON body" };
    }
  }

  return NextResponse.json({
    method,
    headers: headersObj,
    body: bodyPayload
  });
}

export async function GET(request: Request) {
  return handleMirror(request);
}

export async function POST(request: Request) {
  return handleMirror(request);
}

export async function PUT(request: Request) {
  return handleMirror(request);
}

export async function DELETE(request: Request) {
  return handleMirror(request);
}

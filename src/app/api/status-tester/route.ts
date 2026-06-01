import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const codeStr = searchParams.get("code") || "200";
  const code = parseInt(codeStr, 10);

  if (isNaN(code) || code < 100 || code > 599) {
    return NextResponse.json(
      { error: "Bad Request: Invalid status code value" },
      { status: 400 }
    );
  }

  const isError = code >= 400;
  const responsePayload = {
    status: isError ? "error" : "success",
    code,
    message: isError
      ? `Simulated HTTP Error response triggered: Code ${code}`
      : `Simulated HTTP Success response triggered: Code ${code}`,
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(responsePayload, { status: code });
}

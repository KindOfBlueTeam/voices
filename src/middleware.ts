import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  // No password set — allow access (useful in local dev with no env file)
  if (!adminPassword) return NextResponse.next();

  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const colonIndex = decoded.indexOf(":");
      const password = decoded.slice(colonIndex + 1);
      if (password === adminPassword) return NextResponse.next();
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Voices Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};

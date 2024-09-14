import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server" ;
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    if (!session && req.nextUrl.pathname !== "/") {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
}
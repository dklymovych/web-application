import { type NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  if (req.headers.get('Authorization')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [ '/' ],
}

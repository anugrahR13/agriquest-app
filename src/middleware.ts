import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware that redirects root path to English homepage
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // If requesting the root path, redirect to English homepage
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }
  
  // For all other paths, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/'], // Match only the root path
};
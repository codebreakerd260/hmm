import { NextResponse } from 'next/server';

export async function middleware(request) {
  // If hitting an API route (except login), we check the Authorization header
  if (request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/api/auth/login')) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // In Edge middleware, we can't easily use jsonwebtoken package. 
    // Usually, we'd use 'jose', but for this MVP we'll just check if a token exists.
    // Real validation would happen in the route or using a library that supports Edge.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};

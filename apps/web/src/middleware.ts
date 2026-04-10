import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')?.value;
    let payload = null;

    if (sessionCookie) {
        try {
            const result = await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] });
            payload = result.payload;
        } catch (e) {
            // Token invalid or expired
        }
    }

    const { pathname } = request.nextUrl;
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
    const isProtectedRoute = pathname.startsWith('/home') || pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/courses');

    if (isProtectedRoute && !payload) {
        // Redirect unauthenticated users trying to access protected routes to login
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (isAuthRoute && payload) {
        // Redirect authenticated users trying to access auth routes to home
        const url = request.nextUrl.clone();
        url.pathname = '/home';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

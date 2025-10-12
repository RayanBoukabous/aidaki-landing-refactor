import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
});

export function middleware(request: NextRequest) {
    // Handle internationalization first
    const intlResponse = intlMiddleware(request);

    // If intl middleware returns a response (redirect), use it
    if (intlResponse) {
        return intlResponse;
    }

    // Extract locale from pathname
    const pathname = request.nextUrl.pathname;
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // If no locale in pathname, redirect to default locale
    if (!pathnameHasLocale && pathname === '/') {
        return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
    }

    // Get the locale from the pathname
    const segments = pathname.split('/');
    const locale = segments[1];

    // Check if it's a valid locale
    if (!locales.includes(locale as any)) {
        return NextResponse.next();
    }

    // Get the path without locale
    const pathWithoutLocale = '/' + segments.slice(2).join('/');

    const token = request.cookies.get('token')?.value;

    // Public routes that don't require authentication (without locale prefix)
    const publicRoutes = ['/', '/login', '/register'];
    const isPublicRoute = publicRoutes.some(
        (route) =>
            pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
    );

    // If user is not authenticated and trying to access a protected route
    if (!token && !isPublicRoute) {
        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If user is authenticated and trying to access login/register, redirect to dashboard
    if (
        token &&
        (pathWithoutLocale === '/login' || pathWithoutLocale === '/register')
    ) {
        const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all paths except API routes, static files, and Next.js internals
        '/((?!api|_next|_vercel|.*\\..*).*)',
        // Always run for root
        '/',
    ],
};

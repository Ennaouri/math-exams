import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const trustedCrawlerPattern =
  /googlebot|adsbot-google|mediapartners-google|bingbot|duckduckbot|slurp|yandexbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot/i;

const blockedUserAgentPattern =
  /ahrefsbot|semrushbot|mj12bot|dotbot|petalbot|bytespider|dataforseobot|barkrowler|blexbot|megaindex|seekportbot|serpstatbot|scrapy|python-requests|curl|wget|httpclient|go-http-client|java\/|libwww-perl|nikto|sqlmap|acunetix|nmap|masscan|zgrab|headlesschrome|phantomjs/i;

const sensitivePathPattern =
  /^\/(?:wp-admin|wp-login\.php|xmlrpc\.php|\.env|\.git|phpmyadmin|vendor|cgi-bin|server-status|actuator|debug|config|backup|backups|database|db)(?:\/|$)/i;

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // 1. Security proxy checks
  if (sensitivePathPattern.test(pathname)) {
    return new NextResponse('Not found', { status: 404 });
  }

  if (
    userAgent &&
    blockedUserAgentPattern.test(userAgent) &&
    !trustedCrawlerPattern.test(userAgent)
  ) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (
    request.method !== 'GET' &&
    request.method !== 'HEAD' &&
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/login')
  ) {
    return new NextResponse('Method not allowed', { status: 405 });
  }

  // 2. intl middleware for localization
  // Skip static files with extensions and API routes
  if (pathname.includes('.') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames, excluding static files (containing .) and API routes
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

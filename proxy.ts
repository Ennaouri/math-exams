import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const trustedCrawlerPattern =
  /googlebot|adsbot-google|mediapartners-google|bingbot|duckduckbot|slurp|yandexbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot/i;

const blockedUserAgentPattern =
  /ahrefsbot|semrushbot|mj12bot|dotbot|petalbot|bytespider|dataforseobot|barkrowler|blexbot|megaindex|seekportbot|serpstatbot|scrapy|python-requests|curl|wget|httpclient|go-http-client|java\/|libwww-perl|nikto|sqlmap|acunetix|nmap|masscan|zgrab|headlesschrome|phantomjs/i;

const sensitivePathPattern =
  /^\/(?:wp-admin|wp-login\.php|xmlrpc\.php|\.env|\.git|phpmyadmin|vendor|cgi-bin|server-status|actuator|debug|config|backup|backups|database|db)(?:\/|$)/i;

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

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

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|ads.txt|uploads/).*)',
  ],
};

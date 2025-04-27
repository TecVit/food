import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";

const publicRoutes = [
  // HTML
  { path: "/occurrence-light.html", whenAuthenticated: "next" },
  
  { path: "/", whenAuthenticated: "next" },
  { path: "/entrar/cliente", whenAuthenticated: "redirect" },
  { path: "/entrar/empresa", whenAuthenticated: "redirect" },
  { path: "/cadastrar/cliente", whenAuthenticated: "redirect" },
  { path: "/cadastrar/empresa", whenAuthenticated: "redirect" },
  { path: "/esqueci-minha-senha", whenAuthenticated: "next" },

  { path: "/loja/:id", whenAuthenticated: "next" },
  
  { path: "/termos-de-uso", whenAuthenticated: "next" },
  { path: "/politica-de-privacidade", whenAuthenticated: "next" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isPublicRoute = (route: { path: string; whenAuthenticated: string }) => {
    if (route.path.includes(':')) {
      const regexPath = new RegExp(`^${route.path.replace(/:\w+/g, '[^/]+')}$`);
      return regexPath.test(path);
    }
    return route.path === path;
  };
  const publicRoute = publicRoutes.find((route) => isPublicRoute(route));

  const uuid = request.cookies.get('id');
  const access_token = request.cookies.get('access_token')?.value;
  const role = request.cookies.get('role')?.value;

  if (!uuid && publicRoute) {
    return NextResponse.next();
  }

  if (!uuid && !access_token && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  if (uuid && access_token && role && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = role === 'client' ? `/cliente/carrinho` : role === 'store' ? '/empresa/produtos' : '/';
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
    * Match all request paths except for the ones starting with:
    * - api (API routes)
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - favicon.ico, sitemap.xml, robots.txt (metadata files)
    */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ]
}
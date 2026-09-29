import { next } from "@vercel/functions";

/**
 * Vercel Routing Middleware: protects the whole site with HTTP Basic Auth while it is in private preview.
 * Credentials come from the SITE_USER / SITE_PASSWORD environment variables of the Vercel project.
 * To make the site public, delete SITE_PASSWORD in Vercel and redeploy.
 */

export const config = {
  matcher: "/:path*",
};

function safeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export default function middleware(request: Request) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return next();

  const user = process.env.SITE_USER ?? "andres";
  const header = request.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    const [u, ...rest] = atob(header.slice(6)).split(":");
    if (safeEqual(u, user) && safeEqual(rest.join(":"), password)) return next();
  }

  return new Response("Acceso restringido", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Andres Mata Caro - vista previa", charset="UTF-8"' },
  });
}

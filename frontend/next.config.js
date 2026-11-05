/** The browser talks only to Next.js; /api/* is proxied to the Express backend.
 *  This keeps the HTTP-only auth cookie same-origin (no CORS problems). */
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

module.exports = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }];
  },
};

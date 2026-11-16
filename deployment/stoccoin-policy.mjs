const base = "/stoccoin";
const pages = new Set([
  "",
  "dashboard",
  "stocks",
  "cryptocurrencies",
  "news",
  "nft",
  "trade",
  "institutional",
  "derivatives",
  "support",
  "signup",
  "login",
]);

export function stoccoinResponse(request, assets) {
  const url = new URL(request.url);
  if (url.pathname !== base && !url.pathname.startsWith(base + "/"))
    return null;
  if (!["GET", "HEAD"].includes(request.method)) {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }
  if (url.pathname === base) {
    url.pathname += "/";
    return Response.redirect(url, 301);
  }
  const page = url.pathname
    .slice(base.length + 1)
    .replace(/\/$/, "")
    .toLowerCase();
  // Only known app pages use the shell. Missing assets keep their real 404.
  if (pages.has(page)) {
    url.pathname = base + "/";
    url.search = "";
    return assets.fetch(new Request(url, request));
  }
  return assets.fetch(request);
}

/** Review deployments are isolated, uncached documents and excluded from indexing. */
export async function reviewResponse(request, serve) {
  const pathname = new URL(request.url).pathname;
  let response;
  if (pathname === "/robots.txt") {
    response = new Response(
      request.method === "HEAD" ? null : "User-agent: *\nDisallow: /\n",
      { headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  } else if (pathname === "/sitemap.xml") {
    response = new Response(null, { status: 404 });
  } else {
    response = await serve();
  }
  const headers = new Headers(response.headers);
  headers.set("x-robots-tag", "noindex, nofollow, noarchive");
  if (headers.get("content-type")?.includes("text/html"))
    headers.set("cache-control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

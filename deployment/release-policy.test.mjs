import assert from "node:assert/strict";
import test from "node:test";
import { buildingResponse } from "./building-page.mjs";
import { reviewResponse } from "./review-policy.mjs";

test("building mode covers portfolio routes and cached navigation variants only", async () => {
  for (const path of [
    "/",
    "/index.html",
    "/index.txt",
    "/__next.__PAGE__.txt",
    "/__next._full.txt",
    "/projects",
    "/projects/",
    "/projects/__next.projects.__PAGE__.txt",
    "/contact/__next._full.txt",
    "/calendar/__next.calendar.__PAGE__.txt",
    "/contact.html",
    "/calendar.txt",
    "/projects?_rsc=review",
  ]) {
    const response = buildingResponse(
      new Request("https://royalpinto007.com" + path),
      "building",
    );
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Currently building/);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  for (const path of [
    "/facetworks/",
    "/facetworks/privacy/pagefold",
    "/_next/static/chunks/app.js",
    "/scene/coast-mobile.webp",
    "/unknown",
  ]) {
    assert.equal(
      buildingResponse(
        new Request("https://royalpinto007.com" + path),
        "building",
      ),
      null,
    );
  }
  assert.equal(
    buildingResponse(new Request("https://royalpinto007.com/"), "portfolio"),
    null,
  );
});

test("holding page honors HEAD and rejects writes without redirecting or sending them", async () => {
  const head = buildingResponse(
    new Request("https://royalpinto007.com/", { method: "HEAD" }),
    "building",
  );
  assert.equal(await head.text(), "");
  const post = buildingResponse(
    new Request("https://royalpinto007.com/", { method: "POST", body: "test" }),
    "building",
  );
  assert.equal(post.status, 405);
  assert.equal(post.headers.get("allow"), "GET, HEAD");
});

test("review excludes indexing and preserves streamed asset/error/security headers", async () => {
  const binary = new Uint8Array([1, 0, 255]);
  const response = await reviewResponse(
    new Request("https://dev.royalpinto007.com/scene/missing.webp"),
    () =>
      new Response(binary, {
        status: 404,
        headers: {
          "content-type": "image/webp",
          "x-frame-options": "DENY",
          "cache-control": "public, max-age=300",
        },
      }),
  );
  assert.equal(response.status, 404);
  assert.equal(
    response.headers.get("x-robots-tag"),
    "noindex, nofollow, noarchive",
  );
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("cache-control"), "public, max-age=300");
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), binary);
});

test("review HTML bypasses cache; robots and sitemap never call the production service", async () => {
  const html = await reviewResponse(
    new Request("https://dev.royalpinto007.com/"),
    () =>
      new Response("<h1>Review</h1>", {
        headers: { "content-type": "text/html" },
      }),
  );
  assert.equal(html.headers.get("cache-control"), "no-store");
  assert.match(await html.text(), /Review/);
  const serve = () => {
    throw new Error("Unexpected upstream request");
  };
  const robots = await reviewResponse(
    new Request("https://dev.royalpinto007.com/robots.txt"),
    serve,
  );
  assert.match(await robots.text(), /Disallow: \//);
  const sitemap = await reviewResponse(
    new Request("https://dev.royalpinto007.com/sitemap.xml"),
    serve,
  );
  assert.equal(sitemap.status, 404);
});

test("building mode holds nested collection HTML and navigation payloads", async () => {
  for (const path of [
    "/projects/games",
    "/projects/games/",
    "/projects/games.html",
    "/projects/games.txt",
    "/projects/web3/__next._full.txt",
    "/projects/products?_rsc=review",
  ]) {
    const response = buildingResponse(
      new Request("https://royalpinto007.com" + path),
      "building",
    );
    assert.ok(response, path);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Currently building/);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  assert.equal(
    buildingResponse(
      new Request("https://royalpinto007.com/projects-old/games"),
      "building",
    ),
    null,
  );
  assert.equal(
    buildingResponse(
      new Request("https://dev.royalpinto007.com/projects/games"),
      "portfolio",
    ),
    null,
  );
  assert.equal(
    buildingResponse(
      new Request("https://royalpinto007.com/projects/games", {
        method: "POST",
      }),
      "building",
    ).status,
    405,
  );
});

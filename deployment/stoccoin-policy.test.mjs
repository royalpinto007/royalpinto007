import assert from "node:assert/strict";
import test from "node:test";
import { stoccoinResponse } from "./stoccoin-policy.mjs";

test("Stoccoin canonical path keeps query parameters and does not match siblings", () => {
  const assets = {
    fetch() {
      throw new Error("Unexpected asset read");
    },
  };
  const result = stoccoinResponse(
    new Request("https://royalpinto007.com/stoccoin?from=projects"),
    assets,
  );
  assert.equal(result.status, 301);
  assert.equal(
    result.headers.get("location"),
    "https://royalpinto007.com/stoccoin/?from=projects",
  );
  for (const path of [
    "/",
    "/projects",
    "/facetworks/",
    "/stoccoins",
    "/stoccoin-other/app",
  ]) {
    assert.equal(
      stoccoinResponse(new Request("https://royalpinto007.com" + path), assets),
      null,
    );
  }
});

test("Stoccoin refreshes known routes while preserving missing asset errors", async () => {
  const seen = [];
  const assets = {
    fetch(request) {
      seen.push([new URL(request.url).pathname, request.method]);
      return new Response(request.method === "HEAD" ? null : "shell", {
        status: request.url.endsWith(".js") ? 404 : 200,
      });
    },
  };
  for (const path of [
    "/stoccoin/",
    "/stoccoin/Stocks",
    "/stoccoin/News/",
    "/stoccoin/login?next=demo",
  ]) {
    const response = await stoccoinResponse(
      new Request("https://royalpinto007.com" + path),
      assets,
    );
    assert.equal(response.status, 200);
    assert.deepEqual(seen.at(-1), ["/stoccoin/", "GET"]);
  }
  const missing = await stoccoinResponse(
    new Request("https://royalpinto007.com/stoccoin/assets/missing.js"),
    assets,
  );
  assert.equal(missing.status, 404);
  assert.deepEqual(seen.at(-1), ["/stoccoin/assets/missing.js", "GET"]);
  const head = await stoccoinResponse(
    new Request("https://royalpinto007.com/stoccoin/News", { method: "HEAD" }),
    assets,
  );
  assert.equal(await head.text(), "");
  assert.deepEqual(seen.at(-1), ["/stoccoin/", "HEAD"]);
});

test("Stoccoin rejects writes before reaching static assets", () => {
  const assets = {
    fetch() {
      throw new Error("Write reached asset binding");
    },
  };
  for (const method of ["POST", "PUT", "DELETE"]) {
    const response = stoccoinResponse(
      new Request("https://royalpinto007.com/stoccoin/Stocks", { method }),
      assets,
    );
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET, HEAD");
  }
});

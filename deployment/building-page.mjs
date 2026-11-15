export const portfolioPaths = [
  "/",
  "/index.html",
  "/projects",
  "/contact",
  "/calendar",
];

export function buildingResponse(request, mode) {
  const pathname = new URL(request.url).pathname.replace(/\/$/, "") || "/";
  const canonical = pathname.replace(/\.(html|txt)$/, "");
  const navigationPayload =
    pathname === "/index.txt" ||
    /^\/(?:projects\/|contact\/|calendar\/)?__next\.[\w.-]+\.txt$/.test(
      pathname,
    );
  if (
    mode !== "building" ||
    (!navigationPayload &&
      !portfolioPaths.includes(pathname) &&
      !portfolioPaths.includes(canonical))
  )
    return null;
  if (!["GET", "HEAD"].includes(request.method)) {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }
  return new Response(request.method === "HEAD" ? null : buildingPage, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "content-security-policy":
        "default-src 'none'; script-src https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'",
    },
  });
}

export const buildingPage = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light">
<title>Royal Simpson Pinto | Software engineer</title><meta name="description" content="Royal Simpson Pinto. Software engineer, independent builder and open-source contributor. A new home for my work is taking shape."><link rel="canonical" href="https://royalpinto007.com/"><link rel="icon" href="/favicon.ico">
<style>
*{box-sizing:border-box}body{margin:0;background:#f5f5ee;color:#123247;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}a:focus-visible{outline:3px solid #9b3265;outline-offset:6px}.shell{max-width:1600px;margin:auto;padding:32px 5vw;min-height:100svh;display:flex;flex-direction:column}header,footer{display:flex;align-items:center;justify-content:space-between;gap:24px}header{font-size:15px;font-weight:700}header a{padding:14px 0;border-bottom:1px solid #9daeba}.status{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;display:flex;align-items:center;gap:10px}.status:before{content:'';width:8px;height:8px;border-radius:50%;background:#aa3d70;box-shadow:0 0 0 5px #e7cfdd}.stage{display:grid;grid-template-columns:1.05fr 1fr;align-items:center;gap:3vw;flex:1;padding:70px 0}h1{font-size:clamp(56px,7.5vw,126px);font-weight:800;letter-spacing:-.075em;line-height:.98;margin:30px 0}h1 span{color:#a33369}p{max-width:33ch;font-size:17px;line-height:1.65;color:#3e5566}.action{display:inline-flex;align-items:center;gap:32px;padding:17px 24px;background:#14394e;color:#fffaf0;border-radius:8px;margin-top:20px;font-size:14px;font-weight:600;box-shadow:inset 0 1px #ffffff33}.action:hover{background:#9c3263}.art{overflow:clip;position:relative;aspect-ratio:1;isolation:isolate;display:grid;place-items:center}.halo{position:absolute;inset:7%;border-radius:50%;background:radial-gradient(ellipse at 35% 30%,#bad9ea,#e9bfd5 55%,#f3d4b7);box-shadow:0 0 90px #d4e7ee55}.art:before,.art:after{content:'';position:absolute;inset:0;border:1px solid #94b0c255;border-radius:50%;transform:rotate(-20deg) scaleY(.45)}.art:after{inset:12%;transform:rotate(30deg) scaleY(.65)}.art img{width:100%;height:auto;max-width:100%;position:relative;filter:drop-shadow(0 22px 16px #29596c22)}.tag{position:absolute;bottom:5%;right:4%;padding:14px 18px;border:1px solid #d1dce4;background:#fffaf0e8;border-radius:8px;font-size:11px;letter-spacing:.12em;text-transform:uppercase}footer{border-top:1px solid #b6c5cd;padding-top:24px;font-size:12px;color:#425b6b}footer nav{display:flex;gap:24px}footer a{padding:10px 0}footer a:hover{color:#9c3263}@media(prefers-reduced-motion:no-preference){.art img{animation:float 8s ease-in-out infinite}@keyframes float{50%{transform:translateY(-12px) rotate(1deg)}}}@media(max-width:700px){.shell{padding:20px 24px}.stage{grid-template-columns:1fr;padding:60px 0 35px;gap:16px}h1{font-size:clamp(56px,13vw,82px)}.art{max-width:460px;width:100%;margin:auto}.art img{width:100%}header a{font-size:12px}footer{align-items:flex-start;flex-direction:column;gap:10px}footer nav{gap:24px}.tag{right:0}p{font-size:16px}}
</style></head><body><div class="shell"><header><span>Royal Simpson Pinto</span><a href="https://hire.royalpinto007.com/">Work with me ↗</a></header><main class="stage"><div><div class="status">Currently building</div><h1>A new home.<br><span>Same curiosity.</span></h1><p>I'm putting the finishing touches on a new home for my work. See you here soon.</p><a class="action" href="mailto:royalpinto007@gmail.com">Get in touch <span aria-hidden="true">↗</span></a></div><div class="art" aria-hidden="true"><div class="halo"></div><img src="/scene/studio-island-mobile.webp" alt="" width="640" height="427"><span class="tag">A little work in progress</span></div></main><footer><span>Software engineer · Independent builder · Open source</span><nav aria-label="Social links"><a href="https://github.com/royalpinto007">GitHub ↗</a><a href="https://x.com/royalpinto007">X ↗</a><a href="/facetworks/">Facetworks ↗</a></nav></footer></div></body></html>`;

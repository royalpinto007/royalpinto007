# Portfolio website

Source for [royalpinto007.com](https://royalpinto007.com/), built with Next.js static export, React, Tailwind, GSAP, and an optional Remotion Player.

```sh
npm ci
npm run dev
npm run lint
node --test scripts/contribution-wall.test.mjs
npm run build
```

Home opens as a coastal poster with condensed display typography and the original portrait in the foreground. The image itself remains unchanged; a CSS silhouette clips its background so it belongs to the environment. Moving light, subtle water glints and pointer parallax share one pause control. Three lighting treatments are selectable, with reduced-motion, offscreen and hidden-tab handling. The compact mobile header keeps navigation in a native disclosure. Supporting sections use a restrained light surface. [Art provenance and the final generation prompt](docs/home-scene-art.md) document the environment assets. Native architecture walkthroughs cover AashiNyra, the SignalizeAI extension, and BoardEject. The open-source story uses generic contribution language, preserves the green GitHub calendar’s real counts, and presents the programmes as the beginning of a longer journey.

Home’s experiments mount one same-origin demo at a time on request, expand to a usable viewport, and restore keyboard focus when closed. The central asset assembly allows same-origin framing only for these three preview demos.

Browser regression scripts in `scripts/check-*.py` use Python Playwright and Chrome. Set `PORTFOLIO_URL` to a server hosting the exported build or the deployed site. Run browser suites serially.

Production combines this portfolio with the Facetworks gallery and demos under `/facetworks/`. Release from the central `Open-Source/Final` workspace after checks, build, assembly, asset audit, and browser verification:

```sh
python3 run_sites.py check portfolio
python3 run_sites.py build portfolio
python3 stage_site.py
python3 audit_assets.py
python3 publish.py portfolio
python3 verify_live.py
```

Do not deploy this repository's `out/` alone to the combined production Worker. Its standalone Wrangler configuration is historical. The scheduled contribution workflow refreshes and validates source; production publication uses the complete bundle above. The hire service is released separately.

Credentials belong in ignored environment files or deployment secret stores. Build output, browser evidence, and local caches are excluded from Git.

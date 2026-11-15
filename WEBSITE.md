# Portfolio website

Source for [royalpinto007.com](https://royalpinto007.com/), built with Next.js static export, React, Tailwind, GSAP, and an optional Remotion Player.

```sh
npm ci
npm run dev
npm run lint
node --test scripts/contribution-wall.test.mjs
npm run build
```

Home uses the original sunset portrait, illustrated project workflows, and architecture maps with optional design notes. Motion respects reduced-motion preferences and has static fallbacks. The contribution calendar preserves GitHub's recorded activity and green intensity levels.

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

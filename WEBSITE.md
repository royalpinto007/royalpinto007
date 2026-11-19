# Portfolio website

Source for [royalpinto007.com](https://royalpinto007.com/). The [README](README.md) is my GitHub profile; this file covers the site.

Built with Next.js (static export), React, Tailwind CSS, GSAP, three.js and the Remotion Player.

## Run it

Requires Node 22.

```sh
npm ci
npm run dev      # http://localhost:3000
npm run lint
npm test
npm run build    # static site in out/
```

`out/` is plain static files, so it can be hosted anywhere: Cloudflare Pages, Netlify, Vercel or GitHub Pages.

## Layout

| Path | What lives there |
| --- | --- |
| `app/` | Pages, layouts and global styles |
| `components/` | UI, scenes and interactive demos |
| `data/` | Profile, projects, categories and contribution data |
| `lib/` | Motion helpers and SEO metadata |
| `public/` | Images, fonts, `llms.txt` and other static files |
| `scripts/` | Contribution-wall generator, preview capture and browser checks |

## Make it yours

Use this repository as a template, then:

1. Edit `data/profile.ts` with your name, bio, email and links.
2. Replace the projects in `data/site.ts` and the other files in `data/`.
3. Replace the images. Mine are served from Cloudflare R2 at `assets.royalpinto007.com`; put yours in `public/` (or your own bucket) and update the URLs in `data/` and the components.
4. Set your GitHub username in `scripts/gen-wall.mjs` and run `GITHUB_TOKEN=<token> node scripts/gen-wall.mjs` to rebuild the contribution data. The `refresh-contributions` workflow keeps it current.
5. Replace this repository's `README.md` with your own.
6. Update `lib/seo.ts`, `public/llms.txt` and `public/robots.txt` with your domain.

The code is MIT licensed. My portrait, film, resume, artwork and written content are not, so please replace them. See [LICENSE](LICENSE).

## Browser checks

`scripts/check-*.py` are Playwright (Python) regression checks. Point `PORTFOLIO_URL` at a running build and run them one at a time.

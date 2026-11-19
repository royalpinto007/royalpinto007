# Portfolio website

Source for [royalpinto007.com](https://royalpinto007.com/). The [README](README.md) is my GitHub profile; this file covers the site.

Built with Next.js (static export), React, Tailwind CSS, GSAP, three.js and the Remotion Player.

This repository is only the website code. Content (profile, projects, categories, contribution totals) and media live in Cloudflare R2 and are served from `assets.royalpinto007.com`.

## Run it

Requires Node 22.

```sh
npm ci
npm run dev      # pulls content, then http://localhost:3000
npm run lint
npm run build    # pulls content, then static site in out/
```

`out/` is plain static files, so it can be hosted anywhere.

## Layout

| Path | What lives there |
| --- | --- |
| `app/` | Routes only: pages, layout, icons, and page-specific CSS next to its page |
| `components/layout/` | Header, footer and site-wide behaviour |
| `components/home/` | Home page sections (hero, systems, calendar, reel, board demo) |
| `components/film/` | The Remotion film played in the reel |
| `components/projects/` | Project collections, previews and Facetworks pages |
| `components/scenery/` | Painted backgrounds and coastal scenes |
| `components/ui/` | Small shared pieces (brand icons) |
| `styles/global/` | Tailwind entry, theme and site-wide styles |
| `styles/home/` | Home page styles, in load order |
| `lib/data/` | Shapes the content JSON into what pages render |
| `lib/motion/` | Motion helpers |
| `lib/seo.ts` | Metadata and structured data |
| `scripts/pull-content.mjs` | Downloads the content JSON into `content/` (not committed) |
| `public/` | Icons, font, `llms.txt`, `robots.txt` and the sitemap |

## Make it yours

1. Host your own content JSON files (same names as in `scripts/pull-content.mjs`) and set `CONTENT_BASE` to their URL.
2. Host your own images and update the URLs in your content and the components.
3. Replace `README.md`, and update `lib/seo.ts`, `public/llms.txt` and `public/robots.txt` with your domain.

The code is MIT licensed. My content, portrait, film and artwork are not. See [LICENSE](LICENSE).

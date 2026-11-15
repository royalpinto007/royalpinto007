# Portfolio review workflow

The full work-in-progress portfolio is reviewed at https://dev.royalpinto007.com/.
The public https://royalpinto007.com/ temporarily shows the requested “Currently building” page. The existing gallery, demos, privacy policies and hire site remain available at their public addresses.

The two hostnames use separate Cloudflare Workers. Publishing a review must target the dev service, never the public portfolio service. The review Worker sends `X-Robots-Tag: noindex, nofollow, noarchive`, disallows crawling, omits its sitemap and avoids caching HTML. It is a public review URL, not an authenticated private environment.

Use the central `Open-Source/Final` release tools to check/build the portfolio, assemble the shared assets, audit links and run browser checks. `python3 publish.py dev` updates only the review service. The public holding-page choice is persisted in the central `release-settings.json`; do not switch it to the portfolio until Royal asks for a public launch. Production holding mode covers both page URLs and exported Next navigation payloads.

## Calendar readiness

`/calendar` is linked in desktop and mobile navigation. It is a styled empty page with its own artwork. It contains no events, booking widget, integrations or assumed calendar behavior. Royal will supply the content and requirements before this feature is implemented.

## Current interface

The studio belongs to selected work on Home. Engineering uses its own glass-city sculpture, Projects an arcade cabinet, Contact a glass telephone, the reel a film treatment and the footer a layered coastal sailboat. Each uses a distinct silhouette and motion within one light palette. Display typography carries the large headings; readable sans-serif type supports project cards, controls and contact details. Native category and mobile menus retain keyboard and no-JavaScript navigation.

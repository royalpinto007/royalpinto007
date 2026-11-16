"""Rebase independent static builds without changing their source repositories."""
import json
import re

TEXT_TYPES = {'.html', '.css', '.js', '.mjs', '.json', '.xml', '.txt', '.svg', '.webmanifest'}


def rebase_references(text, routes):
    if not routes:
        return text
    # Match a complete path segment, never a similarly named project's prefix.
    pattern = re.compile('|'.join(re.escape(path) for path in sorted(routes, key=len, reverse=True)) + r'''(?=$|[/\s?\#"'`<)\\])''')
    return pattern.sub(lambda match: routes[match.group()], text)


def rebase_root_links(text, base):
    """Root-built additions have local HTML links but no existing shared base."""
    return re.sub(r'''((?:href|src|poster)=["'])/(?!/|facetworks/|_next/|designs/)''', lambda match: match[1] + base + '/', text)


def organize_facetworks(output, sites, catalogue):
    routes = {site['legacy_path']: site['path'] for site in sites if site.get('legacy_path')}
    for asset in output.rglob('*'):
        if asset.is_file() and asset.suffix in TEXT_TYPES:
            text = asset.read_text()
            updated = rebase_references(text, routes)
            if updated != text:
                asset.write_text(updated)
    for site in sites:
        if not site.get('root_links'):
            continue
        root = output / site['path'].lstrip('/')
        for asset in root.rglob('*.html'):
            text = rebase_root_links(asset.read_text(), site['path'])
            if site.get('replace_origin'):
                text = text.replace(site['replace_origin'] + '/', 'https://royalpinto007.com' + site['path'] + '/')
            text = text.replace('https://royalpinto007.agentpostmortem.com/', 'https://royalpinto007.com/')
            # The new Jalebi showcase must not advertise its private repository.
            text = re.sub(r'<a\b[^>]*href=["\']https://github.com/Facetworks/jalebi["\'][^>]*>.*?</a>', '', text, flags=re.S)
            asset.write_text(text)
    # Exact rules must precede wildcard rules in Cloudflare's _redirects file.
    exact = [f'{old} {new}/ 301' for old, new in routes.items()]
    wildcard = [f'{old}/* {new}/:splat 301' for old, new in routes.items()]
    (output / '_redirects').write_text('\n'.join(exact + wildcard) + '\n')
    feed = {
        'generated': 'portfolio/data/facetworks.json',
        'counts': {'total': len(catalogue), 'sites': sum(p['collection'] == 'designs' for p in catalogue), 'experiments': sum(p['collection'] == 'graphics' for p in catalogue)},
        'collections': {'sites': {'title': 'Design sites', 'blurb': 'Independent website concepts.'}, 'experiments': {'title': 'Interactive graphics', 'blurb': 'Physics, 3D, particles, light and sound.'}},
        'projects': [{**p, 'live': 'https://royalpinto007.com/facetworks/' + p['collection'] + '/' + p['slug'] + '/', 'collection': 'sites' if p['collection'] == 'designs' else 'experiments'} for p in catalogue],
    }
    (output / 'facetworks/projects.json').write_text(json.dumps(feed, indent=2) + '\n')

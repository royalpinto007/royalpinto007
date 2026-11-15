"""Verify distinct chapter artwork, mobile loading and closing-scene cleanup."""
from pathlib import Path
import json, os
from playwright.sync_api import sync_playwright

BASE = os.getenv('PORTFOLIO_URL', 'http://127.0.0.1:8947').rstrip('/')
OUT = Path(os.getenv('DISTINCT_ARTIFACTS', '/tmp/portfolio-distinct-scenes'))
OUT.mkdir(parents=True, exist_ok=True)
errors, checks = [], []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for width in [320, 390, 768, 1440]:
        context = browser.new_context(viewport={'width':width, 'height':1000}, reduced_motion='reduce')
        page = context.new_page()
        page.on('pageerror', lambda e: errors.append(str(e)))
        requests = []
        page.on('request', lambda r: requests.append(r.url))
        page.goto(BASE, wait_until='networkidle')
        assert not any('/scene/arcade' in r or '/scene/telephone' in r or '/scene/sailboat' in r for r in requests)
        for route in ['/', '/projects', '/contact']:
            page.goto(BASE+route, wait_until='networkidle')
            for scene in page.locator('.world-scene').all():
                scene.scroll_into_view_if_needed()
                if scene.locator('img').count():
                    scene.locator('img').evaluate('async n=>{await n.decode()}')
            images = page.locator('.world-scene img').evaluate_all('ns=>ns.map(n=>n.currentSrc)')
            assert len(images) == len(set(images)), (width, route, 'Repeated chapter artwork')
            if route == '/':
                assert not any('/studio-island' in src for src in images)
                assert sum('/engine-island' in src for src in images) == 1
                assert sum('/liquid-chrome' in src for src in images) == 1
                assert page.locator('.reel-poster .reel-backdrop').count() == 1
                assert page.locator('.reel-poster .world-scene').count() == 0
            else:
                assert not any('studio-island' in src for src in images)
                name = 'arcade' if route == '/projects' else 'telephone'
                src = page.locator(f'.world-{name} img').evaluate('n=>n.currentSrc')
                assert src.endswith(f'/scene/{name}{"-mobile" if width < 768 else ""}.webp')
            assert page.locator('.footer-invitation .horizon-stage').count() == 1
            assert page.locator('.footer-invitation').evaluate("n=>getComputedStyle(n).backgroundImage==='none'")
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), (width, route)
            if route == '/contact' and width >= 768:
                card = page.locator('.contact-invitation').bounding_box()
                scene = page.locator('.contact-invitation .world-scene').bounding_box()
                assert scene['y'] >= card['y'] and scene['y']+scene['height'] <= card['y']+card['height'], 'Telephone scene is cropped by its card'
                heading = page.locator('.contact-invitation h2').bounding_box()
                art = page.locator('.contact-invitation .world-scene').bounding_box()
                assert heading['x']+heading['width'] <= art['x']+5, 'Contact copy crosses the phone artwork'
            target = page.locator('.site-footer' if route == '/' else '.contact-invitation' if route == '/contact' else '.projects-heading')
            target.scroll_into_view_if_needed()
            page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
            target.screenshot(path=str(OUT/f'{route.strip("/") or "footer"}-{width}.png'))
            checks.append({'width':width, 'route':route, 'unique_art':True, 'overflow':False})
        context.close()

    context = browser.new_context(viewport={'width':1440,'height':1000}, reduced_motion='no-preference')
    page = context.new_page()
    page.on('pageerror', lambda e:errors.append(str(e)))
    page.goto(BASE, wait_until='networkidle')
    page.wait_for_function("document.documentElement.dataset.motion==='ready'")
    page.locator('.footer-invitation').scroll_into_view_if_needed()
    page.wait_for_timeout(900)
    assert page.locator('.horizon-boat').evaluate('n=>!!n.style.transform')
    page.emulate_media(reduced_motion='reduce')
    page.wait_for_function("document.documentElement.dataset.motion==='reduced'")
    assert page.locator('.horizon-boat').evaluate('n=>!n.style.transform')
    assert page.locator('.horizon-reflection').evaluate('n=>!n.style.transform')
    context.close()
    context = browser.new_context(java_script_enabled=False,viewport={'width':390,'height':900})
    page = context.new_page()
    for route in ['/', '/projects', '/contact']:
        page.goto(BASE+route, wait_until='networkidle')
        assert page.locator('.horizon-boat').count() == 1
        assert page.get_by_role('link',name='Hire me',exact=True).last.is_visible()
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    context.close()
    browser.close()
assert not errors, errors
(OUT/'verification.json').write_text(json.dumps({'ok':True,'checks':checks,'closing_motion_cleanup':True,'no_js':True,'runtime_errors':errors},indent=2)+'\n')
print('PASS distinct artwork across 3 routes/4 widths, mobile assets, no extra Home raster downloads, closing motion cleanup and no-JS')

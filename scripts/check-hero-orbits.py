"""Check rendered orbital movement and reversible scene separation."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.getenv('PORTFOLIO_URL', 'http://127.0.0.1:8947').rstrip('/')
OUT = Path(os.getenv('ORBIT_ARTIFACTS', '/tmp/portfolio-orbits'))
OUT.mkdir(parents=True, exist_ok=True)
rows, errors = [], []


def pose(node):
    return node.evaluate('n=>getComputedStyle(n).transform')


def settle(page):
    page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for width in [320, 390, 768, 1440, 1920]:
        context = browser.new_context(viewport={'width': width, 'height': 1000}, reduced_motion='no-preference')
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        requests = []
        page.on('request', lambda request: requests.append(request.url))
        page.goto(BASE, wait_until='networkidle')
        page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='true'")
        for image in page.locator('.hero-orbits img').all():
            image.evaluate('async n=>await n.decode()')
            assert ('-mobile.webp' in image.evaluate('n=>n.currentSrc')) == (width < 768)
        assert not any('.glb' in url for url in requests)
        assert page.locator('.reel-player').count() == 0
        drift = page.locator('.hero-orbit-outer .hero-orbit-drift')
        before = pose(drift)
        page.wait_for_timeout(500)
        assert pose(drift) != before, 'The physical layers needed input to move'
        page.get_by_role('button', name='Pause hero effects').click()
        settle(page)
        page.wait_for_timeout(60)
        before = pose(drift)
        page.wait_for_timeout(250)
        assert pose(drift) == before, 'Orbit continued after pause'
        control = page.get_by_role('button', name='Separate scene layers', exact=True)
        assert control.evaluate('n=>{const r=n.getBoundingClientRect(),h=n.closest("section").getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth&&r.top>=h.top&&r.bottom<=h.bottom}')
        assert control.evaluate('n=>{const a=n.getBoundingClientRect();return [...document.querySelectorAll(".hero-work-link,.scene-light,.hero-effects-toggle,.hero-open-source")].every(x=>{const b=x.getBoundingClientRect();return Math.min(a.right,b.right)<=Math.max(a.left,b.left)||Math.min(a.bottom,b.bottom)<=Math.max(a.top,b.top)})}')
        layer = page.locator('.hero-orbit-outer')
        closed = pose(layer)
        before_requests = len(requests)
        before_portrait = page.locator('.portrait img').evaluate('n=>({src:n.currentSrc,filter:getComputedStyle(n).filter,mask:getComputedStyle(n).maskImage})')
        page.screenshot(path=str(OUT/f'closed-{width}.png'))
        control.focus()
        page.keyboard.press('Enter')
        page.wait_for_function("document.querySelector('.hero-reframe').getAttribute('aria-pressed')==='true'")
        page.wait_for_timeout(950)
        assert pose(layer) != closed
        assert len(requests) == before_requests, 'Reframing loaded another runtime or asset'
        page.screenshot(path=str(OUT/f'open-{width}.png'))
        assert page.locator('.portrait img').evaluate('n=>({src:n.currentSrc,filter:getComputedStyle(n).filter,mask:getComputedStyle(n).maskImage})') == before_portrait
        page.keyboard.press('Enter')
        page.wait_for_timeout(950)
        assert pose(layer) == closed, 'Scene failed to reassemble'
        page.get_by_role('button', name='Play hero effects').click()
        # The start of #work is already visible on tall viewports. Move fully
        # past the hero rather than relying on "if needed" for that section.
        page.locator('.work-world-aashinyra').evaluate('n=>n.scrollIntoView({block:"start"})')
        page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='false'")
        settle(page)
        before = pose(drift)
        page.wait_for_timeout(200)
        assert pose(drift) == before
        page.emulate_media(reduced_motion='reduce')
        assert page.locator('.hero-orbits').evaluate('n=>n.getAnimations({subtree:true}).length') == 0
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        rows.append({'width': width, 'responsive_art': True, 'idle_motion': True, 'native_reversible_transform': True, 'no_control_collisions': True, 'portrait_unchanged': True, 'no_interaction_download': True, 'pause_offscreen_reduce': True})
        context.close()
        print('PASS orbital hero', width, flush=True)
    context = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 1000})
    page = context.new_page()
    page.goto(BASE, wait_until='networkidle')
    assert page.locator('.hero-reframe').count() == 0
    assert page.locator('.hero-orbits img').count() == 2
    assert page.locator('.hero-orbits').evaluate('n=>n.getAnimations({subtree:true}).every(a=>a.playState!=="running")')
    context.close()
    browser.close()

assert not errors, errors
(OUT/'verification.json').write_text(json.dumps({'ok': True, 'base': BASE, 'checks': rows, 'static_no_js': True, 'runtime_errors': errors}, indent=2)+'\n')

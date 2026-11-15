"""Verify the authored reel, playback controls and static alternatives in Chrome."""
import json
import os
import re
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

BASE = os.getenv('PORTFOLIO_URL', 'http://127.0.0.1:8947').rstrip('/')
OUT = Path(os.getenv('REEL_ARTIFACTS', '/tmp/portfolio-reel'))
OUT.mkdir(parents=True, exist_ok=True)
checks, errors = [], []

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for width in [320, 390, 768, 1440]:
        context = browser.new_context(viewport={'width': width, 'height': 1000}, reduced_motion='no-preference')
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(BASE, wait_until='networkidle')
        page.wait_for_function("getComputedStyle(document.querySelector('.portrait')).opacity==='1'")
        page.screenshot(path=str(OUT/f'hero-{width}.png'))
        stage = page.locator('.reel-stage')
        stage.scroll_into_view_if_needed()
        page.wait_for_selector('[data-reel-frame]')
        page.wait_for_function("Number(document.querySelector('[data-reel-frame]').dataset.reelFrame)>40")
        page.get_by_role('button', name='Pause reel').click()
        paused = page.locator('[data-reel-frame]').get_attribute('data-reel-frame')
        page.wait_for_timeout(220)
        assert page.locator('[data-reel-frame]').get_attribute('data-reel-frame') == paused
        stage.screenshot(path=str(OUT/f'reel-{width}.png'))
        page.keyboard.press('Tab')
        page.keyboard.press('Shift+Tab')
        assert page.get_by_role('button', name='Play reel').evaluate('n=>n===document.activeElement')
        assert page.evaluate("getComputedStyle(document.activeElement).outlineStyle !== 'none'")
        page.keyboard.press('Enter')
        page.wait_for_function('(frame)=>document.querySelector("[data-reel-frame]").dataset.reelFrame!==frame', arg=paused)
        page.wait_for_function("document.querySelector('[data-reel-scene]').dataset.reelScene==='1' && Number(document.querySelector('[data-reel-frame]').dataset.reelFrame)%150>40")
        page.get_by_role('button', name='Pause reel').click()
        stage.screenshot(path=str(OUT/f'reel-product-{width}.png'))
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), width
        page.get_by_role('button', name='Play reel').click()
        page.locator('.footer-invitation .primary-link').focus()
        page.wait_for_function("document.querySelector('.reel-player').dataset.playing==='false'")
        frame = page.locator('[data-reel-frame]').get_attribute('data-reel-frame')
        page.wait_for_timeout(220)
        assert page.locator('[data-reel-frame]').get_attribute('data-reel-frame') == frame
        footer = page.locator('.footer-invitation')
        assert footer.evaluate("n=>getComputedStyle(n).backgroundImage==='none' && getComputedStyle(n).backgroundColor==='rgba(0, 0, 0, 0)'")
        footer.screenshot(path=str(OUT/f'footer-{width}.png'))
        stage.scroll_into_view_if_needed()
        page.emulate_media(reduced_motion='reduce')
        page.wait_for_function("document.querySelector('.reel-player')===null")
        page.wait_for_function("document.querySelector('.reel-poster > img').complete && document.querySelector('.reel-poster > img').naturalWidth>0")
        assert page.locator('.reel-poster > img').evaluate('n=>n.complete && n.naturalWidth>0')
        checks.append(f'{width}px: real animation, keyboard play/pause, offscreen pause, unboxed footer, live reduced-motion fallback')
        print('PASS', checks[-1], flush=True)
        context.close()

    context = browser.new_context(reduced_motion='reduce')
    page = context.new_page()
    requested = []
    page.on('request', lambda request: requested.append(request.url))
    page.goto(BASE, wait_until='networkidle')
    page.locator('.reel-stage').scroll_into_view_if_needed()
    assert page.locator('.reel-player').count() == 0
    page.wait_for_function("document.querySelector('.reel-poster > img').complete && document.querySelector('.reel-poster > img').naturalWidth>0")
    assert page.locator('.reel-poster > img').evaluate('n=>n.complete && n.naturalWidth>0')
    checks.append('initial reduced motion uses the static composition')
    context.close()

    context = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 900})
    page = context.new_page()
    page.goto(BASE, wait_until='networkidle')
    page.locator('.reel-stage').scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('.reel-poster > img').complete && document.querySelector('.reel-poster > img').naturalWidth>0")
    assert page.locator('.reel-poster > img').evaluate('n=>n.complete && n.naturalWidth>0')
    assert page.locator('.work-piece').count() == 3
    checks.append('without JavaScript, static reel and all three selected project entries remain available')
    context.close()

    context = browser.new_context(reduced_motion='no-preference')
    page = context.new_page()
    html = page.request.get(BASE).text()
    initial = {urlparse(src).path for src in re.findall(r'<script[^>]+src="([^"]+)"', html)}
    context.route('**/_next/static/chunks/*.js', lambda route: route.continue_() if urlparse(route.request.url).path in initial else route.abort())
    page.goto(BASE, wait_until='networkidle')
    page.locator('.reel-stage').scroll_into_view_if_needed()
    assert page.locator('.reel-player').count() == 0
    page.wait_for_function("document.querySelector('.reel-poster > img').complete && document.querySelector('.reel-poster > img').naturalWidth>0")
    assert page.locator('.reel-poster > img').evaluate('n=>n.complete && n.naturalWidth>0')
    checks.append('failed optional player download preserves the static composition and project links')
    browser.close()

assert not errors, errors
(OUT/'verification.json').write_text(json.dumps({'base': BASE, 'checks': checks, 'errors': errors, 'ok': True}, indent=2)+'\n')
for check in checks:
    print('PASS', check, flush=True)

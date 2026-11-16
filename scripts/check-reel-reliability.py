"""A slow/stalled optional player must never replace useful content with a blank frame."""
import json
import os
from pathlib import Path
from PIL import Image, ImageStat
from playwright.sync_api import sync_playwright

BASE = os.getenv('PORTFOLIO_URL', 'https://dev.royalpinto007.com').rstrip('/')
OUT = Path(os.getenv('REEL_ARTIFACTS', '/tmp/reel-reliability'))
OUT.mkdir(parents=True, exist_ok=True)
checks = []

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for width in [390, 1914]:
        context = browser.new_context(viewport={'width': width, 'height': 995}, reduced_motion='no-preference')
        context.add_init_script('''(() => {
          const raf = window.requestAnimationFrame.bind(window);
          window.requestAnimationFrame = callback => raf(time => {
            if (document.querySelector('[data-reel-frame="0"]')) return;
            callback(time);
          });
        })()''')
        page = context.new_page()
        page.goto(BASE, wait_until='networkidle')
        stage = page.locator('.reel-stage')
        stage.scroll_into_view_if_needed()
        page.wait_for_selector('[data-reel-frame]', state='attached')
        page.wait_for_timeout(500)
        path = OUT / f'stalled-{width}.png'
        stage.screenshot(path=str(path), animations='allow')
        image = Image.open(path).convert('RGB')
        content = image.crop((0, 0, image.width, int(image.height * .8)))
        contrast = sum(ImageStat.Stat(content).stddev) / 3
        assert contrast > 14, f'{width}px: stalled first frame is a blank panel (contrast {contrast:.2f})'
        checks.append(f'{width}px: stopped first-frame clock retains a complete visible composition')
        context.close()
    context = browser.new_context(viewport={'width': 390, 'height': 995}, reduced_motion='no-preference')
    context.route('**/portrait-original.webp', lambda route: route.fulfill(status=200, content_type='image/webp', body=b'broken image'))
    page = context.new_page()
    page.goto(BASE, wait_until='networkidle')
    page.locator('.reel-stage').scroll_into_view_if_needed()
    page.wait_for_function("Number(document.querySelector('[data-reel-frame]')?.dataset.reelFrame)>30")
    page.get_by_role('button', name='Pause reel').click()
    page.get_by_role('button', name='Watch Ship chapter').click()
    page.wait_for_function("document.querySelector('.reel-player')===null")
    assert page.locator('.reel-poster-copy strong').is_visible()
    assert page.locator('.reel-static-note').is_visible()
    assert page.locator('.reel-shell').get_attribute('data-player') == 'false'
    page.locator('.reel-shell').screenshot(path=str(OUT / 'failed-composition.png'))
    checks.append('composition image failure removes the player and keeps the complete poster and static caption')
    context.close()
    browser.close()

(OUT / 'reliability.json').write_text(json.dumps({'checks': checks, 'ok': True}, indent=2) + '\n')
for check in checks:
    print('PASS', check)

"""Check automatic typing, physical motion, stable layout and film clocks."""
import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = os.getenv('PORTFOLIO_URL', 'http://127.0.0.1:8947').rstrip('/')
OUT = Path(os.getenv('KINETIC_ARTIFACTS', '/tmp/portfolio-kinetic'))
OUT.mkdir(parents=True, exist_ok=True)
rows, errors = [], []


def pose(node):
    return node.evaluate('n=>{const s=getComputedStyle(n);return [s.transform,s.clipPath,s.opacity]}')


def settle(page):
    page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for width in [320, 390, 768, 1440]:
        context = browser.new_context(viewport={'width': width, 'height': 1000}, reduced_motion='no-preference')
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        requests = []
        page.on('request', lambda request: requests.append(request.url))
        page.goto(BASE, wait_until='networkidle')
        page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='true'")
        assert not any('.glb' in url for url in requests)
        assert page.locator('.reel-player').count() == 0, 'The optional film loaded in the opening viewport'
        assert page.locator('.typing-visual').get_attribute('aria-hidden') == 'true'
        assert page.locator('.typing-description [aria-live]').count() == 0
        assert page.locator('.typing-static').inner_text() == 'AI agents. Full-stack. Automation. Web3.'
        link = page.get_by_role('link', name='Agents projects', exact=True)
        assert link.evaluate('n=>n.getBoundingClientRect().height>=44')
        before_link = link.bounding_box()
        # Wait for a real typing phase, without setting animation times or input.
        page.wait_for_function("[...document.querySelectorAll('.typing-reveal')].some(n=>getComputedStyle(n.parentElement).opacity==='1' && parseFloat(getComputedStyle(n).clipPath.split(' ')[1])>20 && parseFloat(getComputedStyle(n).clipPath.split(' ')[1])<95)", timeout=5000)
        words = page.locator('.typing-word')
        active = next(n for n in words.all() if n.evaluate('n=>getComputedStyle(n).opacity') == '1')
        reveal, caret = active.locator('.typing-reveal'), active.locator('.typing-caret')
        before = (pose(reveal), pose(caret))
        page.wait_for_timeout(160)
        assert (pose(reveal), pose(caret)) != before, 'Typing did not advance automatically'
        assert link.bounding_box() == before_link, 'Typing moved the primary proof link'
        # The app dock responds to interaction; visible scenery owns idle motion.
        ball = page.locator('.hero-orbit-outer .hero-orbit-drift')
        before = pose(ball)
        page.wait_for_timeout(350)
        assert pose(ball) != before, 'Hero scenery did not move without input'
        page.get_by_role('button', name='Pause hero effects').click()
        page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='false'")
        settle(page)
        before = (pose(ball), words.evaluate_all('ns=>ns.map(n=>n.getAnimations({subtree:true}).map(a=>a.currentTime))'))
        page.wait_for_timeout(300)
        assert (pose(ball), words.evaluate_all('ns=>ns.map(n=>n.getAnimations({subtree:true}).map(a=>a.currentTime))')) == before
        page.get_by_role('button', name='Play hero effects').click()
        page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='true'")
        page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))")
        page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='false'")
        settle(page)
        before = pose(ball)
        page.wait_for_timeout(250)
        assert pose(ball) == before
        page.evaluate("delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))")
        page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='true'")
        page.screenshot(path=str(OUT/f'hero-{width}.png'))
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.locator('.reel-stage').scroll_into_view_if_needed()
        page.wait_for_selector('[data-reel-frame]')
        page.wait_for_function("Number(document.querySelector('[data-reel-frame]').dataset.reelFrame)>35")
        page.get_by_role('button', name='Pause reel').click()
        page.get_by_role('button', name='Watch Code chapter').click()
        film = page.locator('.skill-rail-film')
        assert film.evaluate('n=>n.getAnimations({subtree:true}).length') == 0, 'Film has an independent CSS clock'
        before = pose(film.locator('.skill-rail-ball-route'))
        page.get_by_role('button', name='Play reel').click()
        page.wait_for_function("Number(document.querySelector('[data-reel-frame]').dataset.reelFrame)>80")
        page.get_by_role('button', name='Pause reel').click()
        assert pose(film.locator('.skill-rail-ball-route')) != before
        before = pose(film.locator('.skill-rail-track'))
        page.wait_for_timeout(250)
        assert pose(film.locator('.skill-rail-track')) == before
        page.locator('.reel-stage').screenshot(path=str(OUT/f'film-{width}.png'))
        assert page.locator('.hero-cinema').get_attribute('data-active') == 'false'
        page.emulate_media(reduced_motion='reduce')
        page.locator('.hero-cinema').scroll_into_view_if_needed()
        page.wait_for_function("document.querySelector('.hero-cinema').dataset.effectsEnabled==='false'")
        assert page.locator('.typing-static').evaluate('n=>getComputedStyle(n).position') == 'static'
        assert not page.locator('.typing-visual').is_visible()
        assert page.locator('.skill-rail-live').evaluate('n=>n.getAnimations({subtree:true}).length') == 0
        rows.append({'width': width, 'automatic_typing': True, 'stable_dock_link': True, 'idle_scene': True, 'pause_hidden_offscreen': True, 'frame_driven_film': True, 'reduced_motion': True})
        context.close()
        print('PASS kinetic opening', width, flush=True)
    context = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 1000})
    page = context.new_page()
    page.goto(BASE, wait_until='networkidle')
    assert not page.locator('.typing-visual').is_visible()
    assert page.locator('.typing-static').is_visible()
    assert page.locator('.skill-rail-live').evaluate('n=>n.getAnimations({subtree:true}).every(a=>a.playState!=="running")')
    assert page.get_by_role('link', name='View projects').is_visible()
    context.close()
    browser.close()

assert not errors, errors
(OUT/'verification.json').write_text(json.dumps({'base': BASE, 'checks': rows, 'no_js': True, 'runtime_errors': errors, 'ok': True}, indent=2)+'\n')
print('PASS automatic opening, native pause, film timing and static alternatives')

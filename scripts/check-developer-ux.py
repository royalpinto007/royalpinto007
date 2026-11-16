"""Exercise compact scene controls, the simplified hero and honest calendar."""
import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = os.getenv('PORTFOLIO_URL', 'http://127.0.0.1:8947').rstrip('/')
OUT = Path(os.getenv('UX_ARTIFACTS', '/tmp/portfolio-developer-ux'))
OUT.mkdir(parents=True, exist_ok=True)
rows, errors = [], []


def pose(node):
    return node.evaluate('n=>getComputedStyle(n).transform')


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for width in [320, 390, 768, 1440, 1920]:
        context = browser.new_context(viewport={'width': width, 'height': 1000}, reduced_motion='no-preference', is_mobile=width < 768, has_touch=width < 768)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(BASE, wait_until='networkidle')
        assert ' '.join(page.locator('h1').inner_text().lower().split()) == 'i build software.'
        assert 'Indie dev' in page.locator('.intro-name').inner_text()
        assert 'Freelancer' in page.locator('.intro-name').inner_text()
        assert page.locator('.hero-cinema button').count() == 3
        assert page.locator('.kinetic-band,.hero-open-source').count() == 0
        controls = page.locator('.scene-controls button')
        boxes = [node.bounding_box() for node in controls.all()]
        assert max(b['y'] + b['height']/2 for b in boxes) - min(b['y'] + b['height']/2 for b in boxes) <= 1
        assert all(b['width'] >= 44 and b['height'] >= 44 and b['x'] >= 0 and b['x'] + b['width'] <= width for b in boxes)
        assert 'Software engineer' in page.locator('.intro-name').inner_text()
        assert page.locator('.skill-rail-live').count() == 0
        assert page.locator('.hero-proof-row').count() == 0
        page.screenshot(path=str(OUT/f'hero-{width}.png'))
        # Observe the short entrance in the renderer before scrolling. Remote
        # reads can otherwise start after this one-shot animation has finished.
        page.evaluate('''()=>{
          window.calendarMotionSamples=[];
          window.calendarSamplingDone=false;
          const sample=()=>{
            const n=document.querySelector('.contribution-week');
            if(n && n.closest('.contribution-wall').dataset.active==='true')
              window.calendarMotionSamples.push(new DOMMatrix(getComputedStyle(n).transform).m42);
            if(!window.calendarSamplingDone) requestAnimationFrame(sample);
          };
          requestAnimationFrame(sample);
        }''')
        page.locator('#oss').evaluate('n=>n.scrollIntoView({block:"start"})')
        page.wait_for_selector('.calendar-art svg')
        calendar = page.locator('.contribution-wall')
        assert calendar.locator('text').evaluate_all('ns=>ns.every(n=>!new Set(["Mon","Wed","Fri"]).has(n.textContent))')
        assert calendar.locator('rect[data-date]').count() > 300
        cell_data = calendar.locator('rect[data-date]').evaluate_all('ns=>ns.map(n=>[n.dataset.date,n.dataset.count,n.dataset.level,n.getAttribute("fill")])')
        calendar.evaluate('n=>n.scrollIntoView({block:"center"})')
        page.wait_for_function("document.querySelector('.contribution-wall').dataset.active==='true'")
        column = calendar.locator('.contribution-week').first
        page.wait_for_function('window.calendarMotionSamples.some(y=>y < -0.1)')
        page.evaluate('window.calendarSamplingDone=true')
        page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))")
        page.wait_for_function("document.querySelector('.contribution-wall').dataset.active==='false'")
        page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
        before = pose(column)
        page.wait_for_timeout(200)
        assert pose(column) == before
        page.evaluate("delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))")
        page.wait_for_timeout(1500)
        before = pose(column)
        page.wait_for_timeout(350)
        assert pose(column) == before, 'Calendar did not settle after its entrance'
        assert calendar.locator('rect[data-date]').evaluate_all('ns=>ns.map(n=>[n.dataset.date,n.dataset.count,n.dataset.level,n.getAttribute("fill")])') == cell_data
        assert calendar.evaluate('n=>n.getAnimations({subtree:true}).every(a=>a.playState==="finished")')
        if width < 768:
            calendar.focus()
            before = calendar.evaluate('n=>n.scrollLeft')
            page.keyboard.press('ArrowRight')
            page.wait_for_timeout(150)
            assert calendar.evaluate('n=>n.scrollLeft') > before
        page.screenshot(path=str(OUT/f'calendar-{width}.png'))
        page.emulate_media(reduced_motion='reduce')
        assert calendar.evaluate('n=>n.getAnimations({subtree:true}).length') == 0
        page.locator('.hero-cinema').evaluate('n=>n.scrollIntoView({block:"start"})')
        assert page.locator('.skill-rail-live').count() == 0
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        rows.append({'width': width, 'compact_baseline': True, 'simplified_hero': True, 'honest_finite_calendar_wave': True, 'hidden_tab': True, 'reduced_motion': True})
        context.close()
        print('PASS developer UX', width, flush=True)

    context = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 1000})
    page = context.new_page()
    page.goto(BASE, wait_until='networkidle')
    assert page.locator('.skill-rail-live').count() == 0
    page.locator('.discovery-more a').last.click()
    page.wait_for_url(BASE + '/projects/browser-extensions')
    assert page.locator('[data-project-id]').count() == 5
    page.goto(BASE, wait_until='networkidle')
    page.locator('#oss').evaluate('n=>n.scrollIntoView({block:"center"})')
    assert page.locator('.calendar-static').is_visible()
    context.close()

    context = browser.new_context(viewport={'width': 390, 'height': 1000})
    page = context.new_page()
    calls = []
    def calendar_response(route):
        calls.append(route.request.url)
        if len(calls) == 1: route.abort()
        else: route.continue_()
    context.route('**/wall2026.svg', calendar_response)
    page.goto(BASE, wait_until='networkidle')
    page.locator('#oss').evaluate('n=>n.scrollIntoView({block:"center"})')
    page.get_by_role('button', name='Try again', exact=True).click()
    page.wait_for_selector('.calendar-art svg')
    assert len(calls) == 2
    context.close()
    browser.close()

assert not errors, errors
(OUT/'verification.json').write_text(json.dumps({'ok': True, 'base': BASE, 'checks': rows, 'no_js_navigation_calendar': True, 'calendar_retry': True, 'runtime_errors': errors}, indent=2)+'\n')

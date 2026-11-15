"""Exercise real portfolio motion, pointer/touch behavior, navigation and fallbacks."""
import json
import os
import re
from urllib.parse import urlparse
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.getenv('PORTFOLIO_URL', 'http://127.0.0.1:8947').rstrip('/')
OUT = Path(os.getenv('MOTION_ARTIFACTS', '/tmp/portfolio-motion'))
OUT.mkdir(parents=True, exist_ok=True)
checks = []
errors = []


def watch(page):
    page.on('pageerror', lambda error: errors.append(str(error)))


def ready(page, state='ready'):
    page.wait_for_function('(state)=>document.documentElement.dataset.motion===state', arg=state)


def visible_cards(page):
    assert page.locator('.work-piece, .design-tile, .reveal, .category-project').evaluate_all(
        "nodes=>nodes.every(n=>getComputedStyle(n).opacity==='1' && getComputedStyle(n).visibility!=='hidden')"
    )


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    context = browser.new_context(viewport={'width':1440,'height':1000}, reduced_motion='no-preference', color_scheme='dark')
    page = context.new_page()
    watch(page)
    assert page.goto(BASE, wait_until='domcontentloaded').status == 200
    ready(page)
    start = page.locator('.hero-line > span').first.evaluate('n=>getComputedStyle(n).transform')
    page.wait_for_function("[...document.querySelectorAll('.hero-line > span')].every(n=>getComputedStyle(n).transform==='none')")
    assert start != 'none', 'The headline entrance did not animate'
    page.wait_for_function("getComputedStyle(document.querySelector('.portrait')).opacity==='1'")
    assert page.get_by_role('button', name='Toggle theme').count() == 0
    assert page.locator('html').evaluate("n=>getComputedStyle(n).colorScheme==='light'")
    checks.append('real staggered hero entrance and light-only appearance')

    page.mouse.move(1100,300)
    page.wait_for_function("!!document.querySelector('.hero-cinema').style.getPropertyValue('--scene-x')")
    page.screenshot(path=str(OUT/'portrait-pointer.png'))
    page.mouse.move(20,20)
    page.wait_for_function("!document.querySelector('.hero-cinema').style.getPropertyValue('--scene-x')")
    checks.append('scene parallax responds to and resets after a real pointer move')

    link = page.locator('.hero-work-link')
    box = link.bounding_box()
    page.mouse.move(box['x']+box['width']*.8,box['y']+box['height']*.3)
    page.wait_for_function("Math.abs(new DOMMatrix(getComputedStyle(document.querySelector('.hero-work-link svg')).transform).m41)>.5")
    link.focus()
    assert link.evaluate("n=>getComputedStyle(n).outlineStyle!=='none'")
    checks.append('work link responds to hover and displays keyboard focus')
    page.mouse.move(20,20)
    page.screenshot(path=str(OUT/'hero-desktop.png'))
    page.set_viewport_size({'width':768,'height':1000})
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.set_viewport_size({'width':1440,'height':1000})
    page.wait_for_function("[...document.querySelectorAll('.hero-line > span')].every(n=>getComputedStyle(n).transform==='none')")
    checks.append('breakpoint changes keep content within the viewport')

    card = page.locator('.work-piece').nth(2)
    assert card.evaluate("n=>getComputedStyle(n).opacity==='0'")
    distance = card.evaluate('n=>n.getBoundingClientRect().top-240')
    page.mouse.wheel(0,distance)
    page.wait_for_function("getComputedStyle(document.querySelectorAll('.work-piece')[2]).opacity==='1'")
    progress = page.locator('.reading-progress').evaluate('n=>new DOMMatrix(getComputedStyle(n).transform).a')
    assert 0 < progress < 1, progress
    assert abs(page.locator('.site-header').bounding_box()['y']) < 1
    checks.append('wheel scrolling reveals work, advances progress and keeps navigation visible')
    page.screenshot(path=str(OUT/'work-scroll.png'))

    footer = page.locator('.footer-invitation .primary-link')
    footer.focus()
    assert page.locator('.footer-invitation').evaluate("n=>getComputedStyle(n).opacity==='1'")
    checks.append('keyboard focus immediately reveals an offscreen footer link')

    for _ in range(2):
        for label, route in [('Projects','/projects'),('Contact','/contact'),('Home','/')]:
            page.get_by_role('link', name=label, exact=True).first.click()
            page.wait_for_url(BASE+route)
            ready(page)
            page.wait_for_function("document.querySelectorAll('.reading-progress').length===1")
            assert page.locator('h1').count()==1
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
            if route=='/projects':
                assert page.locator('[data-project-category]').count()==7
    checks.append('repeated client navigation recreates motion without duplicate UI or overflow')

    page.emulate_media(reduced_motion='reduce')
    ready(page,'reduced')
    visible_cards(page)
    assert page.locator('.reading-progress').evaluate("n=>getComputedStyle(n).display==='none'")
    box=page.locator('.portrait-scene').bounding_box()
    page.mouse.move(box['x']+box['width']*.8,box['y']+box['height']*.25)
    assert page.locator('.hero-cinema').evaluate("n=>!n.style.getPropertyValue('--scene-x')")
    page.emulate_media(reduced_motion='no-preference')
    ready(page)
    checks.append('live reduced-motion changes remove inline transforms, reveal content and restart safely')
    context.close()

    for width in [320,390,768]:
        context=browser.new_context(viewport={'width':width,'height':900},has_touch=True,is_mobile=True,reduced_motion='no-preference')
        page=context.new_page()
        watch(page)
        page.goto(BASE,wait_until='networkidle')
        ready(page)
        page.wait_for_function("getComputedStyle(document.querySelector('.portrait')).opacity==='1'")
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), width
        assert page.locator('.hero-cinema').evaluate("n=>!n.style.getPropertyValue('--scene-x')")
        page.get_by_role('link',name='Discover my work').tap()
        page.wait_for_function("getComputedStyle(document.querySelector('.section-intro')).opacity==='1'")
        page.wait_for_function("(()=>{const h=document.querySelector('#work h2').getBoundingClientRect();return h.top>=document.querySelector('.site-header').getBoundingClientRect().bottom && h.bottom<innerHeight*.7})()")
        page.screenshot(path=str(OUT/f'mobile-{width}.png'))
        context.close()
    checks.append('coarse touch devices at 320/390/768 skip pointer effects and keep working anchor navigation')

    context=browser.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,reduced_motion='no-preference')
    page=context.new_page()
    watch(page)
    html=page.request.get(BASE).text()
    initial_scripts={urlparse(src).path for src in re.findall(r'<script[^>]+src="([^"]+)"',html)}
    held=[]
    released=False
    def defer_optional(route):
        if released or urlparse(route.request.url).path in initial_scripts:
            route.continue_()
        else:
            held.append(route)
    context.route('**/_next/static/chunks/*.js',defer_optional)
    page.goto(BASE,wait_until='domcontentloaded')
    page.wait_for_function("document.documentElement.dataset.motion==='loading'")
    page.locator('#work h2').evaluate("n=>n.scrollIntoView({block:'center'})")
    page.wait_for_timeout(250)
    assert held, 'Optional motion bundle was not held for the slow-network regression'
    page.evaluate("""()=>{
      window.headingHidden=false;
      const title=document.querySelector('#work h2');
      new MutationObserver(()=>{
        if(title.style.clipPath && title.style.clipPath!=='none') window.headingHidden=true;
      }).observe(title,{attributes:true,attributeFilter:['style']});
    }""")
    released=True
    for route in held: route.continue_()
    ready(page)
    page.wait_for_timeout(1000)
    assert not page.evaluate('window.headingHidden'), 'Late optional motion clipped an already visible heading'
    assert page.locator('#work .section-intro').evaluate("n=>getComputedStyle(n).opacity==='1'")
    context.close()
    checks.append('delayed mobile motion never re-hides the section the visitor is already reading')


    context=browser.new_context(reduced_motion='reduce')
    page=context.new_page()
    watch(page)
    page.goto(BASE,wait_until='networkidle')
    ready(page,'reduced')
    visible_cards(page)
    assert page.locator('.hero-line > span').evaluate_all("nodes=>nodes.every(n=>getComputedStyle(n).transform==='none')")
    context.close()
    checks.append('initial reduced-motion preference leaves every card and headline readable')

    context=browser.new_context(java_script_enabled=False,viewport={'width':360,'height':900})
    page=context.new_page()
    page.goto(BASE,wait_until='networkidle')
    visible_cards(page)
    assert page.locator('.portrait img').get_attribute('src')=='/portrait-sky.png'
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.get_by_text('Explore',exact=True).click()
    page.get_by_role('navigation',name='Mobile navigation').get_by_role('link',name='Projects',exact=True).click()
    assert page.locator('[data-project-category]').count()==7
    context.close()
    checks.append('without JavaScript, content and ordinary page navigation remain available')
    context=browser.new_context(reduced_motion='no-preference')
    page=context.new_page()
    watch(page)
    html=page.request.get(BASE).text()
    initial_scripts={urlparse(src).path for src in re.findall(r'<script[^>]+src="([^"]+)"',html)}
    assert initial_scripts
    context.route('**/_next/static/chunks/*.js', lambda route: route.continue_() if urlparse(route.request.url).path in initial_scripts else route.abort())
    page.goto(BASE,wait_until='networkidle')
    ready(page,'static')
    visible_cards(page)
    assert page.locator('.hero-line > span').evaluate_all("nodes=>nodes.every(n=>getComputedStyle(n).transform==='none')")
    context.close()
    checks.append('blocked optional animation chunk falls back to a fully readable static page')
    browser.close()

assert not errors, errors
(OUT/'motion-verification.json').write_text(json.dumps({'base':BASE,'checks':checks,'runtime_errors':errors,'ok':True},indent=2)+'\n')
for check in checks:print('PASS',check,flush=True)

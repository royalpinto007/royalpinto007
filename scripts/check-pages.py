"""Exercise Projects navigation, Contact channels, page navigation and shared interface styles."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json
BASE=os.getenv('PORTFOLIO_URL','http://127.0.0.1:8947').rstrip('/')
OUT=Path(os.getenv('PAGES_ARTIFACTS','/tmp/portfolio-pages'));OUT.mkdir(parents=True,exist_ok=True)
errors=[];checks=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
 for w in [320,390,768,1440]:
  context=b.new_context(viewport={'width':w,'height':1000},reduced_motion='reduce')
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  for route in ['projects','contact']:
   page.goto(BASE+'/'+route,wait_until='networkidle')
   assert page.locator('h1').count()==1
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(w,route)
   assert page.locator('h1').evaluate("n=>getComputedStyle(n).fontFamily.includes('Anton')")
   if route=='projects':
    summary=page.locator('.category-menu summary');summary.focus();page.keyboard.press('Enter')
    assert page.locator('.category-menu').evaluate('n=>n.open')
    links=page.get_by_role('navigation',name='Browse project categories').get_by_role('link')
    assert links.count()==8
    page.wait_for_function("(()=>{const m=document.querySelector('.category-menu');return m.open&&m.dataset.side&&!!m.querySelector('nav').style.maxHeight})()")
    box=page.get_by_role('navigation',name='Browse project categories').bounding_box()
    assert box['y'] >= 0 and box['y']+box['height'] <= 1001, 'Dropdown extends outside the viewport'
    page.keyboard.press('Tab');page.keyboard.press('Escape')
    assert not page.locator('.category-menu').evaluate('n=>n.open')
    assert summary.evaluate('n=>document.activeElement===n')
    summary.click();page.locator('h1').click();assert not page.locator('.category-menu').evaluate('n=>n.open')
    summary.click();links.filter(has_text='Apps & products').click()
    page.wait_for_function("location.hash==='#apps'")
    assert not page.locator('.category-menu').evaluate('n=>n.open')
    assert page.locator('#apps').evaluate('n=>n.getBoundingClientRect().top>=document.querySelector(".site-header").getBoundingClientRect().bottom-2')
    page.locator('.project-directory-bar').scroll_into_view_if_needed();summary.click()
    page.screenshot(path=str(OUT/f'projects-menu-{w}.png'));page.keyboard.press('Escape')
   elif route=='contact':
    assert page.locator('.contact-actions > a').count()==2
    assert page.locator('.contact-socials > a').count()==2
    hrefs=page.locator('main a').evaluate_all('ns=>ns.map(n=>n.href)')
    assert not any('linkedin.com' in href or href.startswith(('tel:','https://wa.me')) for href in hrefs)
    assert page.locator('.contact-actions a[href^="mailto:"]').count()==1
    assert page.locator('.contact-actions a[href="https://cal.com/royalpinto007"]').count()==1
    for link in page.locator('.contact-actions a,.contact-socials a').all():
     assert link.bounding_box()['height']>=44
    assert page.locator('.contact-channel p').evaluate_all('ns=>ns.every(n=>parseFloat(getComputedStyle(n).fontSize)>=17)')
    page.locator('.contact-heading img').evaluate_all('ns=>Promise.all(ns.map(n=>n.decode()))')
    page.locator('.contact-heading').screenshot(path=str(OUT/f'contact-heading-{w}.png'))
    page.locator('.contact-actions').screenshot(path=str(OUT/f'contact-actions-{w}.png'))
    if w<1024:
     page.locator('.home-mobile-menu summary').click()
     nav=page.get_by_role('navigation',name='Mobile navigation')
     assert nav.get_by_role('link',name='Contact',exact=True).get_attribute('aria-current')=='page'
     assert nav.get_by_role('link',name='Calendar',exact=True).count()==0
     nav.get_by_role('link',name='Contact',exact=True).click()
     assert not page.locator('.home-mobile-menu').evaluate('n=>n.open')
    else:
     main_nav=page.get_by_role('navigation',name='Main navigation')
     assert main_nav.get_by_role('link',name='Contact',exact=True).get_attribute('aria-current')=='page'
     assert main_nav.get_by_role('link',name='Calendar',exact=True).count()==0
   # The shared footer must reach both viewport edges without clipping its copy.
   page.locator('.site-footer').scroll_into_view_if_needed()
   page.locator('.site-footer img').evaluate_all("ns=>ns.forEach(n=>n.loading='eager')")
   page.wait_for_function("Array.from(document.querySelectorAll('.site-footer img')).every(i=>i.complete&&i.naturalWidth>0)")
   assert page.locator('.site-footer').evaluate("n=>{const b=n.getBoundingClientRect();return Math.abs(b.left)<1&&Math.abs(b.right-innerWidth)<1}")
   assert page.locator('.footer-invitation h2').evaluate("n=>{const r=document.createRange();r.selectNodeContents(n);const b=r.getBoundingClientRect();return b.left>=15&&b.right<=innerWidth-15}")
   assert page.locator('.site-footer a[href*=linkedin]').count()==0
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.locator('.site-footer').screenshot(path=str(OUT/f'footer-{route}-{w}.png'))
   checks.append({'width':w,'route':route,'ok':True})
  context.close()
 context=b.new_context(java_script_enabled=False,viewport={'width':390,'height':900})
 page=context.new_page();page.goto(BASE+'/projects',wait_until='networkidle')
 page.locator('.category-menu summary').click()
 page.get_by_role('navigation',name='Browse project categories').get_by_role('link',name='Apps & products',exact=True).click()
 assert page.evaluate("location.hash==='#apps'")
 context.close();b.close()
assert not errors,errors
(OUT/'verification.json').write_text(json.dumps({'ok':True,'checks':checks,'no_js_navigation':True,'runtime_errors':errors},indent=2)+'\n')
print('PASS 2 routes at 4 widths, keyboard/outside-click category menu, touch targets, nav without Calendar and native no-JS links')

"""Exercise Projects navigation, Calendar readiness and shared interface styles."""
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
  for route in ['projects','contact','calendar']:
   page.goto(BASE+'/'+route,wait_until='networkidle')
   assert page.locator('h1').count()==1
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(w,route)
   assert page.locator('h1').evaluate("n=>getComputedStyle(n).fontFamily.includes('Anton')")
   if route=='projects':
    summary=page.locator('.category-menu summary');summary.focus();page.keyboard.press('Enter')
    assert page.locator('.category-menu').evaluate('n=>n.open')
    links=page.get_by_role('navigation',name='Browse project categories').get_by_role('link')
    assert links.count()==7
    page.wait_for_function("(()=>{const m=document.querySelector('.category-menu');return m.open&&m.dataset.side&&!!m.querySelector('nav').style.maxHeight})()")
    box=page.get_by_role('navigation',name='Browse project categories').bounding_box()
    assert box['y'] >= 0 and box['y']+box['height'] <= 1001, 'Dropdown extends outside the viewport'
    page.keyboard.press('Tab');page.keyboard.press('Escape')
    assert not page.locator('.category-menu').evaluate('n=>n.open')
    assert summary.evaluate('n=>document.activeElement===n')
    summary.click();page.locator('h1').click();assert not page.locator('.category-menu').evaluate('n=>n.open')
    summary.click();links.filter(has_text='Packages & developer tools').click()
    page.wait_for_function("location.hash==='#packages'")
    assert not page.locator('.category-menu').evaluate('n=>n.open')
    assert page.locator('#packages').evaluate('n=>n.getBoundingClientRect().top>=document.querySelector(".site-header").getBoundingClientRect().bottom-2')
    page.locator('.project-directory-bar').scroll_into_view_if_needed();summary.click()
    page.screenshot(path=str(OUT/f'projects-menu-{w}.png'));page.keyboard.press('Escape')
   elif route=='contact':
    assert page.locator('.contact-channels > a').count()==4
    assert page.locator('.contact-socials > a').count()==3
    for selector in ['.contact-invitation','.contact-channels','.contact-socials']:
     target=page.locator(selector);target.scroll_into_view_if_needed()
     for link in target.locator('a').all():
      assert link.bounding_box()['height']>=43
    page.locator('.contact-invitation img').evaluate('async n=>{await n.decode()}')
    page.locator('.contact-invitation').screenshot(path=str(OUT/f'contact-invitation-{w}.png'))
    page.locator('.contact-channels').screenshot(path=str(OUT/f'contact-channels-{w}.png'))
   else:
    assert page.get_by_text('Nothing scheduled here just yet.',exact=True).is_visible()
    assert page.locator('iframe,input,select,form').count()==0
    assert page.locator('.calendar-preview a').get_attribute('href')=='/projects'
    if w<1024:
     page.get_by_text('Explore',exact=True).click()
     nav=page.get_by_role('navigation',name='Mobile navigation')
     assert nav.get_by_role('link',name='Calendar',exact=True).get_attribute('aria-current')=='page'
     nav.get_by_role('link',name='Calendar',exact=True).click()
     assert not page.locator('.home-mobile-menu').evaluate('n=>n.open')
    else:
     assert page.get_by_role('navigation',name='Main navigation').get_by_role('link',name='Calendar',exact=True).get_attribute('aria-current')=='page'
    page.screenshot(path=str(OUT/f'calendar-{w}.png'))
   checks.append({'width':w,'route':route,'ok':True})
  context.close()
 context=b.new_context(java_script_enabled=False,viewport={'width':390,'height':900})
 page=context.new_page();page.goto(BASE+'/projects',wait_until='networkidle')
 page.locator('.category-menu summary').click()
 page.get_by_role('navigation',name='Browse project categories').get_by_role('link',name='Apps',exact=True).click()
 assert page.evaluate("location.hash==='#apps'")
 page.goto(BASE+'/calendar',wait_until='networkidle');assert page.get_by_text('Nothing scheduled here just yet.',exact=True).is_visible()
 context.close();b.close()
assert not errors,errors
(OUT/'verification.json').write_text(json.dumps({'ok':True,'checks':checks,'no_js_navigation':True,'runtime_errors':errors},indent=2)+'\n')
print('PASS 3 routes at 4 widths, keyboard/outside-click category menu, touch targets, native no-JS links and empty Calendar')

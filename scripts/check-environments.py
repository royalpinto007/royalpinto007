"""Verify full-section scenic backgrounds, deferred loading and native fallbacks."""
from pathlib import Path
import os,json
from playwright.sync_api import sync_playwright
BASE=os.getenv('PORTFOLIO_URL','http://127.0.0.1:8947').rstrip('/')
OUT=Path(os.getenv('ENVIRONMENT_ARTIFACTS','/tmp/portfolio-environments'));OUT.mkdir(parents=True,exist_ok=True)
errors=[];checks=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
 for width in [320,390,768,1440,1920]:
  ctx=b.new_context(viewport={'width':width,'height':900},reduced_motion='reduce',is_mobile=width<768,has_touch=width<768)
  page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));requests=[];page.on('request',lambda r:requests.append(r.url))
  page.goto(BASE,wait_until='networkidle')
  initial_art=[u for u in requests if '/scene/environments/' in u]
  first_visible=page.locator('.work-world').first.bounding_box()['y']<900
  assert not initial_art if not first_visible else all('/marina' in u for u in initial_art), 'Offscreen chapter artwork competed with the initial hero load'
  assert page.locator('.chapter-environment').count()==6
  scenes=[]
  for host in page.locator('.work-world,.immersive-chapter').all():
   host.locator('.chapter-environment').evaluate('n=>n.scrollIntoView({block:"start"})')
   image=host.locator('.chapter-environment img');image.wait_for();image.evaluate('async n=>{await n.decode()}')
   source=image.evaluate('n=>n.currentSrc');scenes.append(source)
   assert source.endswith('-mobile.webp') if width<768 else not source.endswith('-mobile.webp')
   rect=host.bounding_box();back=host.locator('.chapter-environment').bounding_box()
   assert abs(rect['width']-back['width'])<2 and abs(rect['height']-back['height'])<2, 'Scenery is inset inside a card'
   assert back['x']<=1 and back['width']>=width-2,'Section scenery leaves empty side gutters'
   assert image.evaluate("n=>getComputedStyle(n).opacity==='1'&&getComputedStyle(n).filter.includes('saturate(0.72)')&&getComputedStyle(n).filter.includes('contrast(0.88)')")
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   if host.locator('.work-details').count():
    preview=host.locator('.work-preview')
    assert preview.evaluate("n=>getComputedStyle(n).backgroundColor==='rgba(0, 0, 0, 0)'&&getComputedStyle(n).boxShadow==='none'")
    link=preview.get_by_role('link')
    assert link.inner_text().startswith('Explore ')
    assert link.get_attribute('aria-label') is None, 'Visible project label is overridden'
    assert link.get_attribute('href')==host.locator('.work-visit').get_attribute('href')
    link.focus()
    assert link.evaluate("n=>getComputedStyle(n).outlineStyle!=='none'")
    detail=host.locator('.work-details')
    assert detail.evaluate('''n=>{const b=n.getBoundingClientRect();return [...n.querySelectorAll('h3,p,li,a')].every(x=>{const r=document.createRange();r.selectNodeContents(x);const t=r.getBoundingClientRect();return t.left>=b.left-1&&t.right<=b.right+1})}'''),'Project copy escapes its glass layer'
   checks.append({'width':width,'scene':source.rsplit('/',1)[-1],'full_section':True})
  assert len(scenes)==len(set(scenes))==6
  ctx.close()
 ctx=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='no-preference')
 page=ctx.new_page();page.goto(BASE,wait_until='networkidle');page.wait_for_function("document.documentElement.dataset.motion==='ready'")
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'Normal-motion scenes overflow before entrance'
 for host in page.locator('.work-world').all():
  host.evaluate('n=>scrollTo(0,n.getBoundingClientRect().top+scrollY-innerHeight*.85)')
  for _ in range(5):
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'Scene entrance introduces horizontal scrolling'
   page.wait_for_timeout(140)
 page.locator('.work-piece').nth(1).scroll_into_view_if_needed();page.wait_for_timeout(1000)
 assert page.locator('.environment-camera').nth(1).evaluate('n=>!!n.style.transform')
 page.emulate_media(reduced_motion='reduce');page.wait_for_function("document.documentElement.dataset.motion==='reduced'")
 assert page.locator('.environment-camera').evaluate_all('ns=>ns.every(n=>!n.style.transform)')
 ctx.close()
 ctx=b.new_context(viewport={'width':390,'height':900},java_script_enabled=False)
 page=ctx.new_page();page.goto(BASE,wait_until='networkidle')
 first=page.locator('.work-piece').first;first.scroll_into_view_if_needed()
 image=first.locator('noscript img');image.evaluate('async n=>{await n.decode()}');assert image.evaluate('n=>n.naturalWidth>0')
 assert page.get_by_role('link',name='Explore SignalizeAI',exact=True).first.is_visible()
 ctx.close()
 ctx=b.new_context(viewport={'width':390,'height':900},reduced_motion='reduce')
 page=ctx.new_page();page.route('**/scene/environments/marina-mobile.webp',lambda r:r.abort());page.goto(BASE,wait_until='networkidle')
 with page.expect_event('requestfailed',predicate=lambda r:'/scene/environments/marina-mobile.webp' in r.url):
  page.locator('.work-piece').first.scroll_into_view_if_needed()
 page.wait_for_function("document.querySelector('.environment-marina picture')===null")
 assert page.get_by_role('link',name='Explore SignalizeAI',exact=True).first.is_visible()
 assert page.locator('.environment-marina').evaluate("n=>getComputedStyle(n).backgroundImage!=='none'")
 ctx.close();b.close()
assert not errors,errors
(OUT/'verification.json').write_text(json.dumps({'ok':True,'checks':checks,'deferred_images':True,'no_js':True,'failure_fallback':True,'reduced_motion_cleanup':True,'runtime_errors':errors},indent=2)+'\n')
print('PASS six unique section-wide environments at five widths, deferred responsive images, copy containment, motion cleanup, no-JS and failed-image fallback')

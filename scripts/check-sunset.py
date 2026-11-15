from pathlib import Path
import os,json
from playwright.sync_api import sync_playwright
BASE=os.getenv('PORTFOLIO_URL','http://127.0.0.1:8947').rstrip('/')
OUT=Path(os.getenv('SUNSET_ARTIFACTS','/tmp/portfolio-sunset'));OUT.mkdir(parents=True,exist_ok=True)
checks=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
 for width in [320,768,1440]:
  context=b.new_context(viewport={'width':width,'height':1000},reduced_motion='no-preference')
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(BASE,wait_until='networkidle')
  page.wait_for_function("document.documentElement.dataset.motion==='ready'")
  page.wait_for_function("[...document.querySelectorAll('.hero-line>span')].every(n=>getComputedStyle(n).transform==='none')")
  assert page.locator('.brand-link').inner_text().startswith('Royal Simpson Pinto')
  assert page.locator('.brand-link').bounding_box()['width']>130
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('hero',width)
  page.screenshot(path=str(OUT/f'hero-{width}.png'))
  band=page.locator('.kinetic-band');band.scroll_into_view_if_needed()
  page.wait_for_function("document.querySelector('.kinetic-band').dataset.active==='true'")
  page.wait_for_function("getComputedStyle(document.querySelector('.kinetic-track')).animationPlayState==='running'")
  page.wait_for_timeout(150)
  moving=page.locator('.kinetic-track').evaluate('n=>getComputedStyle(n).transform')
  page.get_by_role('button',name='Pause moving text').click()
  page.wait_for_function("document.querySelector('.kinetic-band').dataset.paused==='true' && getComputedStyle(document.querySelector('.kinetic-track')).animationPlayState==='paused'")
  # A compositor animation may settle its final frame after style reports paused.
  page.evaluate('() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
  paused=page.locator('.kinetic-track').evaluate('n=>getComputedStyle(n).transform')
  page.wait_for_timeout(150)
  assert page.locator('.kinetic-track').evaluate('n=>getComputedStyle(n).transform')==paused
  page.keyboard.press('Tab');page.keyboard.press('Shift+Tab')
  assert page.get_by_role('button',name='Play moving text').evaluate('n=>n===document.activeElement')
  page.keyboard.press('Enter')
  page.keyboard.press('Tab')
  page.wait_for_function("getComputedStyle(document.querySelector('.kinetic-track')).animationPlayState==='running'")
  assert moving!='none'
  if width==1440:
   preview=page.locator('.work-preview').first
   preview.scroll_into_view_if_needed()
   page.wait_for_function("getComputedStyle(document.querySelector('.work-preview')).clipPath==='none'")
   artwork=preview.locator('.signal-stack')
   before=artwork.evaluate('n=>getComputedStyle(n).transform')
   preview.hover();page.wait_for_timeout(500)
   after=artwork.evaluate('n=>getComputedStyle(n).transform')
   assert before!=after,(before,after)
   page.screenshot(path=str(OUT/'work-motion.png'))
  text=page.locator('#oss .programme-strip').inner_text()
  assert 'Google Summer of Code' in text and 'GSoC' in text and 'LFX Mentorship' in text and 'Symmetry Autumn of Code' in text and 'SAoC' in text
  graph=page.locator('.contribution-calendar');graph.scroll_into_view_if_needed()
  page.wait_for_function("getComputedStyle(document.querySelector('.contribution-wall')).opacity==='1'")
  page.wait_for_function("getComputedStyle(document.querySelector('#oss h2')).clipPath==='none'")
  rects=page.locator('.wall-svg rect')
  assert rects.count()>300
  active_days=page.locator('.wall-svg rect:not(.l0)').count()
  assert active_days>200
  assert rects.evaluate_all("nodes=>nodes.reduce((sum,n)=>sum+Number(n.dataset.count),0)")==int(page.locator('.contribution-summary strong').inner_text().split(' contributions')[0].replace(',',''))
  for level,color in [(1,'rgb(155, 233, 168)'),(2,'rgb(64, 196, 99)'),(3,'rgb(48, 161, 78)'),(4,'rgb(33, 110, 57)')]:
   assert page.locator(f'.wall-svg .l{level}').first.evaluate('n=>getComputedStyle(n).fill')==color
  assert page.locator('.wall-svg text').filter(has_text='Jan').count()==1
  assert page.locator('.contribution-wall').evaluate('n=>n.scrollWidth>n.clientWidth')==(width<1440)
  page.locator('.contribution-wall').focus()
  assert page.evaluate("getComputedStyle(document.activeElement).outlineStyle!=='none'")
  page.locator('.contribution-wall').evaluate('n=>n.scrollLeft=n.scrollWidth')
  page.screenshot(path=str(OUT/f'graph-{width}.png'))
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('graph',width)
  page.locator('.footer-invitation .primary-link').focus()
  page.screenshot(path=str(OUT/f'footer-{width}.png'))
  assert page.locator('.footer-invitation').evaluate("n=>getComputedStyle(n).backgroundImage==='none'")
  page.emulate_media(reduced_motion='reduce')
  page.wait_for_function("document.documentElement.dataset.motion==='reduced'")
  assert page.locator('.sky-current').evaluate("n=>getComputedStyle(n).transform==='none'")
  assert page.locator('.kinetic-track').evaluate("n=>getComputedStyle(n).animationName==='none'")
  active_days=page.locator('.wall-svg rect:not(.l0)').count()
  assert active_days>200
  assert page.locator('.work-preview').first.evaluate("n=>getComputedStyle(n).clipPath==='none'")
  for route in ['/projects','/contact']:
   page.goto(BASE+route,wait_until='networkidle')
   assert page.locator('h1').count()==1
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(route,width)
   page.screenshot(path=str(OUT/f'{route[1:]}-{width}.png'))
  checks.append({'width':width,'name':True,'calendar_data_and_greens':True,'marquee_controls':True,'parallax':width==1440,'reduced_motion':True,'three_routes_no_overflow':True})
  print('PASS sunset identity, copy, honest green calendar, animation controls and reduced-motion at',width,flush=True)
  context.close()
 b.close()
assert not errors,errors
(OUT/'verification.json').write_text(json.dumps({'base':BASE,'checks':checks,'errors':errors},indent=2)+'\n')

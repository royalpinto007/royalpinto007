"""Verify Home's wide layout, engineering content, native architecture controls and route scope."""
from pathlib import Path
import json, os
from playwright.sync_api import sync_playwright
BASE=os.getenv('PORTFOLIO_URL','http://127.0.0.1:8947').rstrip('/')
OUT=Path(os.getenv('HOME_ARTIFACTS','/tmp/portfolio-home-engineering'));OUT.mkdir(parents=True,exist_ok=True)
failures=[];errors=[];results=[]
def expect(condition, message):
 if not condition:failures.append(message)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
 for width in [1920,1440,1024,768,390,320]:
  context=b.new_context(viewport={'width':width,'height':1000},reduced_motion='reduce')
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(BASE,wait_until='networkidle')
  page.wait_for_function("document.documentElement.dataset.motion==='reduced'")
  hero=page.locator('.portfolio-hero').bounding_box()
  expect(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'{width}: horizontal overflow')
  if width>=1440:
   expect(hero['x']<=width*.05 and width-hero['x']-hero['width']<=width*.05,f'{width}: unused lateral gutters')

  headline=page.locator('h1').inner_text().lower()
  expect('build' in headline and 'beyond' in headline,f'{width}: cinematic headline missing')
  expect('Royal Simpson Pinto' in page.locator('.brand-link').inner_text(),f'{width}: personal identity absent')
  for i,line in enumerate(page.locator('.hero-line').all()):
   expect(line.evaluate('n=>n.getBoundingClientRect().height<=parseFloat(getComputedStyle(n).lineHeight)*1.3'),f'{width}: headline line {i+1} wraps')
  description=page.locator('.hero-description').inner_text().lower()
  expect(all(x in description for x in ['ai agents','full-stack','automation','web3']),f'{width}: broad engineering identity missing')
  expect(len(description.split())<25,f'{width}: hero too wordy')
  expect(page.locator('#systems').evaluate('n=>n.compareDocumentPosition(document.querySelector(".motion-reel")) & Node.DOCUMENT_POSITION_FOLLOWING'),f'{width}: creative reel precedes system design')
  expect('Where it started' in page.locator('.journey-start').inner_text(),f'{width}: programmes not framed as the beginning')
  expect('Contribute. Create. Maintain.' in page.locator('.open-source-heading').inner_text(),f'{width}: ongoing open source missing')
  expect('Qdrant' not in page.locator('#oss').inner_text(),f'{width}: named contribution reference remains')
  expect(page.locator('#system-tenantq,#system-vaultrag').count()==0,f'{width}: retired architecture cases remain')
  page.screenshot(path=str(OUT/f'hero-{width}.png'))
  if width in [1920,320]:
   page.locator('.hero-open-source').click()
   expect(page.locator('#oss h2').bounding_box()['y']>=page.locator('.site-header').bounding_box()['height'],f'{width}: open-source anchor hidden behind header')
   page.screenshot(path=str(OUT/f'open-source-{width}.png'))
  page.locator('#systems').scroll_into_view_if_needed()
  for system in ['aashinyra','signalizeai','boardeject']:
   page.locator(f'label:has(#system-{system})').click()
   panel=page.locator(f'.system-case[data-system="{system}"]')
   expect(panel.is_visible(),f'{width}: {system} radio does not show its design')
   expect(page.locator('.system-case:visible').count()==1,f'{width}: more than one architecture visible')
   expect(panel.locator('.system-node').count()==4,f'{width}: {system} flow is incomplete')
   notes=panel.locator('.system-notes')
   expect(not notes.evaluate('n=>n.open'),f'{width}: design detail not collapsed by default')
   notes.locator('summary').focus();page.keyboard.press('Enter')
   expect(notes.evaluate('n=>n.open'),f'{width}: keyboard disclosure failed')
   expect(panel.locator('.system-decisions >div').count()==3,f'{width}: {system} decisions missing')
   page.keyboard.press('Enter')
   if width>=1024:
    expect(panel.locator('.architecture-map').first.is_visible(),f'{width}: detailed architecture absent')
    expect(panel.locator('.map-node').count()>=7,f'{width}: system dependencies missing')
   else:
    full=panel.locator('.system-full-map')
    full.locator('summary').click()
    expect(full.locator('.architecture-map').is_visible(),f'{width}: full mobile architecture inaccessible')
    expect(full.locator('.architecture-scroll').evaluate('n=>n.scrollWidth>n.clientWidth'),f'{width}: map does not scroll internally')
    full.locator('summary').click()
   expect(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'{width}: {system} overflow')
  page.locator('#system-signalizeai').focus()
  page.keyboard.press('ArrowRight')
  expect(page.locator('#system-boardeject').is_checked(),f'{width}: native arrow-key radio selection failed')
  expect(page.locator('label:has(#system-boardeject)>span').evaluate("n=>getComputedStyle(n).outlineStyle!=='none'"),f'{width}: radio keyboard focus has no visible outline')
  page.locator('#systems').screenshot(path=str(OUT/f'systems-{width}.png'))
  page.locator('label:has(#system-aashinyra)').click()
  if width in [1920,320]:page.locator('#systems').screenshot(path=str(OUT/f'aashinyra-{width}.png'))
  expect(page.locator('.product-art').count()==3,f'{width}: authored product visuals missing')
  expect(page.locator('.work-stack').count()==3,f'{width}: project engineering labels missing')
  page.locator('.work-piece').first.scroll_into_view_if_needed()
  page.screenshot(path=str(OUT/f'work-{width}.png'))
  page.locator('.reel-stage').scroll_into_view_if_needed()
  page.wait_for_function("document.querySelector('.reel-poster > img').complete && document.querySelector('.reel-poster > img').naturalWidth>0")
  expect(page.locator('.reel-poster > img').evaluate('n=>n.complete&&n.naturalWidth>0'),f'{width}: static reel missing')
  page.screenshot(path=str(OUT/f'reel-{width}.png'))
  results.append({'width':width,'hero_left':round(hero['x'],1),'hero_width':round(hero['width'],1),'native_architectures':3,'keyboard':True})
  context.close()
  print('CHECK Home at',width,flush=True)
 # Client navigation proves Home's wider CSS does not leak to the other routes.
 context=b.new_context(viewport={'width':1920,'height':1000},reduced_motion='reduce')
 page=context.new_page();page.goto(BASE,wait_until='networkidle')
 for route,label in [('/projects','Projects'),('/contact','Contact'),('/','Home')]:
  page.get_by_role('link',name=label,exact=True).first.click();page.wait_for_url(BASE+route)
  width=page.locator('.header-inner').bounding_box()['width']
  expect(width>1800 if route=='/' else width==1400,f'{route}: header width scope leaked ({width})')
  expect(page.locator('.brand-link small').inner_text()=='Software engineer & open-source builder',f'{route}: shared header identity missing')
 context.close()
 # The diagrams and case selection remain functional with no JavaScript.
 context=b.new_context(java_script_enabled=False,viewport={'width':390,'height':900})
 page=context.new_page();page.goto(BASE,wait_until='networkidle')
 for system in ['signalizeai','boardeject','aashinyra']:
  page.locator(f'label:has(#system-{system})').click()
  expect(page.locator(f'.system-case[data-system="{system}"]').is_visible(),f'noJS: {system} switching failed')
 expect(page.locator('.portrait img').evaluate('n=>n.naturalWidth===460'), 'noJS: portrait missing')
 context.close()
 # Architecture flow animates on entry and becomes static for reduced motion.
 context=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='no-preference')
 page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE,wait_until='networkidle')
 page.wait_for_function("document.documentElement.dataset.motion==='ready'")
 page.locator('#systems').scroll_into_view_if_needed()
 page.wait_for_function("document.querySelector('#systems').classList.contains('is-in-view')")
 wire=page.locator('.system-case:visible .map-wire:not(.map-wire-dashed)').first
 expect(wire.evaluate("n=>getComputedStyle(n).animationName==='map-connect'"),'architecture entry animation absent')
 page.wait_for_function("parseFloat(getComputedStyle(document.querySelector('.system-case[data-system=aashinyra] .map-wire')).strokeDashoffset)>0")
 first=wire.evaluate('n=>getComputedStyle(n).strokeDashoffset')
 page.wait_for_function('(previous)=>getComputedStyle(document.querySelector(".system-case[data-system=aashinyra] .map-wire")).strokeDashoffset!==previous',arg=first)
 page.emulate_media(reduced_motion='reduce')
 page.wait_for_function("document.documentElement.dataset.motion==='reduced'")
 expect(wire.evaluate("n=>getComputedStyle(n).animationName==='none'"),'architecture motion did not respect reduced motion')
 context.close();b.close()
report={'base':BASE,'viewports':results,'failures':failures,'runtime_errors':errors,'ok':not failures and not errors}
(OUT/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
assert not failures and not errors,report
print('PASS wide Home, engineering evidence, all native diagrams, keyboard, no-JS and route scope',flush=True)

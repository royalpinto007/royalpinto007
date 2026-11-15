"""Verify scene lighting, motion controls, native exploration and on-demand embeds."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os
BASE=os.getenv('PORTFOLIO_URL','http://127.0.0.1:8947').rstrip('/')
OUT=Path(os.getenv('SCENE_ARTIFACTS','/tmp/portfolio-home-scenes'));OUT.mkdir(parents=True,exist_ok=True)
errors=[];checks=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome')
 for width,height in [(1440,1000),(390,844),(320,780)]:
  context=browser.new_context(viewport={'width':width,'height':height},has_touch=width<768,is_mobile=width<768,reduced_motion='no-preference')
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(BASE,wait_until='networkidle')
  page.wait_for_function("[...document.querySelectorAll('.hero-line>span')].every(n=>getComputedStyle(n).transform==='none')")
  page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='true'")
  assert page.locator('.portrait img').evaluate('n=>n.complete&&n.naturalWidth===460')
  assert page.locator('.portrait-canvas,.portrait-tools').count()==0
  if width<768:
   assert page.locator('.site-header').bounding_box()['height']<=65
   page.get_by_text('Explore',exact=True).click()
   assert page.get_by_role('navigation',name='Mobile navigation').get_by_role('link',name='Projects').is_visible()
   page.keyboard.press('Escape');assert not page.locator('.home-mobile-menu').evaluate('n=>n.open')
  page.get_by_role('button',name='Pause hero effects').click()
  page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='false'")
  assert page.locator('.hero-glint').first.evaluate("n=>getComputedStyle(n).animationPlayState==='paused'")
  default=page.screenshot(path=str(OUT/f'hero-{width}.png'))
  page.get_by_role('button',name='Change scene lighting, currently Golden hour').focus();page.keyboard.press('Enter')
  page.wait_for_timeout(1100)
  assert page.locator('.hero-cinema').get_attribute('data-light')=='1'
  assert default!=page.screenshot(),'Lighting control did not visibly change the scene'
  page.get_by_role('button',name='Change scene lighting, currently Sky blue').click()
  assert page.locator('.hero-cinema').get_attribute('data-light')=='2'
  page.get_by_role('button',name='Change scene lighting, currently Rose glow').click()
  assert page.locator('.hero-cinema').get_attribute('data-light')=='0'
  page.get_by_role('button',name='Play hero effects').click()
  page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='true'")
  if width==1440:
   page.mouse.move(1200,400)
   page.wait_for_function("!!document.querySelector('.hero-cinema').style.getPropertyValue('--scene-x')")
  page.locator('#oss').evaluate('n=>n.scrollIntoView({block:"start"})')
  page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='false'")
  assert 'Qdrant' not in page.locator('#oss').inner_text()
  for full in ['Google Summer of Code','Linux Foundation’s LFX Mentorship','Symmetry Autumn of Code']:assert full in page.locator('#oss').inner_text()
  page.screenshot(path=str(OUT/f'open-source-{width}.png'))
  for system in ['aashinyra','signalizeai','boardeject']:
   page.locator(f'label:has(#system-{system})').click()
   panel=page.locator('.system-case:visible')
   for stage in range(4):
    panel.locator(f'.architecture-walkthrough label:has(input[value="{stage}"])').click()
    assert panel.locator(f'.architecture-walkthrough input[value="{stage}"]').is_checked()
   panel.locator('.architecture-walkthrough label:has(input[value="all"])').click()
  page.locator('#systems').screenshot(path=str(OUT/f'systems-{width}.png'))
  page.emulate_media(reduced_motion='reduce')
  page.locator('.portfolio-hero').scroll_into_view_if_needed()
  page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='false'")
  assert page.get_by_role('button',name='Pause hero effects').count()==0
  assert page.locator('.portrait img').evaluate('n=>n.complete&&n.naturalWidth===460')
  assert page.locator('.hero-landscape img').evaluate("n=>getComputedStyle(n).animationName==='none'")
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  context.close();checks.append({'width':width,'lighting':True,'keyboard':True,'pause':True,'offscreen':True,'reduced_motion':True,'walkthroughs':3});print('PASS scene and architecture',width,flush=True)
 context=browser.new_context(viewport={'width':390,'height':844},java_script_enabled=False)
 page=context.new_page();page.goto(BASE,wait_until='networkidle')
 assert page.locator('.portrait img').evaluate('n=>n.naturalWidth===460')
 assert page.locator('.experiment-play:visible').count()==0
 page.get_by_text('Explore',exact=True).click();assert page.get_by_role('navigation',name='Mobile navigation').is_visible()
 for system in ['signalizeai','boardeject','aashinyra']:
  page.locator(f'label:has(#system-{system})').click();assert page.locator(f'[data-system={system}]').is_visible()
 context.close()
 # Stub only the external demo document boundary for deterministic lifecycle checks.
 context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
 page=context.new_page();page.goto(BASE,wait_until='networkidle');loaded=[]
 def experiment(route):
  loaded.append(route.request.url);route.fulfill(content_type='text/html',body='<p>Interactive experiment loaded</p>')
 page.route('**/facetworks/*/',experiment)
 assert page.locator('.experiment-preview iframe').count()==0
 for slug,name in [('fogged-glass','Fogged Glass'),('magnetic-sand','Magnetic Sand')]:
  page.get_by_role('button',name=f'Try {name} here').click()
  page.frame_locator(f'iframe[title="Interactive {name} experiment"]').get_by_text('Interactive experiment loaded').wait_for()
  assert page.locator('.experiment-preview iframe').count()==1
  assert page.locator('.experiment-preview iframe').bounding_box()['height']>=640
  assert page.get_by_role('button',name=f'Close {name} preview').evaluate('n=>n===document.activeElement')
 page.keyboard.press('Escape')
 assert page.locator('.experiment-preview iframe').count()==0 and len(loaded)==2
 assert page.get_by_role('button',name='Try Magnetic Sand here').evaluate('n=>n===document.activeElement')
 context.close();browser.close()
report={'base':BASE,'checks':checks,'runtime_errors':errors,'ok':not errors}
(OUT/'verification.json').write_text(json.dumps(report,indent=2)+'\n');assert not errors,errors
print('PASS actual rendered interaction, fallback, native architecture, single iframe and focus restore',flush=True)

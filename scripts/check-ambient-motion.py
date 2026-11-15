"""Prove that visible scenery moves without input and stops when requested."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
BASE=os.getenv('PORTFOLIO_URL','http://127.0.0.1:8947').rstrip('/')
OUT=Path(os.getenv('AMBIENT_ARTIFACTS','/tmp/portfolio-ambient'));OUT.mkdir(parents=True,exist_ok=True)
errors=[];rows=[]

def current(node):
 return node.evaluate('n=>{const s=getComputedStyle(n);return [s.transform,s.opacity]}')

def freezes(page,node):
 node.evaluate('n=>getComputedStyle(n).animationPlayState')
 page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
 before=current(node);page.wait_for_timeout(220);assert current(node)==before,'Paused scenery kept changing'

def advances(page,node):
 before=current(node);page.wait_for_timeout(500);assert current(node)!=before,'Scenery needed input to move'

with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
 for width in [320,390,768,1440]:
  ctx=b.new_context(viewport={'width':width,'height':1000},reduced_motion='no-preference',is_mobile=width<768,has_touch=width<768)
  page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));requested=[];page.on('request',lambda r:requested.append(r.url));page.goto(BASE,wait_until='networkidle')
  page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='true'")
  flight=page.locator('.hero-cinema .coast-flight');x=flight.bounding_box()['x'];page.wait_for_timeout(1500)
  assert abs(flight.bounding_box()['x']-x)>10,'Idle hero movement was imperceptible'
  advances(page,page.locator('.hero-landscape img'));page.screenshot(path=str(OUT/f'hero-idle-{width}.png'))
  assert not any('.glb' in u for u in requested),'Idle motion loaded the optional WebGL object'
  page.reload(wait_until='networkidle');page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='true'");advances(page,flight)
  page.get_by_role('button',name='Pause hero effects').click();page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='false'");freezes(page,flight)
  page.get_by_role('button',name='Play hero effects').click();page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='true'");advances(page,flight)
  kinds=[]
  for chapter in page.locator('.work-world,.immersive-chapter').all():
   backdrop=chapter.locator('.chapter-environment');backdrop.evaluate('n=>n.scrollIntoView({block:"start"})')
   page.wait_for_function("(scene)=>document.querySelector('.environment-'+scene).dataset.active==='true'",arg=backdrop.get_attribute('class').split('environment-')[-1])
   subject=backdrop.locator('.coastal-atmosphere > *').first;advances(page,subject)
   kind=backdrop.locator('.coastal-atmosphere').get_attribute('class');kinds.append(kind)
   button=chapter.get_by_role('button',name='Pause scenery: '+backdrop.get_attribute('class').split('environment-')[-1],exact=True)
   assert button.evaluate('n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44}')
   assert button.evaluate('n=>n.getAttribute("aria-label").toLowerCase().includes(n.textContent.trim().toLowerCase())'),'Accessible name must contain the visible label'
   overlaps=button.evaluate('n=>{const b=n.getBoundingClientRect();return [...n.parentElement.querySelectorAll(".chapter-heading,h3,.system-picker,.sculpture-launch")].filter(x=>{const r=x.getBoundingClientRect();return Math.min(b.right,r.right)>Math.max(b.left,r.left)&&Math.min(b.bottom,r.bottom)>Math.max(b.top,r.top)}).map(x=>({class:x.className,rect:x.getBoundingClientRect().toJSON(),button:b.toJSON()}))}')
   if overlaps:page.screenshot(path=str(OUT/f'overlap-{width}.png'))
   assert not overlaps,(width,backdrop.get_attribute('class'),overlaps)
   button.focus();page.keyboard.press('Enter');page.wait_for_function('(n)=>n.dataset.active===\'false\'',arg=backdrop.element_handle());freezes(page,subject)
   chapter.screenshot(path=str(OUT/f'{backdrop.get_attribute("class").split("environment-")[-1]}-{width}.png'))
   page.keyboard.press('Enter');page.wait_for_function('(n)=>n.dataset.active===\'true\'',arg=backdrop.element_handle())
  assert len(set(kinds))==4,'Chapter atmosphere did not use distinct scene types'
  assert page.locator('.hero-cinema').get_attribute('data-active')=='false'
  first=page.locator('.chapter-environment').first;assert first.get_attribute('data-active')=='false'
  page.emulate_media(reduced_motion='reduce');page.wait_for_function("[...document.querySelectorAll('.chapter-environment,.hero-cinema')].every(n=>n.dataset.active==='false')")
  assert page.locator('.scene-ambient-toggle').count()==0
  assert page.locator('.coastal-atmosphere').evaluate_all("ns=>ns.every(n=>n.getAnimations({subtree:true}).length===0)")
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  ctx.close();rows.append({'width':width,'idle_reload':True,'perceptible_flight':True,'chapter_motion':True,'keyboard_pause':True,'no_collisions':True,'offscreen':True,'reduced_motion':True});print('PASS ambient motion',width,flush=True)
 ctx=b.new_context(viewport={'width':390,'height':900},reduced_motion='no-preference');page=ctx.new_page();page.goto(BASE,wait_until='networkidle')
 # Exercise the document visibility listener independently of browser/headless tab policy.
 page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))")
 page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='false'")
 page.evaluate("delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))")
 page.wait_for_function("document.querySelector('.hero-cinema').dataset.active==='true'")
 for route in ['/projects','/','/contact','/']:
  if not page.locator('.home-mobile-menu').evaluate('n=>n.open'):page.locator('.home-mobile-menu summary').click()
  label={'/projects':'Projects','/contact':'Contact','/':'Home'}[route];page.get_by_role('navigation',name='Mobile navigation').get_by_role('link',name=label,exact=True).click();page.wait_for_url(BASE+route)
  if route=='/':
   page.wait_for_function("document.querySelectorAll('.scene-ambient-toggle').length===6")
   advances(page,page.locator('.hero-cinema .coast-flight'))
 ctx.close()
 ctx=b.new_context(viewport={'width':390,'height':900},java_script_enabled=False);page=ctx.new_page();page.goto(BASE,wait_until='networkidle')
 assert page.locator('.scene-ambient-toggle').count()==0
 assert page.get_by_role('link',name='Discover my work').is_visible()
 assert page.locator('.coastal-atmosphere').evaluate_all('ns=>ns.every(n=>n.getAnimations({subtree:true}).every(a=>a.playState!=="running"))')
 ctx.close();b.close()
assert not errors,errors
(OUT/'verification.json').write_text(json.dumps({'ok':True,'checks':rows,'hidden_tab':True,'client_navigation':True,'no_js':True,'runtime_errors':errors},indent=2)+'\n')
print('PASS idle motion after reload, hidden tab, client navigation, reduced motion and no JavaScript')

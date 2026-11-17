"""Exercise the optional authored model, native product illustration and film chapters."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json
BASE=os.getenv('PORTFOLIO_URL','http://127.0.0.1:8947').rstrip('/')
OUT=Path(os.getenv('COASTAL_ARTIFACTS','/tmp/portfolio-coastal'));OUT.mkdir(parents=True,exist_ok=True)
graphics_chunks=[p.name for p in (Path(__file__).resolve().parents[1]/'out/_next/static/chunks').glob('*.js') if 'isWebGLRenderer' in p.read_text()]
assert graphics_chunks,'Build the static site before running graphics checks'
errors=[];checks=[]
def assert_lab_separation(page):
 assert page.evaluate("""() => {
  const subtitle = document.querySelector('.playground-heading > p').getBoundingClientRect();
  const lab = document.querySelector('.coastal-sculpture').getBoundingClientRect();
  return subtitle.bottom <= lab.top || subtitle.right <= lab.left || lab.right <= subtitle.left;
 }"""), 'Playground subtitle overlaps the active sculpture'

with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--enable-unsafe-swiftshader'])
 for width in [320,390,768,1440]:
  ctx=b.new_context(viewport={'width':width,'height':1000},reduced_motion='reduce',has_touch=width<768,is_mobile=width<768)
  page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));requests=[];page.on('request',lambda r:requests.append(r.url))
  page.goto(BASE,wait_until='networkidle')
  assert not any('.glb' in x for x in requests),'Model competed with initial load'
  assert not any(x.split('?')[0].endswith('/'+chunk) for x in requests for chunk in graphics_chunks),'Three.js competed with initial load'
  board=page.locator('.board-demo');board.scroll_into_view_if_needed();page.get_by_role('button',name='Convert to Excalidraw').click()
  assert board.get_attribute('data-converted')=='true'
  assert '3 shapes · 2 bound arrows' in board.locator('[role=status]').inner_text()
  assert board.locator('svg.board-canvas .board-shape[role=button]').count()==3
  page.get_by_role('button',name='Back to Freeform').click();assert board.get_attribute('data-converted')=='false'
  launch=page.get_by_role('button',name='Make it yours');launch.click()
  host=page.locator('.coastal-sculpture');assert_lab_separation(page);page.locator('.coastal-sculpture[data-state=ready]').wait_for(timeout=45000)
  assert_lab_separation(page);canvas=host.locator('canvas');canvas.scroll_into_view_if_needed()
  page.wait_for_function("Number(document.querySelector('.sculpture-lab canvas').dataset.renderCount)>0")
  page.wait_for_timeout(150);original=canvas.screenshot()
  turn=page.get_by_role('slider',name='Rotate sculpture');turn.focus()
  for _ in range(30):page.keyboard.press('ArrowRight')
  assert int(turn.input_value())==30
  page.wait_for_timeout(120);rotated=canvas.screenshot();assert rotated!=original,'Keyboard input did not change the model'
  page.get_by_role('button',name='Rose glow',exact=True).click();page.wait_for_timeout(120)
  assert canvas.screenshot()!=rotated,'Lighting did not change the rendered output'
  assert page.get_by_role('button',name='Rose glow',exact=True).get_attribute('aria-pressed')=='true'
  rect=canvas.bounding_box();before=turn.input_value()
  if width>=768:
   page.mouse.move(rect['x']+rect['width']*.4,rect['y']+rect['height']*.5);page.mouse.down();page.mouse.move(rect['x']+rect['width']*.55,rect['y']+rect['height']*.5,steps=6);page.mouse.up()
  else:
   cdp=ctx.new_cdp_session(page);x=rect['x']+rect['width']*.3;y=rect['y']+rect['height']*.5
   cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
   for offset in [12,25,40,60]:cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+offset,'y':y}]})
   cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
  assert turn.input_value()!=before,'Drag did not rotate the model'
  assert canvas.evaluate("n=>getComputedStyle(n).touchAction==='pan-y'")
  page.get_by_role('button',name='Reset sculpture').click();assert turn.input_value()=='0'
  page.wait_for_timeout(150);count=canvas.get_attribute('data-render-count');page.wait_for_timeout(350)
  assert canvas.get_attribute('data-render-count')==count,'Unnecessary continuous renderer loop'
  host.screenshot(path=str(OUT/f'sculpture-{width}.png'))
  page.evaluate('window.savedSculptureCanvas=document.querySelector(".sculpture-lab canvas")')
  page.keyboard.press('Escape');assert host.get_attribute('data-state')=='poster'
  assert launch.evaluate('n=>n===document.activeElement'),'Focus was not restored'
  assert page.evaluate('window.savedSculptureCanvas.dataset.renderCount===undefined'),'Renderer was not disposed'
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  ctx.close();checks.append({'width':width,'model_pixels':True,'lighting':True,'keyboard':True,'drag':True,'idle':True,'dispose':True,'board':True});print('PASS sculpture and board',width,flush=True)
 ctx=b.new_context(viewport={'width':390,'height':1000},reduced_motion='no-preference');page=ctx.new_page();page.goto(BASE,wait_until='networkidle')
 page.get_by_role('button',name='Make it yours').click();page.locator('.coastal-sculpture[data-state=ready]').wait_for(timeout=45000)
 page.get_by_role('button',name='Close sculpture').click();ctx.close()
 for failure in ['model','chunk']:
  ctx=b.new_context(viewport={'width':390,'height':900},reduced_motion='reduce');page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.goto(BASE,wait_until='networkidle')
  if failure=='model':page.route('**/*.glb',lambda r:r.abort())
  else:page.route('**/_next/static/chunks/*.js',lambda r:r.abort())
  page.get_by_role('button',name='Make it yours').click();page.locator('.coastal-sculpture[data-state=error]').wait_for(timeout=30000)
  assert_lab_separation(page)
  assert page.locator('.coastal-sculpture .world-scene img').is_visible()
  page.get_by_role('button',name='Close sculpture').click();assert page.get_by_role('button',name='Make it yours').evaluate('n=>n===document.activeElement')
  ctx.close()
 ctx=b.new_context(viewport={'width':390,'height':900},reduced_motion='reduce')
 ctx.add_init_script("""
  window.sculptureLostContexts = 0;
  const proto = WebGL2RenderingContext.prototype;
  const getExtension = proto.getExtension;
  proto.getExtension = function(name) {
   const extension = getExtension.call(this, name);
   if (name === 'WEBGL_lose_context' && extension) {
    const lose = extension.loseContext.bind(extension);
    extension.loseContext = () => { window.sculptureLostContexts++; lose(); };
   }
   return extension;
  };
  proto.shaderSource = function() { throw new Error('Simulated shader setup failure'); };
 """)
 page=ctx.new_page();page.goto(BASE,wait_until='networkidle');page.get_by_role('button',name='Make it yours').click()
 page.locator('.coastal-sculpture[data-state=error]').wait_for(timeout=30000)
 assert page.evaluate('window.sculptureLostContexts>0'),'Failed setup did not release the allocated graphics context'
 assert_lab_separation(page);ctx.close()
 ctx=b.new_context(viewport={'width':390,'height':900},java_script_enabled=False);page=ctx.new_page();page.goto(BASE,wait_until='networkidle')
 assert page.get_by_role('button',name='Make it yours').count()==0
 assert page.get_by_role('button',name='Convert to Excalidraw').is_hidden()
 assert page.get_by_role('link',name='View BoardEject',exact=True).last.is_visible()
 ctx.close()
 ctx=b.new_context(viewport={'width':390,'height':1000},reduced_motion='no-preference');page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.goto(BASE,wait_until='networkidle');page.locator('.reel-stage').scroll_into_view_if_needed()
 page.get_by_role('button',name='Pause reel').click()
 for name,index in [('Code','0'),('Convert','1'),('Ship','2')]:
  page.get_by_role('button',name=f'Watch {name} chapter').click();page.wait_for_function('(index)=>document.querySelector("[data-reel-scene]").dataset.reelScene===index',arg=index)
  page.locator('.reel-stage').screenshot(path=str(OUT/f'film-{name}.png'))
 ctx.close();b.close()
assert not errors,errors
(OUT/'verification.json').write_text(json.dumps({'ok':True,'checks':checks,'failure_fallbacks':True,'no_js':True,'film_chapters':True,'errors':errors},indent=2)+'\n')
print('PASS graphics/model failure fallbacks, no-JS, three real film chapters and no runtime errors')

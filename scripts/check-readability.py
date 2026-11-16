from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json
BASE=os.getenv('PORTFOLIO_URL','http://127.0.0.1:8947').rstrip('/');OUT=Path(os.getenv('READABILITY_ARTIFACTS','/tmp/portfolio-readability'));OUT.mkdir(parents=True,exist_ok=True);rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
 for width in [320,360,390,430,768,850,1024,1440,1920]:
  page=b.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce')
  page.goto(BASE,wait_until='networkidle')
  assert not page.locator('main a[href*="agentpostmortem"]').count()
  assert [x.inner_text() for x in page.locator('.work-meta h3').all()]==['BoardEject','SignalizeAI','AashiNyra']
  font=lambda s:page.locator(s).first.evaluate('n=>parseFloat(getComputedStyle(n).fontSize)')
  assert font('.site-nav a')>=17
  assert font('.brand-link>span')>=16
  assert font('.home-mobile-menu summary')>=15
  assert font('.header-actions .primary-link')>=16
  assert page.locator('.site-header').evaluate('n=>{const r=n.getBoundingClientRect();return [...n.querySelectorAll("a,summary")].filter(x=>{return x.checkVisibility()}).every(x=>{const b=x.getBoundingClientRect();return b.left>=0&&b.right<=innerWidth&&b.bottom<=r.bottom+1})}'), (width,'header bounds')
  if width<1024:
   page.locator('.home-mobile-menu summary').click()
   nav=page.get_by_role('navigation',name='Mobile navigation')
   assert nav.get_by_role('link',name='Home',exact=True).get_attribute('aria-current')=='page'
   assert nav.evaluate('n=>{const b=n.getBoundingClientRect();return b.left>=0&&b.right<=innerWidth&&b.bottom<=innerHeight}')
   page.keyboard.press('Escape')
  for selector in ['.hero-description','.work-stack li','.work-visit','.programme-strip span','.system-picker label > span']:
   assert font(selector)>=14,(width,selector,font(selector))
  if width<=430:
   portrait=page.locator('.portrait img').bounding_box();copy=page.locator('.hero-details').bounding_box()
   assert portrait['y']+portrait['height']*.18>=copy['y']+copy['height']+8,(width,'portrait covers copy')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  page.screenshot(path=str(OUT/f'hero-{width}.png'))
  for label,selector in [('work','.work-details'),('systems','.systems-heading'),('explore','.discovery-heading')]:
   page.locator(selector).first.evaluate('n=>n.scrollIntoView({block:"center"})')
   visible=page.locator('.chapter-environment img').all()
   for img in visible:img.evaluate('async n=>await n.decode()')
   page.screenshot(path=str(OUT/f'{label}-{width}.png'))
  for route in ['/projects','/contact','/calendar']:
   page.goto(BASE+route,wait_until='networkidle')
   assert font('.site-nav a')>=17 and page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,route)
   if route=='/projects':
    # The overview shows four previews per group; the full external collection
    # retains all tools, verified separately by the collection inventory check.
    section=page.locator('#agentpostmortem')
    assert section.locator('[data-project-group]').count()==3
    assert section.locator('[data-project-id]').count()==12
    assert section.locator('.collection-all').get_attribute('href')=='https://www.agentpostmortem.com/tools'
  rows.append({'width':width,'typography':True,'home_curated':True,'projects_preserved':True,'route_bounds':True});page.close()
 b.close()
(OUT/'readability.json').write_text(json.dumps(rows,indent=2)+'\n');print('PASS readable type across nine widths/all routes; three curated Home projects; AgentPostmortem and related work retained in Projects')

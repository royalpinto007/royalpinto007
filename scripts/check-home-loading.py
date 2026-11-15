"""Check mobile loading boundaries and the deferred, recoverable contribution calendar."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
BASE=os.getenv('PORTFOLIO_URL','http://127.0.0.1:8947').rstrip('/')
OUT=Path(os.getenv('LOADING_ARTIFACTS','/tmp/portfolio-home-loading'));OUT.mkdir(parents=True,exist_ok=True)
errors=[];requests=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
 context=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce',color_scheme='dark')
 page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url))
 response=page.goto(BASE,wait_until='networkidle');html=response.text()
 assert len(html.encode())<300000, 'Initial document grew beyond the loading budget'
 assert 'data-date=' not in html, 'Calendar is still serialized in the initial document'
 assert not any('/wall2026.svg' in u for u in requests), 'Calendar loaded before its section approached view'
 assert not any('/scene/sunset-coast.webp' in u for u in requests), 'Mobile loaded the desktop landscape'
 assert not any('_rsc=' in u for u in requests), 'Initial page eagerly prefetched other routes'
 assert page.locator('.hero-landscape img').evaluate('n=>n.currentSrc').endswith('/scene/coast-mobile.webp')
 assert page.locator('.portrait img').evaluate('n=>n.currentSrc').endswith('/portrait-original.webp')
 assert page.locator('html').evaluate("n=>getComputedStyle(n).colorScheme==='light'")
 assert page.locator('body').evaluate("n=>getComputedStyle(n).backgroundColor")== 'rgb(247, 246, 242)'
 page.route('**/wall2026.svg',lambda r:r.fulfill(status=503,content_type='text/plain',body='Unavailable'))
 page.locator('#oss').scroll_into_view_if_needed();page.get_by_text('The calendar could not load.').wait_for()
 assert page.get_by_role('link',name='View the contribution calendar').is_visible()
 assert page.get_by_role('button',name='Try again',exact=True).evaluate('n=>{const r=n.getBoundingClientRect(),p=n.closest(".contribution-wall").getBoundingClientRect();return r.left>=p.left&&r.right<=p.right}'), 'Retry is clipped outside the calendar viewport'
 assert page.get_by_text('The calendar could not load.').evaluate('n=>{const r=n.getBoundingClientRect(),p=n.closest(".contribution-wall").getBoundingClientRect();return r.left>=p.left&&r.right<=p.right}'), 'Error message is clipped outside the calendar viewport'
 page.unroute('**/wall2026.svg');page.get_by_role('button',name='Try again',exact=True).click();page.locator('.wall-svg rect').first.wait_for()
 assert page.locator('.wall-svg rect').evaluate_all('ns=>ns.reduce((s,n)=>s+Number(n.dataset.count),0)')==int(page.locator('.contribution-summary strong').inner_text().split(' contributions')[0].replace(',',''))
 assert page.locator('.wall-svg rect').first.locator('title').text_content()
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 for selector in ['.work-heading .world-scene','.systems-heading .world-scene','.playground-heading .world-scene']:
  scene=page.locator(selector);scene.scroll_into_view_if_needed();r=scene.bounding_box();assert r['width']>250 and r['height']>150
 page.screenshot(path=str(OUT/'world-mobile.png'));context.close()
 context=b.new_context(viewport={'width':390,'height':844},java_script_enabled=False)
 page=context.new_page();page.goto(BASE,wait_until='networkidle');page.locator('#oss').scroll_into_view_if_needed();page.wait_for_function("document.querySelector('.calendar-static').naturalWidth>0")
 assert page.locator('.calendar-pending').is_hidden()
 assert page.get_by_role('link',name='Open the contribution calendar with daily dates and counts').is_visible()
 page.screenshot(path=str(OUT/'calendar-no-js.png'));context.close();b.close()
assert not errors,errors
(OUT/'verification.json').write_text(json.dumps({'ok':True,'initial_document_bytes':len(html.encode()),'calendar_error_retry':True,'no_js_calendar':True,'mobile_images':True,'no_eager_prefetch':True,'light_mode_with_dark_os':True,'runtime_errors':errors},indent=2)+'\n')
print('PASS mobile loading boundaries, light-only theme, calendar error/retry, counts, native no-JS fallback and visible scene stages')

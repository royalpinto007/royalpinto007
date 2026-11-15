"""Check illustration text, diagram labels and overflow across breakpoints."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
OUT=Path(os.getenv('BOUNDS_ARTIFACTS','/tmp/portfolio-home-bounds'));OUT.mkdir(parents=True,exist_ok=True)
BASE=os.getenv('PORTFOLIO_URL','http://127.0.0.1:8947')
issues=[];checks=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
 for w in [320,360,390,480,600,767,768,900,1024,1280,1440,1920,2200]:
  page=b.new_page(viewport={'width':w,'height':1000},reduced_motion='reduce')
  page.goto(BASE,wait_until='networkidle')
  def check(label):
   found=page.evaluate('''() => {
    const issues=[];
    const visible=n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(n).visibility!=='hidden'};
    const inside=(r,b)=>r.left>=b.left-2&&r.right<=b.right+2&&r.top>=b.top-2&&r.bottom<=b.bottom+2;
    const copy=document.querySelector('.hero-copy');
    const blocks=[...copy.querySelectorAll('.intro-name,h1,.hero-description,.hero-open-source,.hero-actions')];
    for(let i=0;i<blocks.length;i++) {
     const r=blocks[i].getBoundingClientRect(),bound=copy.getBoundingClientRect();
     if(!inside(r,bound))issues.push({kind:'hero content escapes',text:blocks[i].textContent});
     for(let j=i+1;j<blocks.length;j++){
      const q=blocks[j].getBoundingClientRect();
      if(Math.min(r.right,q.right)-Math.max(r.left,q.left)>3&&Math.min(r.bottom,q.bottom)-Math.max(r.top,q.top)>3)issues.push({kind:'hero text collision',a:blocks[i].textContent,b:blocks[j].textContent});
     }
    }
    const abbreviations=[...document.querySelectorAll('.journey-start .programme-strip strong')].map(n=>n.getBoundingClientRect().top);
    if(Math.max(...abbreviations)-Math.min(...abbreviations)>2)issues.push({kind:'programme baselines misaligned'});
    for(const art of document.querySelectorAll('.product-art')) {
     const bound=art.getBoundingClientRect();const texts=[];
     for(const n of art.querySelectorAll('span,strong,small')) {
      if(!visible(n)||!n.textContent.trim()||n.querySelector('span,strong,small'))continue;
      const range=document.createRange();range.selectNodeContents(n);const r=range.getBoundingClientRect();
      if(!inside(r,bound))issues.push({kind:'art text escapes',text:n.innerText});
      texts.push({n,r});
     }
     for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){
      const a=texts[i],c=texts[j];
      if(a.n.contains(c.n)||c.n.contains(a.n))continue;
      const overlapX=Math.min(a.r.right,c.r.right)-Math.max(a.r.left,c.r.left);
      const overlapY=Math.min(a.r.bottom,c.r.bottom)-Math.max(a.r.top,c.r.top);
      if(overlapX>3&&overlapY>3)issues.push({kind:'art text collision',a:a.n.innerText,b:c.n.innerText});
     }
    }
    for(const n of document.querySelectorAll('.map-node text')){
     if(!visible(n))continue;
     if(!inside(n.getBoundingClientRect(),n.parentElement.querySelector('rect').getBoundingClientRect()))issues.push({kind:'map label escapes node',text:n.textContent});
    }
    for(const n of document.querySelectorAll('.architecture-map')){
     if(!visible(n))continue;
     const bound=n.getBoundingClientRect();
     for(const x of n.querySelectorAll('text,rect'))if(!inside(x.getBoundingClientRect(),bound))issues.push({kind:'map escapes svg',text:x.textContent});
    }
    if(document.documentElement.scrollWidth>innerWidth)issues.push({kind:'page overflow'});
    return issues;
   }''')
   issues.extend({'width':w,'case':label,**x} for x in found)
  for system in ['aashinyra','signalizeai','boardeject']:
   page.locator(f'label:has(#system-{system})').click()
   check(system)
   if w<1024:
    panel=page.locator('.system-case:visible .system-full-map');panel.locator('summary').click()
    check(system+'-full-map');panel.locator('summary').click()
  checks.append(w);page.close();print('CHECK bounds',w,flush=True)
 b.close()
report={'base':BASE,'widths':checks,'issues':issues,'ok':not issues}
(OUT/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
assert not issues,issues
print('PASS text containment, illustration collision, map-label bounds and page overflow',flush=True)

"""Verify the displayed portrait has original RGB pixels and one intact outline."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json
BASE=os.getenv('PORTFOLIO_URL','http://127.0.0.1:8947').rstrip('/')
OUT=Path(os.getenv('PORTRAIT_ARTIFACTS','/tmp/portfolio-portrait'));OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome');page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');page.goto(BASE,wait_until='networkidle')
 result=page.evaluate('''async()=>{
  const read=async(src)=>{const i=new Image();i.src=src;await i.decode();const c=document.createElement('canvas');c.width=460;c.height=460;const x=c.getContext('2d');x.drawImage(i,0,0,460,460);return x.getImageData(0,0,460,460).data};
  const [original,display,mask]=await Promise.all(['/portrait-sky.png','/portrait-original.webp','/scene/portrait-outline.svg'].map(read));
  let differences=0;for(let i=0;i<original.length;i++)if(original[i]!==display[i])differences++;
  const alpha=(x,y)=>mask[(y*460+x)*4+3];
  const points=[[220,96],[263,221],[235,160],[235,270]].map(([x,y])=>({x,y,alpha:alpha(x,y)}));
  const remaining=new Set();for(let y=0;y<460;y++)for(let x=0;x<460;x++)if(alpha(x,y)>128)remaining.add(y*460+x);
  let components=0;while(remaining.size){components++;const first=remaining.values().next().value;remaining.delete(first);const queue=[first];for(let n=0;n<queue.length;n++){const k=queue[n],x=k%460,y=Math.floor(k/460);for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]]){const xx=x+dx,yy=y+dy,next=yy*460+xx;if(xx>=0&&xx<460&&yy>=0&&yy<460&&remaining.delete(next))queue.push(next)}}}
  return {differences,points,components};
 }''')
 assert result['differences']==0,result
 assert result['components']==1,'Detached pieces in the portrait mask'
 assert all(x['alpha']>200 for x in result['points']),'Hairline or phone frame is clipped'
 for w in [320,390,768,1440,1920]:
  page.set_viewport_size({'width':w,'height':1000});page.locator('.portrait img').evaluate('async n=>await n.decode()')
  assert page.locator('.portrait img').evaluate("n=>getComputedStyle(n).filter==='none'&&n.currentSrc.endsWith('/portrait-original.webp')&&Math.abs(n.getBoundingClientRect().width-n.getBoundingClientRect().height)<1")
  assert page.locator('.portrait img').count()==1
  page.screenshot(path=str(OUT/f'portrait-{w}.png'))
 b.close()
(OUT/'verification.json').write_text(json.dumps({'ok':True,**result},indent=2)+'\n');print('PASS original portrait pixels match exactly; no color filters/stretch; complete hair/phone frame and one connected outline at five widths')

const {chromium}=require('playwright');
const fs=require('node:fs');
fs.mkdirSync('test-results/demo',{recursive:true});
(async()=>{
 const b=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 const c=await b.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:'test-results/demo',size:{width:1440,height:1000}},permissions:['clipboard-read','clipboard-write']});
 const p=await c.newPage();const video=p.video();p.setDefaultTimeout(15000);
 await p.goto(process.env.PREVIEW_URL||'http://127.0.0.1:3001',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const caption=async(title,body,selector,seconds=6)=>{
  if(selector)await p.locator(selector).scrollIntoViewIfNeeded();
  await p.evaluate(({title,body})=>{let el=document.getElementById('demo-caption');if(!el){el=document.createElement('aside');el.id='demo-caption';document.body.append(el)}el.style.cssText='position:fixed;bottom:22px;left:50%;transform:translateX(-50%);width:min(950px,90vw);padding:20px 28px;border:1px solid #666;border-radius:14px;background:#101014f5;color:white;z-index:999999;box-shadow:0 12px 45px #0009;font:17px/1.5 Arial,sans-serif;pointer-events:none';el.replaceChildren();const h=document.createElement('strong');h.textContent=title;h.style.cssText='display:block;color:#c0ef9c;font-size:19px;margin-bottom:5px';const text=document.createElement('div');text.textContent=body;el.append(h,text);},{title,body});
  await p.waitForTimeout(seconds*1000);
 };
 await caption('STRIKE / Your next connection','Thunder Hackathon 6.0. A familiar STRIKE homepage with a sale discovered through doing.',null,7);
 await p.getByRole('button',{name:'Run Code',exact:false}).click();
 await caption('Discovery begins in the editor','Running the welcome code reveals a clue. It leads into Membership, where the user is already considering a plan.','.editor',7);
 await caption('A small interaction, a clear purpose','Connect Learn, Build and Unlock. The sequence mirrors the learning journey and makes the offer something you discover.','.circuit-panel',7);
 for(const n of ['Learn','Build']){await p.getByRole('button',{name:n+', connect next node'}).click();await p.waitForTimeout(1800);}
 await p.getByRole('button',{name:'Unlock, connect next node'}).click();
 await caption('The connection reveals the reward','20% off the selected Strike Plus duration. A clear coupon and a 36-hour countdown appear only after the reveal.','.circuit-panel',8);
 await p.getByRole('button',{name:'Copy code',exact:true}).click();
 await caption('Copy or use. No dead end.','THUNDER20 copies to the clipboard. Using it opens the checkout preview with the reduced total.',null,6);
 await p.getByRole('button',{name:/Use offer/}).click();await p.waitForTimeout(5500);await p.keyboard.press('Escape');
 await p.reload({waitUntil:'networkidle'});
 await caption('The deadline survives a refresh','The original expiry timestamp is stored in this browser. Refreshing never gives the user a new countdown.','.circuit-panel',7);
 await p.getByRole('button',{name:'Dismiss offer'}).click();
 await caption('Respect the user’s choice','Dismiss the offer and reopen it later. The same deadline and selected offer are retained.','.circuit-panel',5);
 await p.getByRole('button',{name:/Reopen offer/}).click();await p.waitForTimeout(2000);
 await p.getByRole('button',{name:'Select Meta'}).click();
 await caption('Useful motion, accessible controls','Company logos respond to touch and keyboard. Motion pauses on interaction, out of view, in hidden tabs, and under reduced motion.','.company-explorer',7);
 await p.setViewportSize({width:390,height:844});await p.emulateMedia({reducedMotion:'reduce'});await p.goto(process.env.PREVIEW_URL||'http://127.0.0.1:3001',{waitUntil:'networkidle'});
 await caption('Built for mobile too','Readable cards, touch controls, a compact menu and the complete offer flow. Reduced motion preserves every feature.',null,6);
 await p.locator('.circuit-panel').scrollIntoViewIfNeeded();await p.waitForTimeout(3500);
 await p.setViewportSize({width:1440,height:1000});await p.evaluate(()=>localStorage.setItem('strike-circuit-v2',JSON.stringify({expires:Date.now()-1000,dismissed:false,applied:true})));await p.reload({waitUntil:'networkidle'});
 await caption('Expiry is enforced in the demo','When time runs out, copy and use are disabled and the checkout removes the discount. This is a frontend demonstration; no real payment is taken.','.circuit-panel',8);
 await caption('Why this approach?','The offer belongs in the learning journey. A clue creates curiosity, a short interaction earns the reveal, and a clear next action completes it.',null,8);
 await c.close();await video.saveAs('test-results/strike-demo.webm');await b.close();console.log('Recorded test-results/strike-demo.webm');
})().catch(e=>{console.error(e);process.exitCode=1;});

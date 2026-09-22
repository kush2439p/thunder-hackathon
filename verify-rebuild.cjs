const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const out='C:/Users/kushv/.codex/visualizations/2026/09/21/01a0c151-4bae-7643-bc6a-c18fed635624';
(async()=>{
const b=await chromium.launch({channel:'msedge',headless:true});const c=await b.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:3001/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);console.log('TITLE',await p.title());await p.screenshot({path:out+'/rebuild-hero.jpg',quality:65});
await p.getByRole('button',{name:'Run Code'}).click();assert.match(await p.locator('.terminal').innerText(),/ready to build/);
await p.locator('#plans').scrollIntoViewIfNeeded();await p.waitForTimeout(1000);await p.screenshot({path:out+'/rebuild-plans.jpg',quality:65});
for(const n of ['Learn','Build','Unlock'])await p.getByRole('button',{name:n+', connect next node'}).click();
const expiry=await p.evaluate(()=>JSON.parse(localStorage.getItem('strike-circuit-v2')).expires);
await p.getByRole('button',{name:'Copy code',exact:true}).click();assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),'THUNDER20');
await p.getByRole('button',{name:/Use offer/}).click();assert(await p.locator('dialog').isVisible());assert.match(await p.locator('.discount-line').innerText(),/THUNDER20/);await p.keyboard.press('Escape');
await p.reload({waitUntil:'networkidle'});assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('strike-circuit-v2')).expires),expiry);
await p.getByRole('button',{name:'Dismiss offer'}).click();await p.reload({waitUntil:'networkidle'});await p.getByRole('button',{name:/Reopen offer/}).click();
await p.locator('.circuit-panel').scrollIntoViewIfNeeded();await p.screenshot({path:out+'/rebuild-offer.jpg',quality:65});
for(const id of ['courses','why-strike','mentors','reviews','faq']){await p.locator('#'+id).scrollIntoViewIfNeeded();await p.waitForTimeout(900);await p.screenshot({path:out+'/rebuild-'+id+'.jpg',quality:60});}
await p.locator('summary').first().click();assert.equal(await p.locator('details').first().getAttribute('open'),'');
await p.evaluate(()=>localStorage.setItem('strike-circuit-v2',JSON.stringify({expires:Date.now()+1500,dismissed:false,applied:true})));await p.reload({waitUntil:'networkidle'});await p.waitForTimeout(2000);assert(await p.getByRole('button',{name:'Offer expired',exact:true}).isDisabled());assert(await p.getByRole('button',{name:'Copy code',exact:true}).isDisabled());
await p.getByRole('button',{name:'Get Strike Plus',exact:false}).click();assert.equal(await p.locator('.discount-line').count(),0);await p.keyboard.press('Escape');
const sizes=[];for(const width of [1440,768,390,320]){const mobile=await b.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768,reducedMotion:'reduce'});const q=await mobile.newPage();q.on('pageerror',e=>errors.push(e.message));await q.goto('http://localhost:3001/',{waitUntil:'networkidle'});await q.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=650){scrollTo(0,y);await new Promise(r=>setTimeout(r,25));}});await q.evaluate(()=>scrollTo(0,0));await q.waitForTimeout(500);const metrics=await q.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));assert(metrics.scroll<=metrics.viewport+1,JSON.stringify({width,...metrics}));assert.deepEqual(metrics.broken,[]);
if(width<900){await q.getByRole('button',{name:'Open menu'}).click();await q.getByRole('link',{name:'Courses',exact:true}).click();assert.equal(await q.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');await q.evaluate(()=>scrollTo(0,0));}
await q.screenshot({path:out+'/rebuild-'+width+'.jpg',quality:65});if(width===390){await q.getByRole('button',{name:/Skip interaction/}).click();await q.screenshot({path:out+'/rebuild-mobile-offer.jpg',quality:65});}sizes.push({width,...metrics});await mobile.close();}
assert.deepEqual(errors,[]);console.log(JSON.stringify({pass:true,sizes,errors},null,2));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});

const {chromium}=require('playwright');
const AxeBuilder=require('@axe-core/playwright').default;
const assert=require('node:assert/strict');
const fs=require('node:fs');
const url=process.env.PREVIEW_URL || 'http://127.0.0.1:3001';
const key='strike-circuit-v2';
fs.mkdirSync('test-results',{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'msedge',headless:true});
 const errors=[],results=[];
 try {
  for(const width of [1440,768,390,320]){
   const c=await browser.newContext({viewport:{width,height:900},hasTouch:width<1024,isMobile:width<768,reducedMotion:width<1024?'reduce':'no-preference',permissions:['clipboard-read','clipboard-write']});
   const p=await c.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));
   await p.goto(url,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1100);
   assert.match(await p.locator('h1').innerText(),/Future With Strike/);
   assert(await p.locator('.join-button').evaluate(e=>e.getBoundingClientRect().bottom<innerHeight));
   await p.screenshot({path:'test-results/final-'+width+'.jpg',quality:75});
   if(width<900){await p.getByRole('button',{name:'Open menu',exact:true}).click();await p.getByRole('link',{name:'Courses',exact:true}).click();assert.equal(await p.getByRole('button',{name:'Open menu',exact:true}).getAttribute('aria-expanded'),'false');}
   await p.getByRole('button',{name:'Select Meta',exact:true}).click();assert.match(await p.locator('.company-selection').innerText(),/Meta/);
   await p.locator('.company-explorer').screenshot({path:'test-results/company-'+width+'.jpg'});
   await p.locator('summary').first().click();assert.equal(await p.locator('details').first().getAttribute('open'),'');
   await p.getByRole('button',{name:'Run Code',exact:false}).click();assert.match(await p.locator('.terminal').innerText(),/ready to build/);
   for(const name of ['Learn','Build','Unlock']) await p.getByRole('button',{name:name+', connect next node',exact:true}).click();
   const expires=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).expires,key);
   await p.getByRole('button',{name:'Copy code',exact:true}).click();assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),'THUNDER20');
   for(const [years,total] of [[2,'9,199'],[3,'11,039'],[4,'11,499']]){
    await p.getByRole('group',{name:'Strike Plus duration'}).getByRole('button',{name:years+' Years',exact:false}).click();
    await p.getByRole('button',{name:/Use offer/}).click();
    assert.match(await p.locator('.checkout-total').innerText(),new RegExp(total));
    const a=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    assert.deepEqual(a.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],'Checkout axe '+width);
    await p.keyboard.press('Tab');assert(await p.evaluate(()=>!!document.activeElement.closest('dialog')));
    await p.keyboard.press('Escape');assert.equal(await p.locator('dialog').isVisible(),false);
   }
   await p.reload({waitUntil:'networkidle'});assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).expires,key),expires);
   await p.getByRole('button',{name:'Dismiss offer',exact:true}).click();await p.reload({waitUntil:'networkidle'});
   await p.getByRole('button',{name:/Reopen offer/}).click();assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).expires,key),expires);
   await p.locator('.circuit-panel').screenshot({path:'test-results/offer-'+width+'.jpg'});
   await p.getByRole('button',{name:'Get Strike Ultra',exact:false}).click();assert.equal(await p.locator('.discount-line').count(),0);await p.keyboard.press('Escape');
   if(width===1440){
    const q=await c.newPage();await q.goto(url);await q.evaluate(k=>localStorage.setItem(k,JSON.stringify({expires:Date.now()+1600,dismissed:false,applied:true})),key);
    await p.waitForTimeout(2000);assert(await p.getByRole('button',{name:'Offer expired',exact:true}).isDisabled());
    assert(await p.getByRole('button',{name:'Copy code',exact:true}).isDisabled());
    await p.getByRole('button',{name:'Get Strike Plus',exact:false}).click();assert.equal(await p.locator('.discount-line').count(),0);await p.keyboard.press('Escape');await q.close();
   }
   await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=650){scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}});
   await p.waitForTimeout(1200);
   const metrics=await p.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));
   assert(metrics.scroll<=metrics.viewport+1,JSON.stringify(metrics));assert.deepEqual(metrics.broken,[]);
   const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   assert.deepEqual(axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target),details:v.nodes.map(n=>n.failureSummary)})),[],'Page axe '+width);
   results.push({width,...metrics,axeViolations:axe.violations.length});console.log('PASS',width);await c.close();
  }
  const c=await browser.newContext({javaScriptEnabled:false});const p=await c.newPage();await p.goto(url);
  assert(await p.locator('h1').isVisible());assert.equal(await p.locator('.course-card').count(),5);assert.equal(await p.locator('.plan-card').count(),2);await c.close();
  const bad=await browser.newContext();const p2=await bad.newPage();await p2.goto(url);await p2.evaluate(k=>localStorage.setItem(k,JSON.stringify({expires:-1})),key);await p2.reload();await p2.waitForTimeout(300);assert(await p2.getByRole('button',{name:'Offer expired',exact:true}).isDisabled());await bad.close();
  assert.deepEqual(errors,[]);
  fs.writeFileSync('test-results/verification.json',JSON.stringify({pass:true,results,errors,noJavaScript:true,persistence:true,expiry:true,crossTab:true,discountDurations:true},null,2));
  console.log('PASS: final functional, responsive, accessibility, keyboard, expiry, no-JS and image checks');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

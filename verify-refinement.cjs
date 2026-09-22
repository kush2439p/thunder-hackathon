const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
fs.mkdirSync('test-results', {recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:3001/',{waitUntil:'networkidle'});
  await page.waitForTimeout(1300);
  assert.equal(await page.locator('canvas').count(),0);
  await page.screenshot({path:'test-results/chrome-hero.jpg',quality:70});
  for(const selector of ['.hero h1','.nav-links','#plans h2','#courses h3','.about-intro h2','#mentors h3','#faq summary','.footer-display']){
   const group=page.locator(selector).first();
   await group.scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
   const char=group.locator('.kinetic-char').first();assert(await char.count());
   await char.hover();await page.waitForTimeout(140);
   assert.notEqual(await char.evaluate(e=>getComputedStyle(e).transform),'none',selector);
  }
  await page.locator('.editor').scrollIntoViewIfNeeded();
  await page.getByRole('button',{name:'Replay typing',exact:true}).click();
  const hidden=await page.locator('.code-glyph').evaluateAll(nodes=>nodes.filter(n=>Number(getComputedStyle(n).opacity)<.2).length);
  assert(hidden>30,'typing must progressively reveal characters');
  await page.getByRole('button',{name:'Show full code',exact:true}).click();
  assert(await page.locator('.code-glyph').evaluateAll(nodes=>nodes.every(n=>Number(getComputedStyle(n).opacity)===1)));
  await page.getByRole('button',{name:'Run Code'}).click();
  assert.match(await page.locator('.terminal').innerText(),/ready to build/);
  await page.screenshot({path:'test-results/typing-editor.jpg',quality:70});
  await page.locator('#reviews').scrollIntoViewIfNeeded();await page.waitForTimeout(1800);
  await page.getByRole('button',{name:'Next reviews'}).click();await page.waitForTimeout(3300);
  assert.match(await page.locator('.review-featured').innerText(),/Gopal Kumar Jha/);
  assert.equal(await page.getByRole('button',{name:'Play reviews'}).getAttribute('aria-pressed'),'true');
  await page.screenshot({path:'test-results/typed-review.jpg',quality:70});
  await page.locator('.footer').scrollIntoViewIfNeeded();await page.waitForTimeout(1100);
  await page.screenshot({path:'test-results/dotted-footer.jpg',quality:70});
  await page.getByRole('link',{name:'About',exact:true}).focus();await page.keyboard.press('Enter');await page.waitForTimeout(1200);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'about');
  assert.deepEqual(errors,[]);
  for(const width of [768,390,320]){
    const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce',hasTouch:true,isMobile:width<768});
    const mobile=await context.newPage();mobile.on('pageerror',e=>errors.push(e.message));
    await mobile.goto('http://localhost:3001/',{waitUntil:'networkidle'});
    await mobile.screenshot({path:`test-results/chrome-${width}.jpg`,quality:70});
    const metrics=await mobile.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,buttons:[...document.querySelectorAll('.chrome-action')].map(e=>e.getBoundingClientRect().bottom)}));
    assert(metrics.scroll<=metrics.width+1,JSON.stringify(metrics));assert(metrics.buttons.every(y=>y<844),JSON.stringify(metrics));
    await context.close();
  }
  assert.deepEqual(errors,[]);console.log('PASS: whole-site letters, code typing, review controls, anchor focus, responsive hero; no browser errors');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});

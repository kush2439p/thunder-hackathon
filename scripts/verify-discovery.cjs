const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
 const browser = await chromium.launch({ channel: "chrome", headless: true });
 const results = [], errors = [];
 try {
  for (const width of [1440, 768, 390, 320]) {
   const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 1024, reducedMotion: width < 1024 ? "reduce" : "no-preference", permissions: ["clipboard-read", "clipboard-write"] });
   const page = await context.newPage();
   page.on("pageerror", error => errors.push(error.message));
   await page.goto("http://127.0.0.1:3002", { waitUntil: "networkidle" });
   await page.waitForSelector(".reward-dialog[open]");
   assert.equal(await page.evaluate(() => localStorage.getItem("strike-circuit-v2")), null, "Timer must not begin before unlock");
   await page.getByRole("button", { name: "Break the seal", exact: true }).click();
   await page.waitForSelector(".reward-paper[data-unlocked=true]");
   const expires = await page.evaluate(() => JSON.parse(localStorage.getItem("strike-circuit-v2")).expires);
   assert(expires > Date.now() + 35 * 3600000);
   await page.getByRole("button", { name: "Copy code", exact: true }).first().click();
   assert.equal(await page.evaluate(() => navigator.clipboard.readText()), "THUNDER20");
   const rewardAxe = await new AxeBuilder({ page }).include(".reward-dialog").analyze();
   await page.locator(".reward-dialog").screenshot({ path: "test-results/reward-unlocked-" + width + ".png" });
   await page.getByRole("button", { name: "Use my 20% reward", exact: true }).click();
   await page.waitForSelector(".checkout-dialog[open]");
   assert.match(await page.locator(".checkout-dialog").innerText(), /THUNDER20/);
   await page.keyboard.press("Escape");
   assert.equal(await page.locator(".checkout-dialog[open]").count(), 0);
   await page.reload({ waitUntil: "networkidle" });
   await page.waitForTimeout(1500);
   assert.equal(await page.locator(".reward-dialog[open]").count(), 0, "Welcome must not repeat");
   assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("strike-circuit-v2")).expires), expires);
   await page.getByRole("button", { name: "Dismiss reward reminder" }).click();
   await page.reload({ waitUntil: "networkidle" });
   await page.getByRole("button", { name: "Reopen reward", exact: true }).click();
   await page.waitForSelector(".reward-dialog[open]");
   await page.keyboard.press("Escape");
   await page.locator(".course-deck").scrollIntoViewIfNeeded();
   await page.waitForTimeout(1000);
   assert.equal(await page.locator(".course-tile").count(), 5);
   const button = page.getByRole("button", { name: "Preview Thunder · 100 Days of Code", exact: true });
   await button.focus();
   if (width === 1440) {
    await page.waitForTimeout(700);
    assert.equal(await page.locator(".course-discovery").first().evaluate(e => getComputedStyle(e).opacity), "1");
   }
   await button.click();
   await page.waitForSelector(".course-preview[open]");
   await page.waitForTimeout(650);
   assert.match(await page.locator("#course-preview-title").innerText(), /Web Development/);
   const courseAxe = await new AxeBuilder({ page }).include(".course-preview").analyze();
   await page.locator(".course-preview").screenshot({ path: "test-results/course-preview-" + width + ".png" });
   await page.keyboard.press("Escape");
   assert.equal(await button.evaluate(e => document.activeElement === e), true);
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Horizontal overflow at " + width);
   assert.equal(await page.locator("img").evaluateAll(xs => xs.filter(x => x.complete && !x.naturalWidth).length), 0);
   const deckAxe = await new AxeBuilder({ page }).include(".course-deck").analyze();
   await page.locator(".course-deck").screenshot({ path: "test-results/course-deck-" + width + ".png" });
   // Simulate the deadline passing while another tab is open.
   const other = await context.newPage();
   await other.goto("http://127.0.0.1:3002", { waitUntil: "networkidle" });
   await other.evaluate(() => { const value = JSON.parse(localStorage.getItem("strike-circuit-v2")); value.expires = Date.now() - 1; value.dismissed = false; localStorage.setItem("strike-circuit-v2", JSON.stringify(value)); });
   await page.waitForTimeout(1200);
   await page.locator(".reward-dock-open").click();
   assert(await page.locator(".reward-dialog .reward-primary").isDisabled());
   assert(await page.locator(".reward-voucher button").isDisabled());
   assert.equal(await page.locator(".reward-voucher time").innerText(), "00:00:00");
   await page.keyboard.press("Escape");
   await page.reload({ waitUntil: "networkidle" });
   assert(await page.evaluate(() => JSON.parse(localStorage.getItem("strike-circuit-v2")).expires < Date.now()));
   const violations = [...rewardAxe.violations, ...courseAxe.violations, ...deckAxe.violations].map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) }));
   results.push({ width, passed: true, violations });
   console.log(JSON.stringify(results.at(-1)));
   await context.close();
  }
  assert.equal(errors.length, 0, errors.join("\n"));
  fs.writeFileSync("test-results/discovery-verification.json", JSON.stringify({ results, errors }, null, 2));
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });


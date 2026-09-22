# STRIKE: Your next connection

A static, frontend-only STRIKE homepage recreation for Thunder Hackathon 6.0.

## Live preview

[Open the public preview](https://kush2439p.github.io/thunder-hackathon/)

## Run

Requires Node.js 20.9+ and pnpm.

```sh
pnpm install
pnpm dev
# Production static preview:
pnpm build
pnpm start
```

Development defaults to port 3000. Static preview: http://localhost:3001.
Deploy the contents of `out/` to a static host. For Vercel, choose Next.js and use the repository root. No API keys, database, server actions, or payment integration are needed. The current local production preview runs on port 3002 with PORT=3002.

## Idea and user flow

The offer is a connection to discover, not a sale banner.

1. A first-time visitor discovers a sealed envelope. Breaking the seal animates the letter out and reveals a 20% Strike Plus reward.
2. The 36-hour countdown begins at unlock. Earlier saved deadlines are preserved; the envelope, reminder and membership share one offer state.
3. Copy THUNDER20 or use the reward to open the checkout preview with the discount applied.
4. Dismiss/reopen retains the deadline. Expiry disables copying and applying the offer and removes the checkout discount.
5. The existing Learn, Build, Unlock circuit is an alternate path to the same reward.
6. Course cards lift on hover/focus, slide their details into view, and open into an animated Quick look dialog. Touch layouts show details directly. Official course links remain available.

The accessible skip action avoids requiring a game to see pricing. The offer is explicitly a hackathon demonstration, not a valid promotion on strikes.in. Checkout takes no payment.

## Requirements checklist

- Complete homepage section sequence: interactive hero/editor, membership, courses, benefits, About story, FAANG questions, mentors, reviews, FAQ and footer.
- Local, optimized original course and mentor images.
- Clear discount, applicable plan and coupon.
- 36-hour countdown begins on first reveal.
- Absolute expiry timestamp persists across refreshes in the same browser.
- Dismissal and applied status persist; other tabs synchronize through storage events.
- Invalid finite timestamps fail closed. Unavailable storage is reported to the user.
- Expired coupons cannot be copied/applied. Every action rechecks the current time.
- Desktop, tablet and mobile layouts; visible keyboard focus; native dialog focus containment and Escape.
- Reduced-motion support, no scroll hijacking, readable server-rendered content without JavaScript.
- GSAP text feedback, entrance reveals, anchor scrolling, depth motion and scrolling About cards; anime.js connection feedback and progress reveal; Motion spring card tilt and cursor ring.
- STRIKE-style centered hero with a single Join Us action. No third-party 3D scene or video is loaded.
- React-owned word/glyph wrappers provide letter feedback throughout the site without changing text wrapping or accessible names.
- Code types on entry with replay/finish controls. Reviews type and slide right with pause, manual selection, hover/focus pause and reduced-motion support.

## Technical decisions

Next.js App Router + strict TypeScript, static export. Homepage content is server rendered, with client components for interactions only. Content lives in `app/content.ts`. The membership state machine is in `app/membership.tsx`. `app/experience.tsx` holds navigation, card physics and demo controls; `app/typed-code.tsx` and `app/reviews-motion.tsx` own typing/review playback. `app/kinetic-text.tsx` keeps words intact and exposes one accessible copy; two delegated pointer listeners animate letters across the site. Each library owns separate DOM properties. Pointer motion uses Motion values, not React state. The native cursor stays visible beneath a spring-following outline. Effects clean up, and typing does not run under reduced motion.

The one-worker build setting mitigates a Windows build-memory failure observed on this machine. Images are optimized WebP files before export, so no image optimization server is required.

## Design read

A STRIKE-content recreation for engineering learners, with a black/silver foundation and a mint accent shared across sections. DESIGN_VARIANCE 4, MOTION_INTENSITY 7, VISUAL_DENSITY 4. The latest supplied Lumina screenshot informs the centered live chrome typography and circular actions; the EngineTech prompt informs the dotted footer, not its company copy. Sora supplies readable geometric headings/UI, Audiowide retains the STRIKE wordmark, and DM Mono handles code/timers. Native wheel/touch scrolling remains intact. GSAP smooths internal anchor navigation, brings the editor forward on entry and reveals the About stack. Letter feedback extends across navigation, headings, body, plans, FAQ and footer. Touch layouts do not depend on hover.

This is an intentional visual departure, **not a pixel-accurate replica**. The hackathon explicitly scores homepage accuracy and STRIKE design matching; see `REQUIREMENTS-AUDIT.md` for the requirement mapping and remaining submission work.

## Assets and attribution

Course, membership and mentor images originate on https://strikes.in and were copied with the user's authorization for this hackathon recreation. Brand/course copy and review excerpts also come from that homepage, inspected September 21, 2026. They remain the property of their owners.

- Course/mentor source: https://dolia18uq98lp.cloudfront.net/
- Membership artwork: https://res.cloudinary.com/dru7bietp/
- Company logos: the Wikimedia URLs used by STRIKE.
- Self-hosted Google Fonts: Sora, Audiowide, DM Mono. The earlier Manrope asset remains available locally.
- MotionSites public previews informed restrained scroll pacing: https://motionsites.org/prompts/scroll-landing and https://motionsites.org/prompts/art-landing. No locked prompt or third-party template source was copied. Implementation remains handwritten in this app.
- `public/assets/silver-flow.webp`: original background generated with the built-in image tool.
  Prompt: an original black-background silver silk ribbon flowing from upper left to lower right, photographic studio lighting, restrained grain, nearly black center reserved for white headline, no text, logos, UI, stars, planets or colored glow.

## Verification

The September 22 interaction pass passed production build, TypeScript and repository lint. Run `node scripts/verify-discovery.cjs` against the port-3002 preview using installed Chrome. It covers 1440, 768, 390 and 320px widths; unlock timing, clipboard, discounted checkout, refresh, dismissal, cross-tab expiry, keyboard focus restoration, images and overflow. Axe found no violations in the changed course deck, preview dialog or reward dialog. Results are in `test-results/discovery-verification.json`. These results do not constitute a whole-site accessibility or performance score.

Interaction implementation: `app/course-deck.tsx`, `app/discovery.css`, `app/offer-state.ts`, `app/sale-welcome.tsx` and `app/sale-teaser.tsx`. The supplied profile-card, envelope and GSAP Flip examples informed the motion. Native dialog and transform animations implement the course expansion without moving React-owned DOM nodes between parents.

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm start
node verify-rebuild.cjs
node quality-check.cjs
node verify-refinement.cjs
```

Browser tests use Microsoft Edge on Windows. On other systems install Chromium with `pnpm exec playwright install chromium` and omit the channel option. The end-to-end script verifies the three-node flow, clipboard, persistence, dismissal, checkout, live expiry, FAQ, mobile menu, image loads and horizontal overflow at 1440, 768, 390 and 320 pixels.
The refinement test verifies letter feedback across sections, typing replay/finish, review selection, keyboard anchor focus and mobile hero actions. Quality checks run axe WCAG 2 A/AA and 2.1 AA checks at desktop/mobile sizes and check essential content without JavaScript. Automated checks are not a substitute for a complete assistive-technology audit.

## Known limitations

This is not the full STRIKE learning platform. The PDF requests its homepage; course/platform/legal links intentionally lead to the official site. Quiz and Contests require login there. The code preview runs a fixed demonstration, not arbitrary code.
The countdown is client-side and cannot provide tamper-resistant redemption. Clearing site storage starts a new demonstration. Cross-device persistence and real payments need a backend.
The reference site's displayed membership prices differ from its checkout query parameters. This recreation uses its observed displayed prices and does not submit purchases.
The static page remains readable without JavaScript, but coupon, menu and checkout interactions require JavaScript. External pages need internet access.
Individual-letter wrapping increases DOM size. The delegated motion system avoids per-letter event listeners, but real-device performance should still be tested. V4 removed the earlier Spline enhancement from the rendered page.
The public GitHub repository and GitHub Pages preview are published. A narrated demo video remains the final submission asset to record.

## Suggested 90-second demo

- 0-15s: show retained source sections/assets and honestly explain the visual departures.
- 15-30s: run the hero code sample, follow its membership hint.
- 30-50s: connect Learn, Build, Unlock. Explain the reason for the interaction.
- 50-65s: copy coupon, apply it, show the correct selected plan and reduced total.
- 65-80s: refresh and dismiss/reopen to demonstrate persistence; show mobile.
- 80-90s: explain expiry guards, reduced motion and the static architecture.

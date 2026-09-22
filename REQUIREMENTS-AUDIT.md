# Thunder Hackathon 6.0: requirements audit

Rechecked directly against all three pages of ThunderHackathon06.pdf on September 21, 2026. The brief asks for the STRIKE homepage and a creative sale experience, not recreations of every linked learning-platform page.

## Honest overall assessment

The frontend offer implementation addresses the functional requirements. The entry is **not yet a complete submission**, and it is **not a close visual replica**. The requested chrome hero, Sora font, mint accent, added About story and redesigned footer intentionally depart from the original. These choices may improve a subjective design impression, but are a real risk under the PDF's explicit Homepage Accuracy and STRIKE Design Match criteria. They must not be presented as full compliance or a guaranteed winning design.

## Requirement mapping

| PDF requirement | Implementation / evidence | Assessment |
| --- | --- | --- |
| Recreate homepage closely: layout, sections, type, spacing, cards, images, navigation, colors | Real course/mentor assets and homepage section sequence retained. Custom hero/type/color/footer differ. | Partial. Main judging risk. |
| Creative discovery, curiosity, interaction and offer reveal | Code demo points to Membership; Learn, Build and Unlock nodes connect before revealing the coupon. Keyboard-accessible skip also exists. | Implemented. Originality/engagement remain subjective. |
| Natural part of the existing site, not a banner/popup | Circuit is embedded beside the membership decision. Offer is only revealed through an action. Dialog is a checkout preview after explicit use, not an unsolicited sale popup. | Implemented. Visual-match caveat above. |
| Clear discount and applicable plan | 20% off Strike Plus for the selected 2, 3 or 4-year duration. Ultra is never discounted. | Implemented. |
| Coupon code, copy/use | THUNDER20, Clipboard API feedback and explicit discounted checkout preview. | Implemented. Demo only, not a live STRIKE promotion. |
| Remaining timer | 36-hour absolute expiry starts at first reveal. | Implemented. |
| Refresh does not reset timer in the same browser | Versioned localStorage timestamp, dismissal and applied status. | Implemented when browser storage is available. Clearing/denying storage is a stated limitation. |
| Close/dismiss | Dismiss and reopen preserve expiry. | Implemented. |
| Expired and no longer redeemable | Copy/use disabled; every action checks time; checkout removes discount after expiry. | Implemented in this frontend demo. Not secure against a manipulated client clock/storage. |
| Desktop and mobile | Responsive layouts, touch menu, visible keyboard focus, reduced-motion variants. | Verify with regression scripts at 1440/768/390/320px. |
| Smooth, efficient interactions | GSAP owns letters/scroll, anime.js connection feedback, Motion card tilt/cursor. No wheel interception, no pointer-driven React state. V4 removes external Spline from the live page. | Browser/Lighthouse checks required; no claim of universal device performance. |
| Maintainable code and explanation | Typed content, isolated interaction components, static export and README. | Implemented. |

## Submission deliverables

| Deliverable | Status |
| --- | --- |
| Working website | Local static preview at http://localhost:3001. Public reviewable URL not published. |
| Public GitHub repository, full source and commit history | Not created/published for this isolated app. |
| README: setup, idea, flow, checklist, technical approach, limitations | Present and maintained. |
| Demo video explaining idea, rationale, discovery, interaction and engagement | Not recorded/published. A suggested walkthrough is in README. |
| Deadline | Saturday, September 26, 2026, per supplied brief. |

## Scope and attribution

Course/platform/legal links intentionally open official STRIKE pages. Payments, authentication, actual enrollment and backend redemption are not implemented or claimed. Third-party MotionSites public previews inform pacing only; locked prompts were not accessed or copied. The user's supplied Lumina screenshot and EngineTech footer prompt inform visual treatment, never the site identity, company claims or links. No unrelated personal document is included in source, assets or content.

## Checks

Run `node verify-rebuild.cjs` for coupon/expiry/persistence/mobile behavior; `node verify-refinement.cjs` for whole-site text, typing/reviews and hero; `node quality-check.cjs` for axe and no-JavaScript content. Run lint, typecheck and production export before submission. Automated accessibility results do not establish complete WCAG conformance.

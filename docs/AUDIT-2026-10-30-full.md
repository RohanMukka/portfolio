# Audit #4: full, measured

Branch `rohan/hero-redesign-wip` at `73c468b` (identical to
`origin/rohan/hero-redesign-wip`), audited 2026-10-30. The live site
(`main`, `a860d17`) is measured alongside it for comparison only.

This replaces the read-only pass in `AUDIT-2026-10-30.md`. That one was
written from the code and five READMEs in about five minutes; this one ran
the page. Where they disagree, this one is right, and the first file has
been corrected.

## How it was measured

| What | How |
|:-|:-|
| Build | `vite build`; chunk contents from a sourcemap build broken down by package |
| Budgets | `npm run perf` (bundle sizes, at-rest draw calls/frames/layouts, wake latency, axe) |
| Lighthouse 12.8.2 | Mobile (default throttling) and desktop presets, against `vite preview` of the build and against the live site |
| Walk | puppeteer-core + system Chrome on the real GPU, 1440×900 and 390×844 (DPR 2, touch); screenshot of every section at 10/45/80% of its height; headings, landmarks, links, first 8 Tab stops, console errors, when scroll unlocks |
| Links | Every external URL in `src/` and `index.html`, fetched with a browser user agent, 25 s timeout (90 s retry for the EduLens demo) |
| Live | Response headers of the page and a hashed asset; grep of the live bundle |
| Claims | All 19 project READMEs on GitHub (plus IPMS's org repo) read against `projects.ts` and `caseStudies.ts` |

Not measured: real phones, Safari, Firefox, screen readers, and anything that
needs the Vercel functions (`/api/*` 404 under `vite preview`, so the counter
and Monkeytype errors in the local runs are partly an artifact; the
github-readme-stats 503 is not).

## Scorecard

| Axis | Score | Evidence |
|:-|:-|:-|
| Positioning | **44** | Hero says "Software engineer" and "full-stack products and ML systems". Target role is AI/ML engineer. Footer, title and OG all repeat "Software engineer". |
| Technical depth | **66** | Seven strong case studies, but two project descriptions are false (SafeFlow, JAI), two more are wrong (Spend Smart, FeeAutomation), and two headline numbers are README estimates presented as results. |
| Visual craft | **82** | Screens below. The 3D work is top tier. Weak: footer template, floating buttons over the footer wordmark, the particle name reads blurry on a phone. |
| Interactivity | **63** | Particles, drag, dive, X-Ray. Nothing lets a visitor test the projects themselves. |
| Conversion | **52** | Contact is good (visible email, copy, LinkedIn, GitHub) but sits 18,413 px down on desktop. From the hero only Resume is one click. Scroll is locked for the intro. |
| Production | **55** | What visitors actually get is `main`: 41 commits behind, Lighthouse mobile 67/90/75/100, and it still ships a Monkeytype API key. No cache or security headers on Vercel. |
| **Overall** | **60** | |

## Measurements

### Lighthouse (mobile, simulated slow 4G, 4× CPU)

| | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|:-|:-|:-|:-|:-|:-|:-|:-|:-|
| Branch (local build) | **73** | **100** | **96** | **100** | 1.7 s | 4.8 s | 270 ms | 0.01 |
| Live site (`main`) | 67 | 90 | 75 | 100 | 2.3 s | 10.8 s | 130 ms | 0.001 |
| Branch, desktop preset | 93 | 100 | 96 | 100 | 0.4 s | 1.2 s | 20 ms | 0.077 |

The branch's lost points, in order of weight:

- **LCP 4.8 s.** The LCP element is the hero `<h1>`'s span, which waits on
  the 163 KB main script. Main thread 2.5 s; `index` script 1.23 s of it,
  the 3D `scene` script 0.9 s.
- **TBT 270 ms**, max potential FID 240 ms: the scene's shader and geometry
  setup.
- **Unused JS 103 KiB** (38% of `index`, 32% of `scene` at load).
- **Console errors** (Best practices −4): `github-readme-stats.vercel.app`
  answered **503** in every run, plus the `/api/*` errors (local artifact).
- **Third parties on every load**: `github-readme-stats.vercel.app`,
  `leetcard.jacoblin.cool`, `github-contributions-api.jogruber.de`, all for
  footer hover cards nobody has opened yet. Unsized and offscreen images.
- **DOM 1,617 nodes** (flag at 1,400): Skills' per-word spans and the footer.

### Bundles (gzip)

| Chunk | Size | Budget | Largest contents (source size) |
|:-|:-|:-|:-|
| `index` | 162.8 KB | 170 | react-dom 533 KB, motion-dom 340 KB + framer-motion 172 KB, app sections 103 KB, date-fns 34 KB, lenis 32 KB, react-activity-calendar 21 KB |
| `scene` (lazy) | 136.0 KB | 140 | three 1.96 MB source, stage 82 KB |
| `Tooltip` (lazy) | 17.4 KB | | @floating-ui 290 KB source: only for the footer's GitHub calendar tooltips |
| CSS | 12.9 KB | 14 | |
| `XRay` (lazy) | 3.3 KB | | |

`simple-icons` is tree-shaken correctly (only three paths ship). The levers
are framer-motion (`LazyMotion` + `m`), and the GitHub calendar with its
date-fns and floating-ui, which exist only for the footer.

### Budgets (`npm run perf`)

All 14 pass: sizes under budget, the stage asleep with 0 draw calls, 0
animation frames and 0 layouts at rest (footer and open case study), a
wheel wakes it in 13 ms, axe finds no WCAG violations.

### Walk

| | Desktop 1440×900 | Phone 390×844 |
|:-|:-|:-|
| Scroll unlocked after load | 3.3 s | 3.1 s |
| Page height | 20,596 px (23 screens) | 17,551 px (21 screens) |
| About (`#architecture`) | 5,004 px | 2,466 px |
| Work (`#projects`) | 7,562 px | 6,363 px |
| Contact starts at | 18,413 px | 14,668 px |
| Horizontal scroll | none | none |
| First Tab stops | View work, Get in touch, Resume, Measure this page, Devpost, Read the case study for NexusRAG, Code, 01 NexusRAG | |

No skip link. Landmarks: `nav`, `main`, two `footer`s, section `header`s, a
labelled `group` for the tour. All images have `alt`.

### Links

All 18 project repos, GitHub profile, LinkedIn, Devpost, FitPrep demo,
Spend Smart demo and the live site answer 200. LeetCode answers 403 to
scripts (normal; it works in a browser). **EduLens demo timed out at 25 s on
the first request** (Render free tier cold start) and answered in 0.2 s
after. **github-readme-stats: 503.** SafeFlow's Cloud Run frontend (linked
from its README, not the site): 404.

### Live headers

- Hashed assets (`/assets/index-*.js`) are served `Cache-Control: public,
  max-age=0, must-revalidate`: every repeat visit revalidates every chunk.
  There is no `vercel.json`.
- HSTS is on (Vercel default). No `Content-Security-Policy`,
  `X-Content-Type-Options`, `Referrer-Policy` or `Permissions-Policy`.
- No `sitemap.xml` (404). Case studies live at `#/work/<slug>`, which
  crawlers and link previews never see.

## Findings

Severity: **P0** wrong or unsafe today; **P1** costs interviews; **P2** costs
polish or points; **P3** cleanup.

### P0

1. **The live site still ships the Monkeytype ApeKey.** Today's live bundle
   `index-mqHxCyHs.js` contains `ApeKey Njli…` (rest withheld here). The
   branch fixed this on 2026-10-16 by moving it to `api/monkeytype.ts`, but
   `main` was never merged, and the key is in public `main` history anyway.
   **Rotate it in Monkeytype now**; merging doesn't un-leak it. (I can't see
   whether it was already rotated; if it was, this is P3.)
2. **What recruiters see is a month old.** `main` is 41 commits behind the
   branch. Every fix in audits #1 to #3 (a11y 90 → 100, best practices
   75 → 96, LCP 10.8 → 4.8 s) is invisible until the owner approves a merge.
3. **Two project descriptions are false, two are wrong** (full ledger below):
   SafeFlow, JAI, Spend Smart, FeeAutomation.
4. **Which email is real?** The site's contact and form use
   `rohanmukka07@gmail.com`; the résumé uses `rohan.mukka-1@ou.edu`;
   commits use `rohanmukka09@gmail.com`. A university address may stop
   working after graduation (May 2026). One monitored address everywhere.
5. **The newsletter collects emails for a newsletter that doesn't exist**
   (`Footer.tsx`, posts to formsubmit.co as "New Newsletter Subscriber!").
   That's a promise to visitors that isn't kept. Remove it.

### P1

6. **Positioning.** Hero top row "Software engineer", headline "full-stack
   products and ML systems", footer "Software engineer", `<title>` and OG
   "Software Engineer". Fix with the copy in `AUDIT-2026-10-30.md` §2.1
   (option A recommended).
7. **The recruiter path is 18,000 px long.** From the hero, only Resume is
   one click. GitHub, LinkedIn and the email are at Contact (18,413 px down
   on desktop, past a pinned About and a pinned tour) or behind hover cards
   in the footer. Add GitHub, LinkedIn and Email (copy) to the hero's link
   row and the navbar; add the command palette.
8. **Scroll is locked for the intro**: 3.3 s on a fast desktop with a GPU,
   about 14 s on slow 3G phones (October measurement). Let the page scroll
   once the boot frame is up; the intro can finish under it.
9. **Mobile LCP 4.8 s, TBT 270 ms.** Prerender the hero's text into
   `index.html` (the boot frame already does this for the brand line), move
   framer-motion to `LazyMotion`, and lazy-load the footer's GitHub
   calendar (it alone brings date-fns and floating-ui).
10. **Footer third parties.** Three origins loaded on every visit for hover
    cards; one of them (github-readme-stats) is down. Cut the stats cards,
    Monkeytype and the counter (or show the counter in X-Ray only).
11. **No caching on hashed assets, no security headers.** Add `vercel.json`:
    `/assets/(.*)` and `/fonts/(.*)` → `public, max-age=31536000,
    immutable`; site-wide `X-Content-Type-Options: nosniff`,
    `Referrer-Policy: strict-origin-when-cross-origin`,
    `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and a
    CSP that allows self, Upstash via the API only, formsubmit.co
    (`connect-src`), and `data:`/`blob:` for the WebGL textures.
12. **Numbers presented as results that the READMEs call estimates.**
    NexusRAG's "15 to 20% better recall" is the README's design rationale
    ("improves recall by ~15-20%"), not a reported evaluation.
    MLFlowForge's metrics table is titled "Expected performance" with `~`
    values. EduLens's README gives both "< 2.0 seconds" and "3.2 s". A
    principal engineer will open the repo and see this. Run the evaluations
    and publish real tables, or label them "estimate" on the site.
13. **ReviewGuard's best finding isn't on the site.** Under the label-free
    regime, behaviour-only (0.917) beat the fusion model (0.853) on 5 of 5
    folds, and the README explains why (a strong 19-dim signal diluted by
    concatenation). Reporting that your own model lost is the most senior
    sentence in the whole portfolio. Also, 0.805 is a **business-level** AUC
    (predicting which businesses get targeted), not review-level; the site's
    label should say so.
14. **No social card.** No `og:image`, `twitter:card` is `summary`. Links
    shared in Slack, LinkedIn or iMessage show a bare title. And case
    studies at `#/work/…` can't have their own card until they're real
    paths.
15. **The résumé PDF contradicts the site** (still "pursuing" the M.S.,
    blockchain-first summary, BEneFIT/IPMS/Diagnostic as its projects), and
    `public/` ships two different PDFs (`resume.pdf` 119,409 B is
    unreferenced; `Rohan_Mukka_Resume.pdf` 119,792 B is linked).

### P2

16. **Phone hero:** the particle name, with depth of field, reads as a soft
    blur at 390 px (screenshot `phone-0-hero`). The real `<h1>` is hidden
    while the points draw it, so a phone visitor may not be able to read the
    name. Cut depth-of-field blur on the name (or on phones) so the letters
    stay sharp.
17. **Floating buttons cover the footer wordmark's last letter** at the
    bottom of the page on desktop (`desk-13-footer`). Hide them once the
    footer is in view.
18. **Footer social links are icon-only** (LeetCode, GitHub, LinkedIn,
    Devpost, Monkeytype). Recruiters scan text. Use words.
19. **IPMS is a team repo** (`IPMS-Project` org) whose README is only setup
    steps. The résumé says Rohan built modules A.1 to A.3. Say "team
    project; I built …" on the site, or link to the PRs.
20. **Course Builder's README** reads like Google's ADK and A2A sample
    ("course-creation-agent (Distributed)", shared files symlinked into each
    agent). If it started from Google's codelab, say so and name what was
    added; a reviewer who recognises the sample will otherwise discount the
    rest of the page. (Owner to confirm.)
21. **The portfolio repo's README describes the old site** (a draggable
    "System Log" HUD, marquees, glassmorphism). Anyone clicking "Source
    code" in the footer reads about a different site.
22. **Skills and Credentials dilute the role** (MATLAB, PyCharm, Windows,
    Kotlin; six certifications at equal weight). Copy in the first audit
    §2.6 and §2.7.
23. **Contact copy** "my inbox is always open" is filler; the first audit
    §2.8 has a replacement. The Skills sentence and Contact use em dashes;
    if the owner wants that style rule site-wide, two lines change.
24. **`/api/views` and `/api/telemetry` have no rate limit.** Anyone can
    inflate the counter or the telemetry buckets. Low stakes; a per-IP
    token bucket in Upstash (the IP is used, never stored) closes it.

### P3

25. Dead files: `src/sections/Experience.tsx` (placeholders, unused),
    `tailwind.config.cjs` (Tailwind 4 ignores it; names Syne),
    `public/hero-profile.png` (2.3 MB, deployed, referenced only in a
    comment), `public/resume.pdf`, `public/particlesjs-config.json`,
    `leetcode-stats.json`, `metadata.json`.
26. `public/googlea856697c202f95a6.html`: keep only while Search Console
    verification relies on it.
27. No skip link; add "Skip to work" as the first Tab stop.

## Claims ledger (site vs README)

| Project | Site says | README says | Verdict |
|:-|:-|:-|:-|
| NexusRAG | Hybrid dense + BM25 + RRF, streaming, RAGAS, hallucination detection; 15 to 20% recall, < 50 ms, 5 turns | Same features; "~15-20%" and "<50ms" appear as design rationale, streaming is NDJSON | **Holds**, but label 15 to 20% an estimate |
| StreamSense | 5,000+ events/s, 6 partitions, ~40% LZ4, DLQ, failover | Same; "~5k is CPU-bound on synthetic generation" | **Holds**; say "synthetic load" |
| JobForge | 3 × 4 workers, O(log N) retries, 0 locks, XAUTOCLAIM | Same | **Holds** |
| MLFlowForge | 284k rows, AP ≥ 0.70 gate, 3 drift signals | Same; metrics table is "Expected performance" (~0.85 AP XGBoost) | **Holds**; the model scores are estimates |
| Course Builder | 4 agents on Cloud Run over A2A | Orchestrator, researcher, judge, builder, plus a web app; Cloud Run | **Holds**; origin to confirm (P2 #20) |
| EduLens AI | 83.3%, 6 × 4, 3.2 s | 83.3%, 3.2 s, and "< 2.0 seconds" elsewhere | **Holds**; README contradicts itself |
| ReviewGuard | 0.805 / 0.951 / 0.965, GNN control | Same, 0.805 is business-level; fusion lost to behaviour-only | **Holds**; undersold (P1 #13) |
| SafeFlow | "Data flow and safety management… real-time stream control", Web | Five-agent ADK crowd-safety system, SSE, WebSocket, OTel to Phoenix, self-introspection, human approval | **False** |
| JAI | "JavaScript AI integration and neural pattern recognition" | Chrome extension + Next.js dashboard: Gemini résumé tailoring, Overleaf, autofill, Gmail API | **False** |
| Spend Smart | "Personal finance tracker… real-time visualization of spending habits" | "Gamified budgeting simulator": budgets, event cards, monthly rounds, score | **Wrong** |
| FeeAutomation | "Enterprise automation tool for fee processing… transaction auditing" | Academic fee payments: React, Express, MySQL, Stripe, admin dashboard | **Wrong** (inflated) |
| Polarization | "ML pipeline… detect social and political sentiment polarization" | SemEval 2026 Task 9, 22 languages, mBERT/mT5/LoRA/LLM prompting, co-authored | **Undersold**; it's research |
| EEG | "high-resolution EEG signal interpretation" | GAMEEMO, RF + CNN fusion, ~90% | **Undersold**; "high-resolution" unsupported |
| Diagnostic AI | "high-precision diagnostic insights" | OWL/SWRL rules with a decision-tree fallback, 25% over either alone | **Vague**; use the 25% |
| BEneFIT | ETH staking, oracles | Lock-and-release and redistribution models, research folder, team authors | **Holds**; résumé's 35% / 30% claims not in README |
| IPMS | "enterprise-grade tracking" | Setup-only README, team org | **Unsupported** adjective |
| FitPrep | "optimal edge performance" | CRA app, 7-day plans, voice input, Chart.js | **Unsupported** adjective |
| Patient Assistant DB | "connect, manage, and scale" | Java + JDBC + Azure SQL, Person superclass schema, reports | **Holds** loosely |
| Portfolio | "Modern web identity" | README describes the old site | Cut the row; fix the README |

## Section by section

- **Hero** (desktop): the particle name is striking and legible; the line
  under it is generic; the top row's "( Portfolio ©2026 )" is template
  furniture. Phone: name blurry (P2 #16); three links wrap to two rows.
- **About**: five sideways panels pinned over 5,000 px. Copy is good; the
  timeline is real. Panel 4 ("I don't trust a system I can't measure") is
  the site's actual thesis and deserves the hero.
- **Work tour**: captions are clean, one fact each; the right 60% is a
  bloom-heavy node. Tags ("TypeScript, NLP, AI") are generic. Spend Smart
  is a stop with no case study; ReviewGuard is last.
- **More work**: rows for the false and filler descriptions above.
- **Skills**: the painted sentence and the ring stack work; the tool list
  is the résumé's, not the role's.
- **Credentials**: clear; six certifications at equal weight.
- **Contact**: "Let's talk." ring is the best closing moment on the site;
  email with copy, LinkedIn, GitHub and the form below are all good. It's
  just far away.
- **Footer**: newsletter, five icon-only links, three third-party hover
  cards (one down), visitor counter, and a full-width name. Floating
  buttons sit on it.

## What the first audit (#3) got wrong

- It said Contact hides the email behind a form. Contact shows the address
  with a copy button, LinkedIn and GitHub. (Conversion moved 47 → 52.)
- It used `rohanmukka09@gmail.com` in copy; the site uses `…07`. Now P0 #4.
- Hero option E ("0.805, not 0.965") paired two numbers that measure
  different things. Replaced.
- It presented NexusRAG's 15 to 20% and EduLens's 3.2 s as plain results.
  Now labelled.
- It recommended adding things the page already does well (Contact) and
  missed the live key leak, the stale `main`, the cache headers, the
  broken stats card, the newsletter and the Spend Smart / FeeAutomation
  descriptions.

Everything else in #3 (hero options A to D, About, case-study rewrites,
design tokens, palette, widgets) stands, and is the copy to use.

## Plan

### Phase 0: owner, today (no code)

1. Rotate the Monkeytype ApeKey.
2. Pick one public email.
3. Decide when the branch may be merged to `main`; until then the audits
   only improve a site nobody sees.
4. Answer: Course Builder's origin; any role or research since May 2026;
   which hackathons placed (About panel 5).

### Phase 1: truth and reach (one step each, about a day in all)

1. Fix the four false or wrong descriptions and the filler adjectives;
   recategorise SafeFlow (ML) and the research projects.
2. Hero: role, headline, link row with GitHub, LinkedIn, Email copy; title,
   description, OG text.
3. Featured order: ReviewGuard first, SafeFlow in, Spend Smart out; SafeFlow
   case study; ReviewGuard's "fusion lost" decision and business-level
   label.
4. Footer: remove newsletter, Monkeytype (and `api/monkeytype.ts`), stats
   cards, counter; text links.
5. `vercel.json`: immutable caching and security headers.
6. Résumé: one PDF, matching the site (owner edits the LaTeX).

### Phase 2: speed and structure (about three days)

7. Unlock scroll during the intro.
8. Prerender the hero text; `LazyMotion`; lazy footer calendar (or cut it).
   Target: mobile LCP < 2.5 s, TBT < 200 ms, Performance ≥ 90.
9. Case studies on real paths (`/work/<slug>` with a rewrite), `og:image`
   per page via a Vercel function (`@vercel/og`), sitemap, JSON-LD
   `Person`.
10. About copy with dates; Research filter in More work; Skills and
    Credentials trims; delete the dead files.
11. Phone hero sharpness; floating buttons hide over the footer; skip link.
12. Command palette.

### Phase 3: proof (about four days)

13. The proof-of-work widgets from audit #3 §3.6, one at a time, ReviewGuard
    and NexusRAG first.
14. Real evaluation tables in the NexusRAG and MLFlowForge READMEs (run the
    eval scripts that already exist), then put the measured numbers on the
    site. Fix EduLens's README contradiction. Rewrite the portfolio repo's
    README.
15. Lighthouse added to `npm run perf` with floors (mobile Performance 90,
    the rest 100).

### Expected scores

| | Positioning | Depth | Craft | Interactivity | Conversion | Production | Overall |
|:-|:-|:-|:-|:-|:-|:-|:-|
| Now (branch) | 44 | 66 | 82 | 63 | 52 | 55 | 60 |
| Phase 0 + 1 | 78 | 78 | 83 | 63 | 76 | 80 | 76 |
| Phase 2 | 84 | 84 | 88 | 68 | 84 | 90 | 83 |
| Phase 3 | 86 | 92 | 90 | 90 | 88 | 92 | 90 |

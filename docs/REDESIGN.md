# Portfolio redesign: handoff notes

Everything a new chat needs to pick up the 3D redesign where the last one
left off. Keep this file current: update "Where it stands" and the plan
after every step.

## Where it stands

- All redesign work lives on the branch `rohan/hero-redesign-wip`. `main` is
  the live site (https://portfolio-rohan03.vercel.app, deployed by Vercel
  from `main`) and stays untouched until the owner approves a merge.
- The page is one 3D story: a fixed WebGL stage behind every section where
  ~24k particles take a new shape per section (data stream → About timeline
  → project network → Skills layer stack → Credentials crystal → ring around
  Contact's "Let's talk."). Dark theme by default; light theme kept.
- Steps 1 (cinematic lens), 2 (camera flight), 3 (scroll-pinned scenes),
  4 (playable particles), 5 (3D transitions) and 6 (custom cursor) are
  done and approved. Step 7 (real project media) is built and waits for
  the owner's review; the owner will record more projects locally.
- Review fixes (approved): a five-reviewer audit found six critical bugs,
  now fixed. Work's stacked tour captions blocked each
  other's buttons (only the active caption takes the pointer now, the rest
  are `inert`); the Monkeytype ApeKey was in the client bundle (now behind
  `api/monkeytype.ts`, key in the `MONKEYTYPE_APE_KEY` env var; the old key
  must be rotated); tabbing into About scrolled its sticky box sideways for
  good (`overflow: clip`, and focus scrolls the page to the panel); the
  2.25 MB portrait PNG is now a 9 KB 224px WebP and the intro no longer
  waits on it; the particles' shaders compile with `compileAsync` before the
  first frame (the intro waits on `stageReady`) instead of blocking for
  1.2 s; and the case study traps focus, makes the page inert and hands
  focus back on close (it renders in a portal on `<body>`).

- Second audit (2026-10-16): `docs/AUDIT-2026-10-16.md`. The six fixes
  hold on the branch (the live site still ships the Monkeytype key until
  `main` is merged; rotate it). Re-scored 55/100. It proposes steps A–F
  (correctness and a11y debt, a demand-driven render loop, X-Ray mode with
  telemetry, live project stops, safe zones, load path), each waiting on
  the owner's go-ahead.
- **Audit Step A** (correctness and a11y debt) is done and approved by the
  owner (2026-10-29), committed on the branch but not pushed. Each item was
  checked on a production build in headless Chrome:
  - The hero name hand-off waits for a drawn frame (`scene.ts` `handOffName`,
    `firstFrame`); on slow 3G + 4× CPU the name never leaves the screen (it
    used to vanish for ~1.2 s), and the canvas fades in only once it has
    drawn.
  - `src/lib/useModal.ts` (inert outside, Tab wrap, Escape, focus back) runs
    the case study and the phone menu. The menu is now a dialog, carries a
    Resume link, and closes itself if the window grows past phone size.
  - The floating Resume is an `<a download>`: the download starts on the
    click (it waited 3.5 s), keyboards reach it, and it's named. The floating
    buttons are inert until they show, and phones no longer get them (they
    covered the tour's Code button and the email).
  - The More-work preview sits above (or below) its row and never covers it;
    it no longer starts in the top-left corner.
  - Tour captions take input only while mostly showing (no clickable
    7%-opacity buttons); the ticks are named "01 NexusRAG" etc.; dragging
    to spin no longer selects text.
  - The hero line and the Skills sentence reach screen readers as one
    sentence each (`sr-only` copy, animated words `aria-hidden`). The total
    of single-word text leaves went 224 → 152; the rest are words that stand
    alone (tags, nav links, numbers), so the audit's "< 40" target was the
    wrong measure.
  - The case study's diagram packets (SMIL) pause off screen: 60 → ~2
    layouts/s with the diagram out of view.
  - `src/lib/breakpoints.ts`: the stage uses the page's lg breakpoint, so
    768–1023 px puts shapes above the text as on phones. Some overlap is
    left (More work, Credentials) for Step E's safe zones.
  - Skill logos are local SVGs in `public/icons` (from the simple-icons
    package, in brand colours) instead of Wikimedia hotlinks; `robots.txt`
    added; footer icons, the newsletter button and heading levels fixed.
  - axe now reports only colour contrast (dark 63, light 148). That's step
    A′, which waits on the owner's before/after call (brand colours).
  - Still open for later steps: the fake newsletter (Step D).
- **Audit Step B** (a render loop that sleeps) is done and approved by the
  owner (2026-10-29), committed on the branch but not pushed:
  - `src/stage/clock.ts`: the stage draws only while something it shows is
    changing. Once all has settled its drift plays for 3.8 s, slows to a
    stop over about a second, and then nothing runs (no frames, no draw
    calls) until input wakes it within a frame or two. The shapes' own
    motion runs on the clock's time, so it eases out and back in. The store's
    setters (`setFocus`, `setDive`, `setCovered`, …) wake it; scroll, wheel,
    pointer, resize, theme and layout changes do too; an open case study
    stops it.
  - Lenis no longer asks for a frame forever (`lib/smoothScroll.ts` runs its
    loop only during a smooth scroll); the cursor stops re-checking what's
    under it while the stage sleeps.
  - A pause-motion button in the navbar (`lib/motion.ts`, remembered, off by
    default; nothing is gated on `prefers-reduced-motion`). Paused, the
    stage's drift, the hero's scroll cue, the footer's blinking cursors,
    clips and diagram packets hold still; scrolling still moves the camera.
  - `post.ts`: the bloom is UnrealBloomPass's, pass for pass, with the
    full-screen passes folded together: 16 draw calls a frame (was 18) in the
    dark theme, 4 (was 5) in light, two full-screen passes instead of four.
    Compared with the old chain on identical frames, the mean difference is
    0.03–0.24 of 255.
  - On a production build at rest: 0 draw calls, 0 animation frames, 0
    layouts and ~0.2% main thread, at the hero, About, Work, Credentials,
    the footer and with a case study open (it was 1,080 draws/s and ~4% at
    the footer). Scrolling is unchanged (p95 17 ms).
  - `npm run perf` (`scripts/perf/budgets.mjs`) checks bundle sizes, the
    at-rest counts, waking, an open case study and axe against a build;
    `.github/workflows/perf.yml` runs it on every push (software WebGL).
- Separate small fix, approved with Step B: "Let's talk." had its last letter's edge
  clipped and its period hanging low where the page comes to rest
  (`SectionHeader.tsx` lines clip only vertically; `FinalCTA.tsx` finishes
  the letters' rise earlier).
- **Audit Step C** (X-Ray and telemetry) is done and approved by the owner
  (2026-10-30), committed on the branch but not pushed:
  - `src/xray/XRay.tsx`, a lazy 3 KB chunk opened by `?xray`, the X key
    (not in text fields) or "Measure this page" under About's "I don't trust
    a system I can't measure" panel; Escape or × closes it. It shows the
    clock's mode, what woke it, its time scale, % asleep this visit and the
    last minute as a colour strip; CPU and GPU ms per frame (GPU where the
    browser exposes WebGL timer queries, else "not exposed"), draw calls,
    a sparkline; the lens's passes and sizes; GPU memory (point attributes
    plus render targets) and JS heap (Chromium); this visit's LCP, CLS and
    INP (`lib/vitals.ts`, no library); and the last 7 days of visits.
  - The stage writes these into `stageStats` (`stage/store.ts`); the lens
    describes its passes (`describe()` in `post.ts`).
  - Telemetry: `lib/telemetry.ts` sends LCP, CLS, INP, % asleep and the
    render mode once as a visit ends (production only) to
    `api/telemetry.ts`, which only increments per-day bucket counts in the
    same Upstash Redis as `/api/views` (no IP, browser string, cookie or ID;
    days expire after 14); `api/stats.ts` serves 7-day p75s (bucket upper
    edges) to X-Ray. Logic in `api/_telemetry.ts`, unit-tested against an
    in-memory store. It records nothing until the branch is live on Vercel.
  - Not done from the audit's list: the 3D scene overlay (camera path,
    focal plane, pointer radius drawn into the scene).
- **Audit Step E** (legibility) is done and approved by the owner
  (2026-10-30), committed and pushed to the branch:
  - Text safe zones: blocks of text carry `data-stage-safe` (tour captions,
    About's headings and body, the More-work list, the Skills sentence, the
    Credentials column); the stage passes up to 8 on-screen ones to the
    particle shader as rectangles, and points behind them fade to 12%.
    Glow under tour titles fell to 0–0.2% of title pixels under 3:1; on
    tablets the network and crystal fade behind the text.
  - Hero → About: while travelling, depth-of-field blur is held to a quarter
    and points are capped at 12 px (`uTravel`), so the flight is fine points
    rather than a cloud of discs; the hero's copy fades out by a quarter of
    the hero's scroll instead of nearly half.
  - Skills: words paint from the quietest text colour to full colour
    (`color-mix` on a `--paint` variable) instead of from 14% opacity, so
    the sentence is readable before it's painted.
  - axe now finds no WCAG violations in either theme, and the budget check
    no longer tolerates any (`KNOWN_AXE` is empty).
  - Not done from the audit's list: time-based caption swaps in the tour.
- **Audit Step F** (load path) is done and approved by the owner
  (2026-10-30), committed and pushed to the branch:
  - `index.html` draws the intro's first frame itself (`#boot`: the brand
    line at the name's height on the page background, and the loading
    counter), so something shows before the scripts arrive; `HeroIntro`
    fades it out once its own line is in place (within 2–9 px).
  - Fonts are self-hosted (owner approved the download, 2026-10-30): the
    Latin subsets of Inter, Inter Tight, Instrument Serif italic and
    JetBrains Mono from Google Fonts (SIL OFL), one variable WOFF2 per
    family, 147 KB in `public/fonts`, declared at the top of index.css. The
    page no longer contacts Google at all. They aren't preloaded: measured
    on slow 3G, an early font download slowed the main script by ~1 s,
    which delayed the intro (it waits on the script and the 3D chunk).
  - Slow 3G + 4× CPU on a phone: first paint 8.6 → 4.6 s, loading line
    on screen 8.5 → 4.6 s, LCP 13.5 → 12.5–12.8 s, intro opening ~14.5 →
    14.1–14.4 s. The remaining wait is the 161 KB main script and the 3D
    chunk; cutting those (e.g. framer-motion's LazyMotion, prerendering
    the hero) is the next lever.
- **Audit step A′** (contrast) is done: the owner compared before/after and
  chose the new colours (2026-10-30). Light secondary/tertiary text is more
  opaque (#003399d9 / #003399b8), dark tertiary is #718096, orange text on
  paper is #a94d1c (the brand orange stays for lines, dots and fills), and
  white-on-orange buttons are fixed (deeper orange on paper, near-black text
  on the dark orange). axe's contrast failures went from 63 (dark) and 150
  (light) to 46 each, all of them the Skills sentence's not-yet-painted
  words (Step E's paint rework).

## Upgrade plan: one step at a time

The owner wants these done **one at a time**, shown in the local preview
and approved before the next starts.

1. ✅ **Cinematic look**: bloom, particle depth of field, grain, vignette
   (`src/stage/post.ts`).
2. ✅ **Camera flight**: scrolling flies the camera through one
   continuous 3D world, each section a place you travel to (USAvionix-style)
   instead of shapes morphing in place (`src/stage/world.ts`). The swarm
   travels with you and re-forms at each place; faint "ghost" copies of the
   other places' shapes stand in the distance; dust hangs along the path and
   a floor of light points lies below. The owner compared three flight
   speeds and kept the original: the flight spans 0.8 screen heights of
   scroll (`timeline.ts`) and the camera eases at rate 4.5 (`scene.ts`).
3. ✅ **Scroll-pinned scenes**:
   - Work is a guided tour (`src/sections/work/WorkTour.tsx`): the scene
     pins and the camera flies close to each featured project's node in
     turn while a caption beside it changes (number, name, tagline, fact,
     tags, case study and code links). Numbered ticks jump to a stop and
     "Skip to more work" jumps past. The tour and the camera share one
     stretch of scroll (5% → 95%; `placeTour` in `scene.ts`). After it,
     "More work" lists the other 11 projects (09 → 19) with filters. The
     owner once rejected a pinned index of all 19 projects, which is why the
     tour stops only at the 8 featured ones and can be skipped.
   - Skills pins its sentence while it paints, and the 3D stack builds a
     layer as each layer's tool lights up (React → Interfaces, Node.js →
     Services, Docker → Infrastructure, TensorFlow → Models; thresholds set
     in `Skills.tsx`, read by the stage through `stageState.layerAt`).
   - About already pinned and travelled its timeline; unchanged.
4. ✅ **Playable particles**:
   - The hero name is drawn by the particles (`src/stage/name.ts`): each
     word of the page's heading (`data-hero-name`) is redrawn on a canvas
     at its layout position and size, and most of the hero's points take
     positions from the inked pixels (a float texture read in
     `nameShape()`). The heading stays for layout, search and screen
     readers but hides while the points draw it (`html[data-stage-name]`
     in index.css). Lite mode keeps the normal heading. On paper the name
     stays in the blues.
   - Cursor gravity: points near the pointer are pulled in and twisted
     round it; holding the mouse button pulls harder and wider.
   - Work's node tags are buttons (mouse targets): hover lights the node,
     click opens the case study (Spend Smart, without one, opens its code).
   - Dragging the right side of the screen while the network is in view
     spins it (`.stage-drag`, "Drag to spin · Click a node"); a flick
     coasts, then the network drifts back to face the viewer.
5. ✅ **3D transitions**: opening a case study from around
   Work (`canDive()` in `store.ts`) dives the camera straight into that
   project's node (`placeDive` in `scene.ts`) until its glow fills the
   frame; the page then opens out of the middle as a growing circle
   (`CaseStudy.tsx`). Closing shrinks it back into the node and the camera
   pulls out. Shared links and lite mode open without the dive. While a
   case study fully covers the page the stage stops drawing
   (`stageState.covered`).
6. ✅ **Custom cursor** (`src/components/Cursor.tsx`): a dot
   on the pointer and a ring trailing it on a spring. Links grow the ring;
   `data-cursor="…"` turns it into a labelled pill (View / Details / Close
   on Work rows, Open on network nodes, Drag on the spin area);
   `data-cursor-hint="…"` shows a small hint beside it over open space
   (Hold, on the hero, for the particles' stronger pull). Text fields get
   the system caret. Mouse-only; hidden until the first move and when the
   pointer leaves the window (the owner once removed an old cursor that
   sat stranded in the top-left corner). It also looks again under a
   resting pointer, on scroll and once a frame up to five times a second,
   so a pill never outlives what it named (a swaying node tag, a case
   study opening over the page).
7. **Real project media** (built, awaiting review): footage of the
   projects actually running, never mock-ups. A project's `media` in
   `src/data/projects.ts` holds a still (WebP), an optional clip (muted MP4
   loop), the address it was captured at, the date and what it shows (also
   the alt text). Files live in `public/projects/`.
   - Case studies get an **In use** section (`src/sections/work/InUse.tsx`)
     above Architecture: the clip in a screen that lies tilted back like a
     laptop lid and lifts flat as it scrolls up (tied to the case study's
     own scroller), with a bar showing the address, "Recorded <date>" and a
     pause button. It plays only while in view and is capped by viewport
     height so it always fits under the header.
   - Hover previews (`ProjectVisual`) show footage before the diagram; the
     floating card only plays a clip while it is showing. Architecture
     keeps the diagram (`<ProjectVisual architecture />`).
   - What exists (2026-10-16): no featured repo's README has screenshots,
     and the only featured project with a working public demo is EduLens
     AI. Its clip is one real run of the live Evidence Mode demo
     (`#/demo`) on the demo's own built-in weak answer, recorded headlessly
     (Chrome screencast frames, encoded to H.264 by MediaRecorder; 9 s,
     1440×900, 770 KB). FitPrep's still is its existing screenshot as a
     16 KB WebP. The Course Builder and SafeFlow Cloud Run demos are gone
     (404), so their demo links were removed.
   - **Recording more (the owner, locally):** run the project (e.g. `docker
     compose up`), record 6–12 s of it doing its main thing at 16:10
     (1440×900 or larger), muted, under ~3 MB as MP4 (H.264), and save a
     WebP still of the most telling frame. Put both in `public/projects/`
     as `<slug>-demo.mp4` / `<slug>-demo.webp` and add `media` to the
     project in `projects.ts` (`from` = the address shown, e.g.
     `localhost:3000`). A project's case study and hover preview pick it up
     with no other changes. A future chat can also record any public demo
     the same way EduLens was recorded, but must not type into or submit a
     demo's forms without asking.
8. **Ambient sound**: off by default, soft ambient bed and subtle UI clicks.

## How it's built

- `src/stage/scene.ts`: renderer, camera, backdrop (glows + dot grid), dust,
  the scroll timeline, label projection, adaptive quality. Lazy-loaded.
- `src/stage/particles.ts`: the formations, all computed on the GPU from
  per-point seeds; moving between sections blends two formations.
- `src/stage/post.ts`: the lens (bloom, grain, vignette, fringing).
- `src/stage/clock.ts`: when the stage draws (only while something changes;
  then it sleeps). Anything that changes what it shows must wake it: use
  the store's setters, or `wakeStage(reason)`.
- `src/stage/world.ts`: where each chapter's place is, the rest view of
  each, and the camera path between them. Shapes are written in their
  place's own frame (rest view on +z, 10 units away) and carried to it.
- `src/stage/timeline.ts`: sections carry `data-chapter="hero|about|work|
  skills|credentials|contact"`; the stage reads scroll progress from them.
  About's panels carry `data-stop` (timeline stops ride on them); Contact's
  heading carries `data-ring` (the ring follows it).
- `src/stage/Labels.tsx`: HUD tags on Work's nodes and Skills' layers.
  `src/stage/store.ts`: hover focus, intro timing, label events (no three.js).
- Lite mode (`src/lib/rendering.ts`): machines without a graphics card get no
  WebGL; the hero paints the stream as a still SVG (`hero/LiteStream.tsx`).
  `?full` / `?lite` in the URL force a mode for the tab.

## The owner's preferences (keep these)

- **Brand colours are fixed**: royal-blue text in light mode, royal blue /
  slate with orange in dark mode. Never swap them as part of a redesign.
- **Every section gets its own effect and copy**: no reusing another
  section's motion, no restating another section's content (e.g. the name
  shows once, not in a loader and again in the hero).
- **Motion for everyone**: don't gate motion on `prefers-reduced-motion`
  (the owner's own PC reports it).
- **Facts only from the repos, résumé and existing text**; never invent
  numbers or claims.
- The hero's top row shows no location (owner removed "Norman, OK").
- When unsure between designs, build working demos side by side (a
  local-only switcher) and let the owner pick.
- Rejected before: the three.js wireframe globe, a pinned 19-project index,
  name shown in a loader then again in the hero, colour-drop and grid fly-in
  intros, a 2D route map / numbers / big-portrait versions of About, the
  liquid-glass centrepiece.

## Git rules

- Commits authored solely by Rohan Mukka <rohanmukka09@gmail.com>, with no
  Co-Authored-By or Claude trailers (see CLAUDE.md). Check with
  `git log --format='%an <%ae>'` before pushing.
- Commit on `rohan/hero-redesign-wip`; push only when the owner asks; never
  push or merge to `main` until the owner approves. main's one commit the
  branch lacked (a860d17) was merged in on 2026-10-30 keeping the branch's
  files, so merging the branch into `main` is now conflict-free.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in a browser with hardware acceleration
(Chrome on a laptop with a GPU). Useful while developing:

- `?full` forces the 3D on a machine the site would put in lite mode.
- `window.__stageStep(n, simDt)` (dev only) draws n frames by hand, for
  checking the scene when the tab is hidden and the browser has stopped
  animating (`simDt` 0 holds the shapes still; `window.__stageSetTime(t)`
  sets their time, for comparing two renders exactly).
- `window.__stageClock` (dev only) is the clock: its `mode`, `timeScale`
  and what last woke it (`reason`).
- `window.__stageFrame` (dev only) is the stage's eased state;
  `window.__stageState` the shared state (e.g. set `focus` by hand);
  `window.__stageNodes()` Work's nodes projected to the screen.
- `npm run build && npm run perf` checks the performance and accessibility
  budgets (`scripts/perf/budgets.mjs`; CI runs it on every push). It needs
  Chrome (`CHROME_PATH` if it isn't in the usual place) and `SOFTWARE_GL=1`
  on a machine without a graphics card.

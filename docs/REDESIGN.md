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
  4 (playable particles) and 5 (3D transitions) are done and approved.
  Step 6 (custom cursor) is built and waits for the owner's review.
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
6. ✅ **Custom cursor** (awaiting review; `src/components/Cursor.tsx`): a dot
   on the pointer and a ring trailing it on a spring. Links grow the ring;
   `data-cursor="…"` turns it into a labelled pill (View / Details / Close
   on Work rows, Open on network nodes, Drag on the spin area);
   `data-cursor-hint="…"` shows a small hint beside it over open space
   (Hold, on the hero, for the particles' stronger pull). Text fields get
   the system caret. Mouse-only; hidden until the first move and when the
   pointer leaves the window (the owner once removed an old cursor that
   sat stranded in the top-left corner).
7. **Real project media**: screen recordings/screenshots of public demos in
   case studies and hover previews.
8. **Ambient sound**: off by default, soft ambient bed and subtle UI clicks.

## How it's built

- `src/stage/scene.ts`: renderer, camera, backdrop (glows + dot grid), dust,
  the scroll timeline, label projection, adaptive quality. Lazy-loaded.
- `src/stage/particles.ts`: the formations, all computed on the GPU from
  per-point seeds; moving between sections blends two formations.
- `src/stage/post.ts`: the lens (bloom, grain, vignette, fringing).
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
  push or merge to `main` until the owner approves. When it is merged,
  `Hero.tsx` and `about/content.ts` will conflict with main's a860d17: keep
  the branch's versions.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in a browser with hardware acceleration
(Chrome on a laptop with a GPU). Useful while developing:

- `?full` forces the 3D on a machine the site would put in lite mode.
- `window.__stageStep(n)` (dev only) draws n frames by hand, for checking
  the scene when the tab is hidden and the browser has stopped animating.
- `window.__stageFrame` (dev only) is the stage's eased state;
  `window.__stageState` the shared state (e.g. set `focus` by hand);
  `window.__stageNodes()` Work's nodes projected to the screen.

/**
 * Ambient motion engine.
 *
 * The whole site's pointer- and scroll-reactive motion is driven from here:
 * one pointer listener, one scroll listener, both collapsed into a single
 * requestAnimationFrame tick that writes CSS custom properties on <html>.
 *
 * Everything downstream reads those variables from `transform` only, so a
 * frame costs one style write plus a compositor pass -- no React renders, no
 * layout, no per-component listeners.
 *
 *   --px, --py   eased pointer offset from viewport centre, in [-1, 1]
 *   --scroll     window.scrollY in px, as a bare number for calc()
 *   --scrollp    scroll progress through the document, in [0, 1]
 *   --vh         viewport height in px, as a bare number for calc()
 */

const EASE = 0.075;
const SETTLED = 0.0005;

export function startAmbient(): () => void {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = 0;

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const tick = () => {
    frame = 0;

    currentX += (targetX - currentX) * EASE;
    currentY += (targetY - currentY) * EASE;

    root.style.setProperty("--px", currentX.toFixed(4));
    root.style.setProperty("--py", currentY.toFixed(4));
    const scrolled = window.scrollY;
    const range = document.body.scrollHeight - window.innerHeight;
    root.style.setProperty("--scroll", String(Math.round(scrolled)));
    root.style.setProperty(
      "--scrollp",
      range > 0 ? Math.min(scrolled / range, 1).toFixed(4) : "0",
    );

    // Keep easing until the pointer has caught up, then go idle entirely.
    if (
      Math.abs(targetX - currentX) > SETTLED ||
      Math.abs(targetY - currentY) > SETTLED
    ) {
      schedule();
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    targetX = (event.clientX / window.innerWidth) * 2 - 1;
    targetY = (event.clientY / window.innerHeight) * 2 - 1;
    schedule();
  };

  const onScroll = () => schedule();

  const onResize = () => {
    root.style.setProperty("--vh", String(window.innerHeight));
    schedule();
  };

  const applyMode = () => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", onScroll);

    if (reduceMotion.matches) {
      // Park every driver at its neutral value and stay there.
      targetX = targetY = currentX = currentY = 0;
      root.style.setProperty("--px", "0");
      root.style.setProperty("--py", "0");
      root.style.setProperty("--scroll", "0");
      root.style.setProperty("--scrollp", "0");
      return;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    if (!coarsePointer.matches) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    schedule();
  };

  onResize();
  applyMode();

  window.addEventListener("resize", onResize, { passive: true });
  reduceMotion.addEventListener("change", applyMode);
  coarsePointer.addEventListener("change", applyMode);

  return () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    reduceMotion.removeEventListener("change", applyMode);
    coarsePointer.removeEventListener("change", applyMode);
  };
}

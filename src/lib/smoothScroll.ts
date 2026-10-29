import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis: Lenis | null = null;
let kick = () => {};

// Page-wide eased, inertial scrolling. The window still scrolls natively
// underneath, so framer-motion's useScroll and scroll listeners keep working.
// Runs for everyone, including visitors whose OS asks for reduced motion
// (owner's decision; Lenis would otherwise switch itself off for them).
//
// Lenis's own loop (autoRaf) asks for an animation frame forever, even with
// the page at rest; this one runs only while a smooth scroll is under way,
// so a page nobody is touching costs nothing.
export const startSmoothScroll = () => {
  if (lenis) return () => {};

  const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 1, autoRaf: false, respectReducedMotion: false });
  lenis = instance;

  let frame = 0;
  const tick = (time: number) => {
    instance.raf(time);
    frame = instance.isScrolling === "smooth" ? requestAnimationFrame(tick) : 0;
  };
  kick = () => {
    if (frame) return;
    // Lenis eases by the time since its last frame; after a rest that would
    // be one huge step, so its first frame counts as one frame after now.
    instance.time = performance.now() - 1000 / 60;
    frame = requestAnimationFrame(tick);
  };
  // A wheel turn (Lenis has already taken it) starts the loop.
  const offVirtualScroll = instance.on("virtual-scroll", kick);

  // In-page links (#projects, #contact, "#" for top) glide instead of jumping.
  // Lenis honours html { scroll-padding-top }, so sections still clear the navbar.
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href")!;
    const target = hash === "#" ? 0 : document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target === null) return;
    event.preventDefault();
    instance.scrollTo(target);
    kick();
    history.replaceState(null, "", hash === "#" ? location.pathname + location.search : hash);
  };
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    offVirtualScroll();
    cancelAnimationFrame(frame);
    kick = () => {};
    instance.destroy();
    lenis = null;
  };
};

export const scrollToY = (y: number) => {
  if (lenis) {
    lenis.scrollTo(y);
    kick();
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

export const scrollToTop = () => scrollToY(0);

// Freeze the page behind an overlay; the overlay scrolls itself (data-lenis-prevent).
export const setPageScrollPaused = (paused: boolean) => {
  if (paused) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = paused ? "hidden" : "";
};

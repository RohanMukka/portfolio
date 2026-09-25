import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis: Lenis | null = null;

// Page-wide eased, inertial scrolling. The window still scrolls natively
// underneath, so framer-motion's useScroll and scroll listeners keep working.
// Runs for everyone, including visitors whose OS asks for reduced motion
// (owner's decision; Lenis would otherwise switch itself off for them).
export const startSmoothScroll = () => {
  if (lenis) return () => {};

  const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 1, autoRaf: true, respectReducedMotion: false });
  lenis = instance;

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
    history.replaceState(null, "", hash === "#" ? location.pathname + location.search : hash);
  };
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    instance.destroy();
    lenis = null;
  };
};

export const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
};

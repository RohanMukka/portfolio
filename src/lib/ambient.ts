import { useEffect, useRef } from "react";

/**
 * Ambient motion engine.
 *
 * The whole site's pointer- and scroll-reactive motion is driven from here:
 * one pointer listener, one scroll listener, both collapsed into a single
 * requestAnimationFrame tick.
 *
 *   --px, --py   eased pointer offset from viewport centre, in [-1, 1]
 *   --scroll     window.scrollY in px, as a bare number for calc()
 *   --scrollp    scroll progress through the document, in [0, 1]
 *
 * These are written onto the handful of elements that actually consume them,
 * never onto <html>. That distinction matters more than it looks: custom
 * properties inherit, so setting them on the root invalidates the computed
 * style of every element on the page each frame. Measured on this site that was
 * ~3.5s of style recalculation across five seconds of scrolling. Scoped to the
 * four consuming subtrees, the same work is a rounding error.
 *
 * Consumers opt in with useAmbient(), naming only the channels they read. A
 * consumer that only needs scroll progress is not touched when the pointer
 * moves, and no property is rewritten unless its value actually changed --
 * every redundant write would otherwise invalidate that subtree's style.
 */

const EASE = 0.075;
const SETTLED = 0.0005;

type Consumer = HTMLElement | SVGElement;

/** Which ambient channels an element reads. */
export type AmbientChannel = "pointer" | "scroll" | "progress";

interface Registration {
  el: Consumer;
  channels: Set<AmbientChannel>;
  lastPx: string;
  lastPy: string;
  lastScroll: string;
  lastProgress: string;
}

const consumers = new Set<Registration>();

const state = { px: 0, py: 0, scroll: 0, scrollp: 0 };

function writeTo(reg: Registration) {
  const { el, channels } = reg;

  if (channels.has("pointer")) {
    const px = state.px.toFixed(4);
    const py = state.py.toFixed(4);
    if (px !== reg.lastPx) {
      el.style.setProperty("--px", px);
      reg.lastPx = px;
    }
    if (py !== reg.lastPy) {
      el.style.setProperty("--py", py);
      reg.lastPy = py;
    }
  }

  if (channels.has("scroll")) {
    const scroll = String(state.scroll);
    if (scroll !== reg.lastScroll) {
      el.style.setProperty("--scroll", scroll);
      reg.lastScroll = scroll;
    }
  }

  if (channels.has("progress")) {
    const progress = state.scrollp.toFixed(4);
    if (progress !== reg.lastProgress) {
      el.style.setProperty("--scrollp", progress);
      reg.lastProgress = progress;
    }
  }
}

/** Registers an element to receive the ambient channels it names. */
export function registerAmbient(
  el: Consumer | null,
  channels: AmbientChannel[],
): () => void {
  if (!el) return () => {};
  const reg: Registration = {
    el,
    channels: new Set(channels),
    lastPx: "",
    lastPy: "",
    lastScroll: "",
    lastProgress: "",
  };
  consumers.add(reg);
  writeTo(reg);
  return () => {
    consumers.delete(reg);
  };
}

/** Ref to attach to an element that reads the ambient variables in CSS. */
export function useAmbient<T extends Consumer>(...channels: AmbientChannel[]) {
  const ref = useRef<T | null>(null);
  const key = channels.join(",");
  useEffect(() => registerAmbient(ref.current, key.split(",") as AmbientChannel[]), [key]);
  return ref;
}

export function startAmbient(): () => void {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");

  let targetX = 0;
  let targetY = 0;
  let frame = 0;

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const tick = () => {
    frame = 0;

    state.px += (targetX - state.px) * EASE;
    state.py += (targetY - state.py) * EASE;
    state.scroll = Math.round(window.scrollY);

    const range = document.body.scrollHeight - window.innerHeight;
    state.scrollp = range > 0 ? Math.min(window.scrollY / range, 1) : 0;

    for (const reg of consumers) writeTo(reg);

    // Keep easing until the pointer has caught up, then go idle entirely.
    if (
      Math.abs(targetX - state.px) > SETTLED ||
      Math.abs(targetY - state.py) > SETTLED
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

  const applyMode = () => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", onScroll);

    if (reduceMotion.matches) {
      // Park every driver at its neutral value and stay there.
      targetX = targetY = state.px = state.py = 0;
      state.scroll = 0;
      state.scrollp = 0;
      for (const reg of consumers) writeTo(reg);
      return;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    if (!coarsePointer.matches) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    schedule();
  };

  applyMode();
  reduceMotion.addEventListener("change", applyMode);
  coarsePointer.addEventListener("change", applyMode);

  return () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", onScroll);
    reduceMotion.removeEventListener("change", applyMode);
    coarsePointer.removeEventListener("change", applyMode);
  };
}

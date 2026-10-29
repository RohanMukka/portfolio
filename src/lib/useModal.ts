import { useEffect, useRef, type RefObject } from "react";

const TABBABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

// Tab and Shift+Tab wrap around inside the box instead of leaving it.
const trapTab = (e: KeyboardEvent, box: HTMLElement) => {
  const items = Array.from(box.querySelectorAll<HTMLElement>(TABBABLE)).filter((el) => el.getClientRects().length > 0);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  const at = document.activeElement;
  if (!box.contains(at) || (e.shiftKey ? at === first || at === box : at === last)) {
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
  }
};

// Makes everything outside `keep` inert (the siblings of it and of each of
// its ancestors), so neither Tab nor a screen reader reaches the page behind.
// Returns a function that puts it all back; elements that were already
// inert are left alone.
const inertOutside = (keep: HTMLElement) => {
  const changed: HTMLElement[] = [];
  let el = keep;
  while (el !== document.body && el.parentElement) {
    const parent: HTMLElement = el.parentElement;
    for (const sibling of Array.from(parent.children)) {
      if (sibling === el || !(sibling instanceof HTMLElement) || sibling.inert || sibling.tagName === "SCRIPT") continue;
      sibling.inert = true;
      changed.push(sibling);
    }
    el = parent;
  }
  return () => changed.forEach((sibling) => (sibling.inert = false));
};

// While `open`, `box` behaves as a modal dialog: the rest of the page is
// inert, Tab wraps around inside it, Escape calls `onClose`, focus moves in
// (unless it's already inside, e.g. on the button that opened it) and goes
// back to whatever had it when the dialog closes.
export const useModal = (open: boolean, box: RefObject<HTMLElement | null>, onClose: () => void) => {
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const el = box.current;
    if (!open || !el) return;
    const opener = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
    const restore = inertOutside(el);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
      else if (e.key === "Tab") trapTab(e, el);
    };
    window.addEventListener("keydown", onKey);
    if (!el.contains(document.activeElement)) {
      (el.hasAttribute("tabindex") ? el : (el.querySelector<HTMLElement>(TABBABLE) ?? el)).focus();
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      restore();
      opener?.focus({ preventScroll: true });
    };
  }, [open, box]);
};

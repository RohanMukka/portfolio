import React, { useRef } from "react";
import { useReducedMotion } from "../lib/useReducedMotion";

interface MagneticButtonProps
  extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

/**
 * Button that leans toward the cursor.
 *
 * The offset is written straight to two custom properties on the node, so a
 * mouse move costs one style write instead of a React render. The element's
 * rect is measured once on enter rather than on every move, which keeps the
 * handler off the layout path entirely.
 */
const MagneticButton = ({
  children,
  className = "",
  href,
  ...rest
}: MagneticButtonProps) => {
  const ref = useRef<HTMLElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const reduceMotion = useReducedMotion();

  const handleEnter = () => {
    if (reduceMotion) return;
    rect.current = ref.current?.getBoundingClientRect() ?? null;
  };

  const handleMove = (event: React.MouseEvent) => {
    const box = rect.current;
    const el = ref.current;
    if (!box || !el || reduceMotion) return;
    el.style.setProperty(
      "--mx",
      `${(event.clientX - (box.left + box.width / 2)) * 0.22}px`,
    );
    el.style.setProperty(
      "--my",
      `${(event.clientY - (box.top + box.height / 2)) * 0.22}px`,
    );
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
    rect.current = null;
  };

  const props = {
    ref: ref as React.Ref<never>,
    className: `magnetic inline-flex items-center justify-center gap-2 ${className}`,
    onMouseEnter: handleEnter,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    ...rest,
  };

  return href ? (
    <a href={href} {...props}>
      {children}
    </a>
  ) : (
    <button type="button" {...props}>
      {children}
    </button>
  );
};

export default MagneticButton;

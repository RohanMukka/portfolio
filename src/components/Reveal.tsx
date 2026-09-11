import React, { useEffect, useRef, useState } from "react";

type RevealVariant = "up" | "fade" | "scale" | "left" | "right";

type RevealProps = {
  children: React.ReactNode;
  /** Direction the element travels in from. */
  variant?: RevealVariant;
  /** Seconds of delay, for staggering siblings. */
  delay?: number;
  /** Render a different tag than div. */
  as?: "div" | "p" | "section" | "span" | "li" | "article" | "header" | "form";
  className?: string;
  style?: React.CSSProperties;
  id?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "style" | "id" | "className">;

/**
 * Scroll-triggered entrance.
 *
 * One IntersectionObserver per element flips a data attribute, and CSS does the
 * rest. Replaces framer-motion's `whileInView`, which shipped a full animation
 * runtime and created a projection node for every animated element on the page.
 * Once revealed, the observer disconnects and the element costs nothing.
 */
const Reveal = ({
  children,
  variant = "up",
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
  ...rest
}: RevealProps) => {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Component = Tag as React.ElementType;

  return (
    <Component
      // The ref type varies with the tag; the cast keeps the call sites clean.
      ref={ref as React.Ref<never>}
      className={`reveal ${className}`}
      data-reveal={variant}
      data-shown={shown ? "" : undefined}
      style={delay ? { ...style, transitionDelay: `${delay}s` } : style}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Reveal;

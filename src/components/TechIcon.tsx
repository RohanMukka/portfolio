import React from "react";

export interface SimpleIcon {
  title: string;
  hex: string;
  path: string;
}

/** Relative luminance of a "RRGGBB" string, 0 (black) to 1 (white). */
const luminance = (hex: string) => {
  const n = parseInt(hex, 16);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * (n & 255)
  );
};

/**
 * Renders a brand mark inline from simple-icons path data -- no network request
 * per logo, and no dependency on a third-party CDN staying up.
 *
 * Marks that are near-black (GitHub, Next.js, Angular...) are drawn in the
 * current text colour instead of their brand hex, so they stay visible when the
 * dark theme is on rather than disappearing into the background.
 */
const TechIcon = ({ icon, size = 26 }: { icon: SimpleIcon; size?: number }) => {
  const tooDark = luminance(icon.hex) < 0.06;
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={tooDark ? "currentColor" : `#${icon.hex}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d={icon.path} />
    </svg>
  );
};

export default TechIcon;

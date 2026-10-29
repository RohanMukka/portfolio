// The page's layout breakpoints, the same as Tailwind's defaults (md 48rem,
// lg 64rem), for code that has to agree with the CSS. Below lg the page
// stacks its text full width, so the 3D stage moves its shapes out of the
// way (above the text) below lg as well.
export const MD = 768;
export const LG = 1024;

/** Phone-sized windows: below md. */
export const PHONE = `(max-width: ${MD - 1}px)`;
/** The full, side-by-side layout: lg and up. */
export const WIDE = `(min-width: ${LG}px)`;

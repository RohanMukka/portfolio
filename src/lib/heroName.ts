// The hero name, shared by the intro and the hero. Each letter carries a
// layoutId, so when the intro unmounts and the hero mounts in the same render,
// framer-motion flies every letter from its intro position into the hero.
export const NAME_WORDS = [
  [
    { char: "R", id: "swap-1" },
    { char: "o", id: "o-1" },
    { char: "h", id: "h-1" },
    { char: "a", id: "a-1" },
    { char: "n", id: "n-1" },
  ],
  [
    { char: "M", id: "swap-2" },
    { char: "u", id: "u-1" },
    { char: "k", id: "k-1" },
    { char: "k", id: "k-2" },
    { char: "a", id: "a-2" },
  ],
];

// Type styling both copies share, so the hand-off doesn't jump in size.
export const NAME_TYPE =
  "text-5xl sm:text-6xl lg:text-[7.5rem] font-extrabold tracking-[-0.055em] leading-[0.9] text-primary-text";

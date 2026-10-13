import React, { useState } from "react";
import { CENTREPIECES, getCentrepiece, setCentrepiece } from "./store";

// Local-only (rendered in dev builds) toggle between the two centrepieces,
// so the owner can compare them on the real page before one is chosen.
const Switcher = () => {
  const [current, setCurrent] = useState(getCentrepiece);

  return (
    <div className="fixed left-4 bottom-4 z-[70] flex items-center gap-1 p-1 rounded-full border border-primary-text/15 bg-background/85 backdrop-blur-md shadow-2xl">
      <span className="hud px-3 text-primary-tertiary">Centrepiece</span>
      {CENTREPIECES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => {
            setCentrepiece(c.id);
            setCurrent(c.id);
          }}
          className={`hud px-3 py-2 rounded-full transition-colors ${
            current === c.id ? "bg-primary-text text-background" : "text-primary-secondary hover:text-primary-text"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
};

export default Switcher;

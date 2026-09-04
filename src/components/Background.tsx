import React from "react";
import "./Background.css";

/**
 * Ambient background. Deliberately has no state, no listeners and no effects:
 * every layer reacts to the pointer and scroll through the --px / --py /
 * --scroll variables that `startAmbient` writes, and theme changes are handled
 * by CSS attribute selectors rather than a MutationObserver.
 */
const Background = () => (
  <div className="bg-root" aria-hidden="true">
    <div className="bg-aurora" />
    <div className="bg-motes-far" />
    <div className="bg-motes" />
    <div className="bg-floor">
      <div className="bg-floor-grid" />
    </div>
    <div className="bg-horizon" />
    <div className="bg-grain" />
  </div>
);

export default React.memo(Background);

import React from "react";
import "../loader.css";

/**
 * Boot overlay. Sits on top of the fully rendered page and fades out, so it
 * never delays first contentful paint the way a render gate would.
 */
const Loader = ({ done }: { done: boolean }) => (
  <div className={`boot-veil${done ? " boot-veil--done" : ""}`} aria-hidden="true">
    <div className="ai-matrix-loader">
      {["0", "1", "0", "1", "1", "0", "0", "1"].map((digit, i) => (
        <div className="digit" key={i}>
          {digit}
        </div>
      ))}
      <div className="glow" />
    </div>
  </div>
);

export default Loader;

import React from "react";
import "./TechRibbon.css";

const techStack = [
  "React", "TypeScript", "Node.js", "Python", "ML", "Solidity",
  "Cloud Systems", "Full-Stack", "Web3", "Blockchain", "System Design",
];

/**
 * Infinite marquee. The track is duplicated once and translated by exactly
 * -50%, so the loop is seamless; running it as a CSS animation keeps it on the
 * compositor instead of driving it from an animation library's frame loop.
 */
const TechRibbon = () => (
  <div className="ribbon" aria-hidden="true">
    <div className="ribbon-track">
      {[0, 1].map((copy) => (
        <div className="ribbon-run" key={copy}>
          {techStack.map((tech) => (
            <span className="ribbon-item" key={tech}>
              {tech}
              <i className="ribbon-dot" />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default TechRibbon;

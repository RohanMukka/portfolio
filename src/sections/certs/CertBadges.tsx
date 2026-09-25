import React from "react";
import { motion } from "framer-motion";
import { certificationsByDate, yearOf, type Certification } from "../../data/certifications";

const initials = (issuer: string) =>
  issuer
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w) && !["of", "and"].includes(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

// A round seal: issuer on a circular path, initials and year in the middle.
const Seal = ({ cert, id }: { cert: Certification; id: string }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
    <defs>
      <path id={id} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
    </defs>
    <circle cx="100" cy="100" r="94" fill="none" style={{ stroke: "var(--text-primary)" }} strokeWidth="1.5" />
    <circle cx="100" cy="100" r="54" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1.5" strokeDasharray="3 5" />
    <text fontSize="13" fontWeight="700" letterSpacing="3.2" style={{ fill: "var(--text-primary)", textTransform: "uppercase" }}>
      <textPath href={`#${id}`} startOffset="0">
        {`${cert.issuer} ✦ Certified ✦ `.toUpperCase()}
      </textPath>
    </text>
    <text x="100" y="104" textAnchor="middle" fontSize="34" fontWeight="800" style={{ fill: "var(--text-primary)", fontFamily: '"Inter Tight", Inter, sans-serif' }}>
      {initials(cert.issuer)}
    </text>
    <text x="100" y="128" textAnchor="middle" fontSize="12" fontWeight="700" letterSpacing="2" style={{ fill: "var(--accent)" }}>
      {yearOf(cert)}
    </text>
  </svg>
);

// Option 3: a wall of seals (like Saffron's audit badge). Each seal slowly
// turns; hovering flips it to the certificate's details.
const CertBadges = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 md:gap-y-16">
    {certificationsByDate.map((c, i) => (
      <motion.div
        key={c.name}
        className="group flex flex-col items-center text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative w-36 h-36 md:w-52 md:h-52 [perspective:900px]">
          <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <div className="w-full h-full animate-[spin_40s_linear_infinite]">
                <Seal cert={c} id={`seal-${i}`} />
              </div>
            </div>
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-full bg-primary-text text-background flex flex-col items-center justify-center p-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">{c.issued}</span>
              <span className="mt-2 text-xs md:text-sm font-semibold leading-snug">
                {c.skills?.join(" · ") ?? c.issuer}
              </span>
              {c.expires && <span className="mt-2 text-[10px] uppercase tracking-[0.2em] opacity-70">Valid to {c.expires}</span>}
            </div>
          </div>
        </div>
        <h3 className="mt-6 font-display text-lg md:text-xl font-bold tracking-[-0.02em] leading-tight text-primary-text max-w-[16rem]">
          {c.name}
        </h3>
        <p className="mt-1 text-sm text-primary-secondary">{c.issuer}</p>
      </motion.div>
    ))}
  </div>
);

export default CertBadges;

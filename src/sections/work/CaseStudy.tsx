import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, FEATURED_TITLES } from "../../data/projects";
import { caseStudies, caseStudyBySlug } from "../../data/caseStudies";
import { setPageScrollPaused } from "../../lib/smoothScroll";
import ProjectVisual, { factFor } from "./ProjectVisual";
import { EASE, pad, ProjectLinks } from "./shared";

// Case studies open over the page at #/work/<slug>, so they can be linked to
// and the back button closes them. A hash needs no server rewrites.
const HASH = /^#\/work\/([\w-]+)$/;
const slugFromHash = () => HASH.exec(window.location.hash)?.[1] ?? null;

// Featured order, limited to projects that have a case study.
const ORDER = FEATURED_TITLES.filter((t) => caseStudies[t]);

export const hasCaseStudy = (title: string) => title in caseStudies;
export const openCaseStudy = (title: string) => {
  window.location.hash = `/work/${caseStudies[title].slug}`;
};

type RiseProps = { children: React.ReactNode; delay?: number; className?: string; as?: "div" | "li" };

const Rise: React.FC<RiseProps> = ({ children, delay = 0, className = "", as = "div" }) => {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-8 text-xs font-bold uppercase tracking-[0.3em] text-accent">{children}</p>
);

const CaseStudy = () => {
  const [slug, setSlug] = useState(slugFromHash);
  const openedHere = useRef(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onHash = () => {
      const next = slugFromHash();
      if (next) openedHere.current = true;
      setSlug(next);
      scroller.current?.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const found = slug ? caseStudyBySlug(slug) : null;
  const isOpen = found !== null;

  useEffect(() => {
    setPageScrollPaused(isOpen);
    return () => setPageScrollPaused(false);
  }, [isOpen]);

  // Moving between case studies replaces the entry, so Back still returns to the page.
  const goTo = (title: string) => {
    const next = caseStudies[title].slug;
    history.replaceState(null, "", `#/work/${next}`);
    setSlug(next);
    scroller.current?.scrollTo({ top: 0 });
  };

  const close = useCallback(() => {
    if (openedHere.current) {
      openedHere.current = false;
      history.back();
    } else {
      // Arrived from a shared link: drop the hash without leaving the site.
      history.replaceState(null, "", window.location.pathname + window.location.search + "#projects");
      setSlug(null);
      document.getElementById("projects")?.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    scroller.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const project = found && projects.find((p) => p.title === found.title);
  const at = found ? ORDER.indexOf(found.title) : -1;
  const nextTitle = ORDER[(at + 1) % ORDER.length];

  return (
    <AnimatePresence>
      {found && project && (
        <motion.div
          key="case-study"
          ref={scroller}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} case study`}
          tabIndex={-1}
          data-lenis-prevent
          className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-background text-primary-text outline-none"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <div className="sticky top-0 z-10 bg-background/85 backdrop-blur-xl border-b border-primary-text/10">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
              <button
                onClick={close}
                className="flex items-center gap-2 text-sm font-semibold text-primary-text hover:text-accent transition-colors"
              >
                <ArrowLeft size={18} /> All work
              </button>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary-secondary tabular-nums">
                Case study {pad(at + 1)} / {pad(ORDER.length)}
              </span>
            </div>
          </div>

          <article key={project.title} className="max-w-6xl mx-auto px-6">
            <header className="pt-16 md:pt-24 pb-16 md:pb-24">
              <Rise>
                <Label>
                  {pad(at + 1)} — {project.category}
                </Label>
              </Rise>
              <Rise delay={0.05}>
                <h1 className="font-display font-bold text-[clamp(2.75rem,10vw,8.5rem)] tracking-[-0.05em] leading-[0.9] text-primary-text">
                  {project.title}
                </h1>
              </Rise>
              <Rise delay={0.1}>
                <p className="mt-6 text-lg md:text-xl text-primary-secondary">{project.tagline}</p>
              </Rise>

              <div className="mt-14 md:mt-20 grid md:grid-cols-[minmax(0,1fr)_16rem] gap-10 md:gap-16">
                <Rise delay={0.15}>
                  <p className="font-display text-2xl md:text-[2.1rem] font-medium tracking-[-0.02em] leading-snug text-primary-text">
                    {found.study.summary}
                  </p>
                </Rise>
                <Rise delay={0.2} className="flex flex-col gap-8">
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary-secondary">Stack</p>
                    <ul className="flex flex-col gap-1.5 text-sm font-semibold text-primary-text">
                      {found.study.stack.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <ProjectLinks project={project} />
                </Rise>
              </div>
            </header>

            <section className="grid md:grid-cols-3 border-y border-primary-text/10">
              {found.study.numbers.map((n, i) => (
                <Rise
                  key={n.label}
                  delay={i * 0.08}
                  className={`py-10 md:py-14 md:px-8 md:first:pl-0 ${i > 0 ? "border-t md:border-t-0 md:border-l border-primary-text/10" : ""}`}
                >
                  <p className="font-display font-bold text-5xl md:text-6xl tracking-[-0.04em] text-primary-text tabular-nums">{n.value}</p>
                  <p className="mt-3 max-w-[18rem] text-sm text-primary-secondary">{n.label}</p>
                </Rise>
              ))}
            </section>

            <section className="py-20 md:py-32">
              <Rise>
                <Label>Architecture</Label>
              </Rise>
              <Rise delay={0.05}>
                <div className="max-w-4xl aspect-[4/3] rounded-3xl overflow-hidden border border-primary-text/10">
                  <ProjectVisual project={project} />
                </div>
                <p className="mt-5 text-sm font-semibold text-primary-secondary">{factFor(project)}</p>
              </Rise>
            </section>

            <section className="pb-20 md:pb-32">
              <Rise>
                <Label>Key decisions</Label>
              </Rise>
              <ol className="border-t border-primary-text/10">
                {found.study.decisions.map((d, i) => (
                  <Rise
                    key={d.title}
                    as="li"
                    delay={i * 0.06}
                    className="grid md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)] gap-3 md:gap-8 py-8 md:py-10 border-b border-primary-text/10"
                  >
                      <span className="text-xs tabular-nums tracking-widest text-accent md:pt-2">{pad(i + 1)}</span>
                      <h3 className="font-display font-bold text-2xl md:text-4xl tracking-[-0.03em] leading-tight text-primary-text">{d.title}</h3>
                      <p className="text-base md:text-lg text-primary-secondary leading-relaxed md:pt-1">{d.body}</p>
                  </Rise>
                ))}
              </ol>
            </section>
          </article>

          <button
            onClick={() => goTo(nextTitle)}
            className="group block w-full border-t border-primary-text/10 text-left"
          >
            <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 flex items-end justify-between gap-6">
              <div className="min-w-0">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary-secondary">Next project</p>
                <p className="font-display font-bold text-[clamp(2.5rem,8vw,6rem)] tracking-[-0.05em] leading-[0.95] text-primary-text group-hover:text-accent transition-colors">
                  {nextTitle}
                </p>
              </div>
              <ArrowUpRight
                size={56}
                className="shrink-0 text-primary-text group-hover:text-accent group-hover:rotate-45 transition-all duration-500"
              />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CaseStudy;

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "../../data/projects";

export const EASE = [0.16, 1, 0.3, 1] as const;

export const pad = (n: number) => String(n).padStart(2, "0");

// A case study's blocks rise into place as they scroll into view.
type RiseProps = { children: React.ReactNode; delay?: number; className?: string; as?: "div" | "li" };

export const Rise: React.FC<RiseProps> = ({ children, delay = 0, className = "", as = "div" }) => {
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

// A case study section's label.
export const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-8 text-xs font-bold uppercase tracking-[0.3em] text-accent">{children}</p>
);

export const TagList = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-surface-subtle text-primary-text border border-glass-border">
        {tag}
      </span>
    ))}
  </div>
);

export const ProjectLinks = ({ project }: { project: Project }) => (
  <div className="flex gap-2">
    {project.links.github && (
      <a
        href={project.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-text text-background hover:opacity-90 transition-opacity font-medium text-sm"
      >
        <Github size={16} /> Code
      </a>
    )}
    {project.links.demo && (
      <a
        href={project.links.demo}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white hover:opacity-90 transition-opacity font-medium text-sm"
      >
        <ExternalLink size={16} /> Demo
      </a>
    )}
  </div>
);

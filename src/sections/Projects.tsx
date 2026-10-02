import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { projects, orderedProjects, CATEGORIES, type Category } from '../data/projects';
import HoverIndex from './work/HoverIndex';
import CaseStudy from './work/CaseStudy';

// With no filter, lead with the featured projects and keep the rest a click away.
const FEATURED_COUNT = 6;

const Projects = () => {
  const [filter, setFilter] = useState<Category>('All');
  const [showAll, setShowAll] = useState(false);

  const matching = orderedProjects(projects.filter(p => filter === 'All' || p.category === filter));
  const collapsible = filter === 'All' && matching.length > FEATURED_COUNT;
  const items = collapsible && !showAll ? matching.slice(0, FEATURED_COUNT) : matching;

  return (
    <section id="projects" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          className="mb-2"
          index="02"
          label="Work"
          title={"Selected\nProjects"}
          subtitle="Experimental work, open source contributions, and personal tools."
        >
          {/* Editorial filters: label, count, and an underline on the active one. */}
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {CATEGORIES.map((cat) => {
              const active = filter === cat;
              const count = cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-pressed={active}
                  className={`group relative py-1 text-xs md:text-sm font-medium uppercase tracking-[0.22em] transition-colors ${
                    active ? 'text-primary-text' : 'text-primary-tertiary hover:text-primary-text'
                  }`}
                >
                  {cat}
                  <sup className="ml-1 text-[9px] tabular-nums tracking-normal text-accent">{String(count).padStart(2, '0')}</sup>
                  <span
                    className={`absolute left-0 -bottom-0.5 h-px w-full bg-primary-text transition-transform duration-500 ${
                      active ? 'scale-x-100 origin-left' : 'scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </SectionHeader>

        <HoverIndex items={items} />
        <CaseStudy />

        {collapsible && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAll((s) => !s)}
              className="px-6 py-3 rounded-full border border-primary-text/20 text-sm font-semibold text-primary-text hover:border-accent hover:text-accent transition-colors"
            >
              {showAll ? 'Show fewer' : `Show all ${matching.length} projects`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;

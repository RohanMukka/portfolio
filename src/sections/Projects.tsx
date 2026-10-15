import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { projects, orderedProjects, CATEGORIES, FEATURED_TITLES, type Category } from '../data/projects';
import HoverIndex from './work/HoverIndex';
import CaseStudy from './work/CaseStudy';
import WorkTour from './work/WorkTour';

// Everything the tour doesn't stop at.
const REST = orderedProjects(projects.filter((p) => !FEATURED_TITLES.includes(p.title)));

const Projects = () => {
  const [filter, setFilter] = useState<Category>('All');
  const items = REST.filter((p) => filter === 'All' || p.category === filter);
  const categories = CATEGORIES.filter((cat) => cat === 'All' || REST.some((p) => p.category === cat));

  return (
    <section id="projects" data-chapter="work" className="pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          className="mb-2"
          index="02"
          label="Work"
          title={"Selected\n*work*"}
          subtitle="Retrieval, streaming and MLOps systems, and the products built on them."
        />
      </div>

      <WorkTour />

      {/* The rest, as a list that keeps to the left on wide screens; the 3D
          network fills the right. */}
      <div id="more-work" className="max-w-6xl mx-auto px-6 pt-16">
        <div className="lg:w-[60%]">
          <h3 className="font-display font-bold text-3xl md:text-4xl tracking-[-0.04em] text-primary-text">More work</h3>
          {/* Editorial filters: label, count, and an underline on the active one. */}
          <div className="flex flex-wrap gap-x-7 gap-y-3 pt-6 pb-2">
            {categories.map((cat) => {
              const active = filter === cat;
              const count = cat === 'All' ? REST.length : REST.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-pressed={active}
                  className={`group relative py-1 hud transition-colors ${
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

          <HoverIndex items={items} start={FEATURED_TITLES.length + 1} />
        </div>
      </div>
      <CaseStudy />
    </section>
  );
};

export default Projects;

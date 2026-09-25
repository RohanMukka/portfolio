import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { projects, orderedProjects, CATEGORIES, type Category } from '../data/projects';
import HoverIndex from './work/HoverIndex';

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
          className="mb-10"
          index="02"
          label="Work"
          title={<>Selected<br />Projects</>}
          subtitle="Experimental work, open source contributions, and personal tools."
        >
          <div className="flex flex-wrap gap-2 bg-surface-subtle p-1.5 rounded-2xl border border-glass-border">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  filter === cat
                  ? 'bg-primary-text text-background shadow-lg scale-105'
                  : 'text-primary-secondary hover:text-primary-text hover:bg-bg-elevated/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </SectionHeader>

        <HoverIndex items={items} />

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

import React from 'react';
import type { Experience } from '../types';

export const ExperienceItem: React.FC<Experience> = ({ role, company, period, description }) => {
  return (
    <div
      className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
    >
      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
      <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2" aria-label={period}>
        {period}
      </header>
      <div className="z-10 sm:col-span-6">
        <h3 className="font-medium leading-snug text-slate-200">
            <div className="inline-flex items-baseline font-medium leading-tight text-slate-200 text-base">
              <span>{role} · {company}</span>
            </div>
        </h3>
        <ul className="mt-2 list-disc list-inside text-slate-400 space-y-1 text-sm">
            {description.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
        </ul>
      </div>
    </div>
  );
};

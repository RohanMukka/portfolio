import React from 'react';
import type { Project } from '../types';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { GitHubIcon } from './icons/GitHubIcon';

export const ProjectCard: React.FC<Project> = ({ name, period, tech, description, links, imageUrl }) => {
  return (
    <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
      
      <div className="z-10 sm:col-span-3">
         <img src={imageUrl} alt={name} className="rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 w-full h-auto object-cover" loading="lazy" />
      </div>

      <div className="z-10 sm:col-span-5">
        <header className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {period}
        </header>
        <h3 className="font-medium leading-snug text-slate-200">
          <div>
            <a
              className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-sky-300 focus-visible:text-sky-300 group/link text-base"
              href={links.find(link => link.name.toLowerCase().includes('github'))?.url || links[0]?.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${name} (opens in a new tab)`}
            >
              <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:block"></span>
              <span>{name}</span>
            </a>
          </div>
        </h3>
        <div className="mt-2 text-sm leading-normal text-slate-400">
          {description.map((p, i) => <p key={i} className="mb-2 last:mb-0">{p}</p>)}
        </div>
        
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          {links.map((link) => (
            <a 
              key={link.name} 
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="relative inline-flex items-center text-sm font-medium text-slate-300 hover:text-sky-300 focus-visible:text-sky-300"
              aria-label={`${link.name} (opens in a new tab)`}
            >
              {link.name.toLowerCase().includes('github') ? <GitHubIcon className="h-4 w-4 mr-1.5" /> : <ExternalLinkIcon className="h-4 w-4 mr-1.5" />}
              <span>{link.name}</span>
            </a>
          ))}
        </div>

        {tech && (
          <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
            {tech.split(', ').map((skill, i) => (
              <li key={i} className="mr-1.5 mt-2">
                <div className="flex items-center rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium leading-5 text-sky-300">
                  {skill}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

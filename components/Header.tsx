import React from 'react';
import { GitHubIcon } from './icons/GitHubIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { EmailIcon } from './icons/EmailIcon';
import { Navigation } from './Navigation';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface HeaderProps {
    activeSection: string | null;
}

export const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
          <a href="/">Rohan Mukka</a>
        </h1>
        <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
          Master's Student in Computer Science
        </h2>
        <p className="mt-4 max-w-xs leading-normal text-slate-400">
          I build intelligent, scalable, and user-centric applications from concept to deployment.
        </p>
        <Navigation activeSection={activeSection} />
         <div className="mt-8">
          <a
            className="inline-flex items-center leading-tight font-semibold text-slate-200 group"
            aria-label="View Full Resume (opens in a new tab)"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <span className="border-b border-transparent pb-px transition group-hover:border-sky-300 motion-reduce:transition-none">View Full 
                <span className="whitespace-nowrap"> Resume</span>
              </span>
              <ExternalLinkIcon className="inline-block h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" />
            </span>
          </a>
        </div>
      </div>
      
      <ul className="ml-1 mt-8 flex items-center" aria-label="Social media">
        <li className="mr-5 text-xs shrink-0">
          <a className="block hover:text-slate-200 transition-colors" href="https://github.com/rohanmukka" target="_blank" rel="noreferrer noopener" aria-label="GitHub">
            <span className="sr-only">GitHub</span>
            <GitHubIcon className="h-6 w-6" />
          </a>
        </li>
        <li className="mr-5 text-xs shrink-0">
          <a className="block hover:text-slate-200 transition-colors" href="https://linkedin.com/in/rohanmukka" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
            <span className="sr-only">LinkedIn</span>
            <LinkedInIcon className="h-6 w-6" />
          </a>
        </li>
         <li className="mr-5 text-xs shrink-0">
          <a className="block hover:text-slate-200 transition-colors" href="mailto:rohan.mukka-1@ou.edu" aria-label="Email">
            <span className="sr-only">Email</span>
            <EmailIcon className="h-6 w-6" />
          </a>
        </li>
      </ul>
    </header>
  );
};


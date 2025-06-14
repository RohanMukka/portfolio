
import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { FooterProps } from '../../types';

const Footer: React.FC<FooterProps> = ({ personalData }) => {
  return (
    <footer className="py-10 text-center text-[var(--text-color)] dark:text-gray-400 bg-white/30 dark:bg-[#0A0A14]/50 backdrop-blur-lg border-t border-gray-700/30">
      <p className="text-sm">&copy; {new Date().getFullYear()} {personalData.name}. All rights reserved.</p>
      <div className="flex justify-center space-x-6 mt-4">
          <a
            href={personalData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-color)] dark:text-gray-400 hover:text-[var(--text-color)] dark:hover:text-white transition-all duration-300 transform hover:-translate-y-1"
            data-cursor-hover-link
            aria-label={`${personalData.name} GitHub Profile`}
          >
            <Github size={24}/>
          </a>
          <a
            href={personalData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-color)] dark:text-gray-400 hover:text-[var(--text-color)] dark:hover:text-white transition-all duration-300 transform hover:-translate-y-1"
            data-cursor-hover-link
            aria-label={`${personalData.name} LinkedIn Profile`}
          >
            <Linkedin size={24}/>
          </a>
          <a
            href={`mailto:${personalData.email}`}
            className="text-[var(--text-color)] dark:text-gray-400 hover:text-[var(--text-color)] dark:hover:text-white transition-all duration-300 transform hover:-translate-y-1"
            data-cursor-hover-link
            aria-label={`Email ${personalData.name}`}
          >
            <Mail size={24}/>
          </a>
      </div>
    </footer>
  );
};

export default Footer;

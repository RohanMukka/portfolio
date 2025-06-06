
import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { FooterProps } from '../../types';

const Footer: React.FC<FooterProps> = ({ personalData }) => {
  return (
    <footer className="py-10 text-center text-gray-600 dark:text-gray-400 border-t border-gray-700/30">
      <p className="text-sm">&copy; {new Date().getFullYear()} {personalData.name}. All rights reserved.</p>
      <div className="flex justify-center space-x-6 mt-4">
          <a 
            href={personalData.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-amber-400 transition-colors"
            data-cursor-hover-link
            aria-label={`${personalData.name} GitHub Profile`}
          >
            <Github size={24}/>
          </a>
          <a 
            href={personalData.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-amber-400 transition-colors"
            data-cursor-hover-link
            aria-label={`${personalData.name} LinkedIn Profile`}
          >
            <Linkedin size={24}/>
          </a>
          <a 
            href={`mailto:${personalData.email}`} 
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-amber-400 transition-colors"
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

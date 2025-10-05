import React from 'react';

const navItems = [
  { id: 'about', title: 'About' },
  { id: 'experience', title: 'Experience' },
  { id: 'projects', title: 'Projects' },
  { id: 'skills', title: 'Skills' },
  { id: 'education', title: 'Education' },
  { id: 'certifications', title: 'Certifications' },
  { id: 'extracurricular', title: 'Activities' },
];

interface NavigationProps {
  activeSection: string | null;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection }) => {
  const handleJumpToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update hash in URL for better user experience, without triggering a page reload
      if (window.history.pushState) {
        window.history.pushState(null, '', `#${sectionId}`);
      } else {
        window.location.hash = sectionId;
      }
    }
  };

  return (
    <nav className="nav hidden lg:block" aria-label="In-page jump links">
      <ul className="mt-16 w-max">
        {navItems.map((item) => (
          <li key={item.id}>
            <a 
              className={`group flex items-center py-3 ${activeSection === item.id ? 'active' : ''}`} 
              href={`#${item.id}`}
              onClick={(e) => handleJumpToSection(e, item.id)}
            >
              <span className={`nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none ${activeSection === item.id ? '!w-16 !bg-slate-200' : ''}`}></span>
              <span className={`nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200 ${activeSection === item.id ? 'text-slate-200' : ''}`}>
                {item.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
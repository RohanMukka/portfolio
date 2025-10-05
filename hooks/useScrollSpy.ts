import { useState, useEffect, useRef } from 'react';

export const useScrollSpy = (
  sectionIds: string[],
  options?: IntersectionObserverInit
): string | null => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      // Prefer the section closest to the top of the viewport
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length > 0) {
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveSection(visible[0].target.id);
      } else {
        // Edge case: at the very bottom, force last section active
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
          setActiveSection(sectionIds[sectionIds.length - 1]);
        }
      }
    };
    
    observer.current = new IntersectionObserver(handleIntersect, {
      // Symmetric margins so the last section can still activate near the bottom
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
      ...options,
    });

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.current?.observe(element);
      }
    });

    return () => observer.current?.disconnect();
  }, [sectionIds, options]);

  return activeSection;
};

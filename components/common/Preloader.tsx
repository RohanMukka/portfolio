
import React, { useEffect, useRef } from 'react';
import { PreloaderProps } from '../../types';

const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  const calledRef = useRef(false);

  useEffect(() => {
    const handleLoaded = () => {
      if (!calledRef.current) {
        calledRef.current = true;
        onLoaded();
      }
    };

    if (document.readyState === 'complete') {
      handleLoaded();
      return;
    }

    window.addEventListener('load', handleLoaded);
    const timer = setTimeout(handleLoaded, 4000);

    return () => {
      window.removeEventListener('load', handleLoaded);
      clearTimeout(timer);
    };
  }, [onLoaded]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[10000] bg-transparent"
    >
      <div className="loader4">
        <svg viewBox="25 25 50 50">
          <circle r="20" cx="50" cy="50" />
        </svg>
      </div>
    </div>
  );
};

export default Preloader;

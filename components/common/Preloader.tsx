
import React, { useEffect } from 'react';
import { PreloaderProps } from '../../types';

const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  useEffect(() => {
    const timer = setTimeout(onLoaded, 4000);
    return () => clearTimeout(timer);
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

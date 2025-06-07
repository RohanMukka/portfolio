
import React, { useEffect } from 'react';
import { PreloaderProps } from '../../types';

const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  useEffect(() => {
    const timer = setTimeout(onLoaded, 4000);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[10000]"
      style={{ backgroundColor: 'var(--background-color)' }}
    >
      <div className="terminal-loader">
        <div className="terminal-header">
          <div className="terminal-title">Status</div>
          <div className="terminal-controls">
            <span className="control close"></span>
            <span className="control minimize"></span>
            <span className="control maximize"></span>
          </div>
        </div>
        <span className="text">Loading...</span>
      </div>
    </div>
  );
};

export default Preloader;

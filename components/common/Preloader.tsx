
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';
import { PreloaderProps } from '../../types';

const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoaded, 500); // Slightly longer delay for smoother transition
          return 100;
        }
        return prev + 2; // Adjust increment for desired speed
      });
    }, 40); // Adjust interval for desired speed
    
    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center z-[10000]"
          style={{
            backgroundColor: 'var(--background-color)'
          }}
          exit={{ opacity: 0, y: -50, transition: { duration: 0.5, ease: "easeInOut" } }}
        >
          <motion.div 
            className="w-24 h-24 mb-6"
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 1, type: 'spring', stiffness: 120, delay: 0.2 }}
          >
            <Layers size={80} className="text-black filter drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]" />
          </motion.div>
          <div className="w-72 h-2.5 bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-black rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }} // Faster bar update
            />
          </div>
          <motion.p
            className="text-gray-900 dark:text-white mt-5 text-lg font-mono tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Initializing Portfolio... {progress}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;


import React, { useEffect, useRef } from 'react';
import { LottieAnimationProps } from '../../types';

declare global {
  interface Window {
    lottie?: {
      loadAnimation: (options: any) => any; // Simplified type for lottie
    };
  }
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ animationData, loop, className }) => {
  const animationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: any; 
    if (typeof window !== 'undefined' && window.lottie && animationContainer.current) {
      anim = window.lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: loop !== undefined ? loop : true,
        autoplay: true,
        animationData: animationData,
      });
    }
    return () => {
      anim?.destroy(); 
    };
  }, [animationData, loop]);

  return <div ref={animationContainer} className={className} />;
};

export default LottieAnimation;

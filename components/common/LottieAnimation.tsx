
import React, { useEffect, useRef } from 'react';
import { LottieAnimationProps } from '../../types';
import lottie from 'lottie-web';

const LottieAnimation: React.FC<LottieAnimationProps> = ({ animationData, loop, className }) => {
  const animationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: any;
    if (animationContainer.current) {
      anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: loop !== undefined ? loop : true,
        autoplay: true,
        animationData,
      });
    }
    return () => {
      anim?.destroy();
    };
  }, [animationData, loop]);

  return <div ref={animationContainer} className={className} />;
};

export default LottieAnimation;

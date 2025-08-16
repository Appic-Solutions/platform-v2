'use client';

import * as React from 'react';
import { RadialProgress } from '@/components/ui/radial-progress';

export const RadialCountDown = () => {
  const [progress, setProgress] = React.useState(0);
  const duration = 20000;

  React.useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        startTime = null;
        setProgress(0);
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [duration]);

  return <RadialProgress value={progress} />;
};

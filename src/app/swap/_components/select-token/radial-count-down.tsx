'use client';

import * as React from 'react';
import { RadialProgress } from '@/components/ui/radial-progress';
import Spinner from '@/components/ui/spinner';

interface RadialCountDownProps {
  duration: number; // milliseconds
  isPending?: boolean;
}

export const RadialCountDown = ({ duration, isPending = false }: RadialCountDownProps) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (isPending) {
      setProgress(0);
      return;
    }

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

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [duration, isPending]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return <RadialProgress value={progress} />;
};

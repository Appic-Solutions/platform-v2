'use client';

import * as React from 'react';

import { cn } from '@/lib/utils/index';

interface RadialProgressProps {
  value: number;
  renderLabel?: (progress: number) => number | string;
  size?: number;
  strokeWidth?: number;
  circleStrokeWidth?: number;
  progressStrokeWidth?: number;
  shape?: 'square' | 'round';
  className?: string;
  progressClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
}

export const RadialProgress = ({
  value,
  className,
  progressClassName,
  shape = 'round',
  size = 24,
  strokeWidth,
  circleStrokeWidth = 2,
  progressStrokeWidth = 3,
}: RadialProgressProps) => {
  const radius = size / 2 - (strokeWidth ?? circleStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = circumference * ((100 - value) / 100);
  const viewBox = `0 0 ${size} ${size}`;

  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'rotate(-90deg)' }}
        className="relative"
      >
        {/* Base Circle */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeWidth={strokeWidth ?? circleStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset="0"
          className={cn('stroke-gray-200 dark:stroke-gray-300', className)}
        />
        {/* Progress */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth ?? progressStrokeWidth}
          strokeLinecap={shape}
          strokeDashoffset={percentage}
          fill="transparent"
          strokeDasharray={circumference}
          className={cn('stroke-blue-600', progressClassName)}
        />
      </svg>
    </div>
  );
};

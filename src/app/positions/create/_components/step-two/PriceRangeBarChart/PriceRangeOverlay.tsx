import React from 'react';
import { ScaleLinear } from 'd3-scale';
import { RangeStateType } from '.';
import { cn } from '@/lib/utils';

interface PriceRangeOverlayProps {
  leftPrice: number;
  rightPrice: number;
  minPercentage: number;
  maxPercentage: number;
  xScale: ScaleLinear<number, number>;
  chartWidth: number;
  setDragging: (value: 'left' | 'right' | null) => void;
  rangeState: RangeStateType;
}

export default function PriceRangeOverlay({
  leftPrice,
  rightPrice,
  minPercentage,
  maxPercentage,
  xScale,
  chartWidth,
  setDragging,
  rangeState,
}: PriceRangeOverlayProps) {
  const leftOutOfView = rangeState.isOutOfView && rangeState.direction === 'left';
  const rightOutOfView = rangeState.isOutOfView && rangeState.direction === 'right';
  const fullOutOfView = rangeState.isOutOfView && rangeState.direction === 'full';

  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full pb-4">
      <div
        className="absolute top-0 h-[98%] bg-[#FF2C8B17]"
        style={
          leftOutOfView
            ? {
                left: leftOutOfView ? '0px' : `${xScale(leftPrice)}px`,
                width: `${xScale(rightPrice)}px`,
              }
            : fullOutOfView
              ? {
                  left: `0px`,
                  width: chartWidth,
                }
              : {
                  left: `${xScale(leftPrice)}px`,
                  width: `${xScale(rightPrice) - xScale(leftPrice)}px`,
                }
        }
      />
      {/* Left Handle */}
      <div
        className={cn(
          'pointer-events-auto absolute top-0 h-[98%] cursor-ew-resize bg-blue-400',
          leftOutOfView || fullOutOfView ? 'hidden' : 'block',
        )}
        style={{ left: `${xScale(leftPrice) + 10}px` }}
        onMouseDown={() => setDragging('left')}
        onTouchStart={() => setDragging('left')}
      >
        <div className="absolute -left-2 top-1/2 h-[35px] w-1 -translate-y-1/2 rounded-full bg-[#FF2C8B]" />
        <div className="h-[99%] w-1 bg-[#FF2C8B]" />
        <div className="absolute top-0 h-[4px] w-[15px] rounded-full bg-[#FF2C8B]" />
        <div className="absolute bottom-0 h-[4px] w-[15px] rounded-full bg-[#FF2C8B]" />
        <div
          className="absolute top-0 flex w-[60px] select-none justify-center rounded-full border-2 border-gray-500 bg-box-background-secondary px-4 py-0.5 text-xs font-normal transition-all"
          style={{
            left: xScale(leftPrice) < 65 ? '10px' : '-65px',
          }}
        >
          {minPercentage.toFixed(0)}%
        </div>
      </div>
      {/* Right Handle */}
      <div
        className={cn(
          'pointer-events-auto absolute top-0 h-[98%] cursor-ew-resize',
          rightOutOfView || fullOutOfView ? 'hidden' : 'block',
        )}
        style={{ left: `${xScale(rightPrice) - 10}px` }}
        onMouseDown={() => setDragging('right')}
        onTouchStart={() => setDragging('right')}
      >
        <div className="absolute -right-2 top-1/2 h-[35px] w-1 -translate-y-1/2 rounded-full bg-[#FF2C8B]" />
        <div className="h-[99%] w-1 bg-[#FF2C8B]" />
        <div className="absolute -left-[11px] top-0 h-[4px] w-[15px] rounded-full bg-[#FF2C8B]" />
        <div className="absolute -left-[11px] bottom-0 h-[4px] w-[15px] rounded-full bg-[#FF2C8B]" />
        <div
          className="absolute top-0 flex w-[60px] select-none justify-center rounded-full border-2 border-gray-500 bg-box-background-secondary px-4 py-0.5 text-xs font-normal transition-all"
          style={{
            right: chartWidth - xScale(rightPrice) < 65 ? '10px' : '-65px',
          }}
        >
          {maxPercentage.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}

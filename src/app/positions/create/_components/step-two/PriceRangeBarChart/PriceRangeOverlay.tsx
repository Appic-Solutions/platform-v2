import React from 'react';
import { ScaleLinear } from 'd3-scale';

interface PriceRangeOverlayProps {
  leftPrice: number;
  rightPrice: number;
  minPercentage: number;
  maxPercentage: number;
  xScale: ScaleLinear<number, number>;
  chartWidth: number;
  setDragging: (value: 'left' | 'right' | null) => void;
}

export default function PriceRangeOverlay({
  leftPrice,
  rightPrice,
  minPercentage,
  maxPercentage,
  xScale,
  chartWidth,
  setDragging,
}: PriceRangeOverlayProps) {
  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full pb-4">
      <div
        className="absolute top-0 h-[98%] bg-[#FF2C8B17]"
        style={{
          left: `${xScale(leftPrice)}px`,
          width: `${xScale(rightPrice) - xScale(leftPrice)}px`,
        }}
      />
      {/* Left Handle */}
      <div
        className="pointer-events-auto absolute top-0 h-[98%] cursor-ew-resize bg-blue-400"
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
        className="pointer-events-auto absolute top-0 h-[98%] cursor-ew-resize"
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

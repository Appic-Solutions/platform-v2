import React from 'react';
import { ScaleLinear } from 'd3-scale';
import { NORMALIZATION_FACTOR } from '.';

interface InitialPriceLineProps {
  initialPrice: string;
  xScale: ScaleLinear<number, number>;
}

export default function InitialPriceLine({ initialPrice, xScale }: InitialPriceLineProps) {
  const normalizedInitialPrice = parseFloat(initialPrice) / NORMALIZATION_FACTOR;

  return (
    <div className="absolute left-0 top-0 h-full w-full">
      <div
        className="absolute top-0 h-[98%] rounded-full border-[1.5px] border-dashed border-[rgba(255,255,255,0.23)] bg-[#FF2C8B17]"
        style={{
          left: `${xScale(normalizedInitialPrice)}px`,
        }}
      />
    </div>
  );
}

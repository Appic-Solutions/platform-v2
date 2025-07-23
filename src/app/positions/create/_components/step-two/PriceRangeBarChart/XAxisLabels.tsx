import React from 'react';
import { ScaleLinear } from 'd3-scale';
import { NORMALIZATION_FACTOR } from '.';

const formatPrice = (price: number, normalize: boolean): string => {
  const displayPrice = normalize ? price * NORMALIZATION_FACTOR : price;
  const absPrice = Math.abs(displayPrice);

  if (absPrice === 0 || displayPrice === 1e-18) return '0';
  if (absPrice < 0.0001) return displayPrice.toFixed(6);
  if (absPrice >= 1e12) return `${(displayPrice / 1e12).toFixed(2)}T`;
  if (absPrice >= 1e9) return `${(displayPrice / 1e9).toFixed(2)}B`;
  if (absPrice >= 1e6) return `${(displayPrice / 1e6).toFixed(2)}M`;
  if (absPrice >= 1e3) return `${(displayPrice / 1e3).toFixed(2)}K`;
  return displayPrice.toFixed(4);
};

interface XAxisLabelsProps {
  xAxisNumbers: number[];
  xScale: ScaleLinear<number, number>;
  chartWidth: number;
  zoomLevel: number;
}

export default function XAxisLabels({
  xAxisNumbers,
  xScale,
  chartWidth,
  zoomLevel,
}: XAxisLabelsProps) {
  const baseSpacing = 50;
  const minLabelSpacing = Math.min(100, Math.max(20, 50 / Math.max(0.1, zoomLevel)));

  const filteredLabels = xAxisNumbers.reduce((acc: number[], price, index) => {
    if (index === 0 || index === xAxisNumbers.length - 1) {
      acc.push(price);
    } else {
      const prevPrice = xAxisNumbers[index - 1];
      const currPos = xScale(price);
      const prevPos = xScale(prevPrice);
      if (
        Number.isFinite(currPos) &&
        Number.isFinite(prevPos) &&
        Math.abs(currPos - prevPos) >= minLabelSpacing
      ) {
        acc.push(price);
      }
    }
    return acc;
  }, []);

  return (
    <div className="absolute -bottom-[15px] z-50 flex h-[20px] w-full select-none">
      {filteredLabels.map((item) => {
        const position = xScale(item);
        if (Number.isFinite(position) && position >= 0 && position <= chartWidth) {
          return (
            <span
              key={item}
              className="absolute text-sm font-normal text-[#FFFFFFB5]"
              style={{
                left: `${position}px`,
                transform: 'translateX(-50%)',
              }}
            >
              {formatPrice(item, true)}
            </span>
          );
        }
        return null;
      })}
    </div>
  );
}

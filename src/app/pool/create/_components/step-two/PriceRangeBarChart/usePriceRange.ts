import { useEffect, useMemo, useState, useRef } from 'react';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { ActiveTick } from '@/blockchain_api/functions/icp/dex/get_active_ticks';
import { NORMALIZATION_FACTOR } from './index';

const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function usePriceRange(
  chartData: ActiveTick[],
  initialPrice: string,
  chartWidth: number,
  setMinPrice: (price: number) => void,
  setMaxPrice: (price: number) => void,
) {
  const validPrices = chartData
    .map((tick) => parseFloat(tick.price))
    .filter((price) => !isNaN(price) && isFinite(price))
    .map((price) => (price === 0 ? 1e-18 : price));

  const minPrice = Math.min(...validPrices);
  const maxPrice = Math.max(...validPrices);

  const normalizedMinPrice = minPrice / NORMALIZATION_FACTOR;
  const normalizedMaxPrice = maxPrice / NORMALIZATION_FACTOR;
  const normalizedInitialPrice = parseFloat(initialPrice) / NORMALIZATION_FACTOR;

  const initialZoomFactor = 0.2;
  const [zoomLevel, setZoomLevel] = useState(1);

  const zoomFactor = initialZoomFactor / zoomLevel;
  const zoomedMinPrice = Math.max(normalizedMinPrice, normalizedInitialPrice * (1 - zoomFactor));
  const zoomedMaxPrice = Math.min(normalizedMaxPrice, normalizedInitialPrice * (1 + zoomFactor));

  const defaultLeftPrice = Math.max(
    normalizedMinPrice,
    normalizedInitialPrice * (1 - initialZoomFactor),
  );
  const defaultRightPrice = Math.min(
    normalizedMaxPrice,
    normalizedInitialPrice * (1 + initialZoomFactor),
  );

  const [leftPrice, setLeftPrice] = useState(defaultLeftPrice);
  const [rightPrice, setRightPrice] = useState(defaultRightPrice);
  const [minPercentage, setMinPercentage] = useState(0);
  const [maxPercentage, setMaxPercentage] = useState(100);

  const xScale: ScaleLinear<number, number> = useMemo(
    () => scaleLinear().domain([zoomedMinPrice, zoomedMaxPrice]).range([0, chartWidth]).clamp(true),
    [zoomedMinPrice, zoomedMaxPrice, chartWidth],
  );

  const debouncedSetPrices = useRef(
    debounce((left: number, right: number) => {
      setMinPrice(left * NORMALIZATION_FACTOR);
      setMaxPrice(right * NORMALIZATION_FACTOR);
    }, 100),
  ).current;

  useEffect(() => {
    const clampedLeftPrice = Math.max(zoomedMinPrice, Math.min(leftPrice, rightPrice));
    const clampedRightPrice = Math.max(leftPrice, Math.min(rightPrice, zoomedMaxPrice));

    if (clampedLeftPrice !== leftPrice) {
      setLeftPrice(clampedLeftPrice);
    }
    if (clampedRightPrice !== rightPrice) {
      setRightPrice(clampedRightPrice);
    }

    if (normalizedInitialPrice > 0) {
      setMinPercentage(
        ((clampedLeftPrice - normalizedInitialPrice) / normalizedInitialPrice) * 100,
      );
      setMaxPercentage(
        ((clampedRightPrice - normalizedInitialPrice) / normalizedInitialPrice) * 100,
      );
    } else {
      setMinPercentage(0);
      setMaxPercentage(100);
    }
  }, [leftPrice, rightPrice, zoomedMinPrice, zoomedMaxPrice, normalizedInitialPrice]);

  // Zoom functions
  const zoomIn = () => setZoomLevel((prev) => Math.min(10, prev * 1.25));
  const zoomOut = () => {
    setZoomLevel((prev) => {
      const newZoomLevel = Math.max(1e-6, prev / 1.25);

      const newZoomFactor = initialZoomFactor / newZoomLevel;
      const newMinPrice = normalizedInitialPrice * (1 - newZoomFactor);
      const newMaxPrice = normalizedInitialPrice * (1 + newZoomFactor);

      if (newMinPrice <= normalizedMinPrice * 0.999 && newMaxPrice >= normalizedMaxPrice * 1.001) {
        return initialZoomFactor / (normalizedMaxPrice / normalizedInitialPrice);
      }
      return newZoomLevel;
    });
  };

  return {
    leftPrice,
    rightPrice,
    minPercentage,
    maxPercentage,
    xScale,
    setLeftPrice,
    setRightPrice,
    zoomIn,
    zoomOut,
    zoomLevel,
    setZoomLevel,
    debouncedSetPrices,
  };
}

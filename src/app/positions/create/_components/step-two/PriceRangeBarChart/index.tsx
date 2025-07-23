import React, { useEffect, useState, useRef } from 'react';
import { ActiveTick } from '@/blockchain_api/functions/icp/dex/get_active_ticks';
import ChartContainer from './ChartContainer';
import PriceRangeOverlay from './PriceRangeOverlay';
import XAxisLabels from './XAxisLabels';
import InitialPriceLine from './InitialPriceLine';
import useChartResize from './useChartResize';
import usePriceRange from './usePriceRange';
import useDragHandlers from './useDragHandlers';
import { RefreshIcon, ZoomInIcon, ZoomOutIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface ChartType {
  label: string;
  value: 'fullRange' | 'customRange';
}

interface PriceRangeChartProps {
  selectedTab?: ChartType;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  chartData: ActiveTick[];
  initialPrice: string;
  resetToFullRange: () => void;
}

export const NORMALIZATION_FACTOR = 1e35;

export default function PriceRangeChart({
  selectedTab,
  setMinPrice,
  setMaxPrice,
  chartData,
  initialPrice,
  resetToFullRange,
}: PriceRangeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { chartWidth } = useChartResize(containerRef);
  const {
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
    debouncedSetPrices,
    setZoomLevel,
  } = usePriceRange(chartData, initialPrice, chartWidth, setMinPrice, setMaxPrice);
  const { dragging, setDragging } = useDragHandlers(
    containerRef,
    xScale,
    leftPrice,
    rightPrice,
    setLeftPrice,
    setRightPrice,
    debouncedSetPrices,
  );
  const [xAxisNumbers, setXAxisNumbers] = useState<number[]>([]);
  const [filteredChartData, setFilteredChartData] = useState<ActiveTick[]>(chartData);

  useEffect(() => {
    // reset on mount
    if (selectedTab?.value === 'customRange') {
      const normalizedInitialPrice = parseFloat(initialPrice) / NORMALIZATION_FACTOR;
      const normalizedMinPrice = normalizedInitialPrice - normalizedInitialPrice * 0.2;
      const normalizedMaxPrice = normalizedInitialPrice + normalizedInitialPrice * 0.2;
      setLeftPrice(normalizedMinPrice);
      setRightPrice(normalizedMaxPrice);
      setMaxPrice(parseFloat(initialPrice) * 1.2);
      setMinPrice(parseFloat(initialPrice) * 0.8);
    }
  }, [selectedTab, initialPrice]);

  useEffect(() => {
    if (selectedTab?.value === 'customRange') {
      debouncedSetPrices(leftPrice, rightPrice);
    }
  }, [leftPrice, rightPrice, debouncedSetPrices]);

  useEffect(() => {
    const normalizedMinPrice =
      Math.min(...chartData.map((tick) => parseFloat(tick.price) || 1e-18)) / NORMALIZATION_FACTOR;
    const normalizedMaxPrice =
      Math.max(...chartData.map((tick) => parseFloat(tick.price) || 1e-18)) / NORMALIZATION_FACTOR;
    const zoomFactor = 0.2 / zoomLevel;
    const normalizedInitialPrice = parseFloat(initialPrice) / NORMALIZATION_FACTOR;
    const zoomedMinPrice = Math.max(normalizedMinPrice, normalizedInitialPrice * (1 - zoomFactor));
    const zoomedMaxPrice = Math.min(normalizedMaxPrice, normalizedInitialPrice * (1 + zoomFactor));

    // Filter chartData
    const filteredChartData = chartData.filter(
      (tick) =>
        parseFloat(tick.price) / NORMALIZATION_FACTOR >= zoomedMinPrice &&
        parseFloat(tick.price) / NORMALIZATION_FACTOR <= zoomedMaxPrice,
    );

    // Calculate number of labels with a minimum of 2
    const numLabels = Math.max(2, Math.round(5 / Math.max(0.1, zoomLevel)));
    const priceRange = zoomedMaxPrice - zoomedMinPrice;
    const step = priceRange > 0 ? priceRange / (numLabels - 1) : 0;
    const labels = Array.from({ length: numLabels }, (_, i) =>
      Number.isFinite(step) ? zoomedMinPrice + i * step : zoomedMinPrice,
    );
    setXAxisNumbers(labels);

    // Update state for filteredChartData
    setFilteredChartData(filteredChartData);
  }, [chartData, initialPrice, zoomLevel]);

  const resetChartHandler = () => {
    resetToFullRange();
    setZoomLevel(1);
  };

  return (
    <>
      <div className="relative min-h-[250px] w-full animate-fade" ref={containerRef}>
        <ChartContainer chartData={filteredChartData} chartWidth={chartWidth} xScale={xScale} />
        <XAxisLabels
          xAxisNumbers={xAxisNumbers}
          xScale={xScale}
          chartWidth={chartWidth}
          zoomLevel={zoomLevel}
        />
        <InitialPriceLine initialPrice={initialPrice} xScale={xScale} />
        {selectedTab?.value === 'customRange' && (
          <PriceRangeOverlay
            leftPrice={leftPrice}
            rightPrice={rightPrice}
            minPercentage={minPercentage}
            maxPercentage={maxPercentage}
            xScale={xScale}
            chartWidth={chartWidth}
            setDragging={setDragging}
          />
        )}
        {/* chart controls */}
        <div
          className={cn(
            'flex w-full flex-row items-start justify-between gap-4 lg:items-center',
            'mb:-bottom-16 absolute -bottom-24',
          )}
        >
          <button
            onClick={resetChartHandler}
            type="button"
            className="flex h-[36px] w-[81px] items-center justify-center gap-2 rounded-[10px] bg-[#565656]"
          >
            <RefreshIcon className="h-3 w-3" strokeWidth={0} />
            Reset
          </button>
          <div className="flex items-center justify-start gap-[10px]">
            <button
              type="button"
              onClick={zoomIn}
              className="flex h-[36px] w-[40px] items-center justify-center rounded-[10px] bg-[#565656]"
            >
              <ZoomInIcon />
            </button>
            <button
              type="button"
              onClick={zoomOut}
              className="flex h-[36px] w-[40px] items-center justify-center rounded-[10px] bg-[#565656]"
            >
              <ZoomOutIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

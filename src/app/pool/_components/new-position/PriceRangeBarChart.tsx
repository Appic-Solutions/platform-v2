'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { scaleLinear } from 'd3-scale';
import { Charts } from './data';

interface DataItem {
  price: number;
  value: number;
}

const sampleData: DataItem[] = Array.from({ length: 100 }, (_, i) => ({
  price: 1000 + i * 10,
  value: Math.floor(Math.random() * 100) + 50,
}));

export default function LightPriceRangeChart({
  selectedTab,
  setMaxPrice,
  setMinPrice,
}: {
  selectedTab?: Charts;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(200);
  const [leftPrice, setLeftPrice] = useState(1100);
  const [rightPrice, setRightPrice] = useState(1600);
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);

  const [xAxisNumbers, setXAxisNumbers] = useState<number[]>();
  const [minPercentage, setMinPercentage] = useState(0);
  const [maxPercentage, setMaxPercentage] = useState(100);

  const minPrice = sampleData[0].price;
  const maxPrice = sampleData[sampleData.length - 1].price;

  const MIN_GAP = (maxPrice - minPrice) * 0.08; //space between two handlers

  // Define a linear scale that maps the price range (minPrice to maxPrice) to pixel positions (0 to chartWidth).
  // Used to position handles on the chart and convert mouse coordinates to price values.
  const xScale = useMemo(
    () => scaleLinear().domain([minPrice, maxPrice]).range([0, chartWidth]),
    [minPrice, maxPrice, chartWidth],
  );

  // Helper function to clamp a value within a range
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

  useEffect(() => {
    if (!containerRef.current) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging || !containerRef.current) return;

      const clientX = (e as TouchEvent).touches
        ? (e as TouchEvent).touches[0].clientX
        : (e as MouseEvent).clientX;

      const bounds = containerRef.current.getBoundingClientRect();
      const x = clientX - bounds.left;
      const price = clamp(xScale.invert(x), minPrice, maxPrice);

      if (dragging === 'left') {
        const p = clamp(Math.min(price, rightPrice - MIN_GAP), minPrice, rightPrice - MIN_GAP);
        setLeftPrice(p);
        setMinPrice(p);
      } else {
        const p = clamp(Math.max(price, leftPrice + MIN_GAP), leftPrice + MIN_GAP, maxPrice);
        setRightPrice(p);
        setMaxPrice(p);
      }
    };

    const stopDragging = () => setDragging(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDragging);

    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', stopDragging);
    window.addEventListener('touchcancel', stopDragging);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);

      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', stopDragging);
      window.removeEventListener('touchcancel', stopDragging);
    };
  }, [dragging, leftPrice, rightPrice]);

  // chart resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setChartWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const middle = (minPrice + maxPrice) / 2;
    const middleLow = (minPrice + middle) / 2;
    const middleHigh = (maxPrice + middle) / 2;
    setXAxisNumbers([minPrice, middleLow, middle, middleHigh, maxPrice]);
  }, []);

  useEffect(() => {
    setMinPercentage(((leftPrice - minPrice) / (maxPrice - minPrice)) * 100);
    setMaxPercentage(((rightPrice - minPrice) / (maxPrice - minPrice)) * 100);
  }, [leftPrice, rightPrice, minPrice, maxPrice]);

  return (
    <div className="relative min-h-[250px] w-full animate-fade" ref={containerRef}>
      {chartWidth > 0 && (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sampleData}>
            <Bar
              dataKey="value"
              isAnimationActive={false}
              fill="#3b82f6"
              className="chart-background"
              shape={(props: any) => {
                const { x, y, width, height, payload } = props;
                return <rect x={x} y={y} width={2} height={height} fill="#3b82f6" />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      <div className="absolute -bottom-[15px] z-50 flex h-[20px] w-full select-none justify-between">
        {xAxisNumbers?.map((item) => (
          <span className="text-sm font-normal text-[#FFFFFFB5]">{item}</span>
        ))}
      </div>
      {/* Range Overlay */}
      {selectedTab === 'customRange' && (
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full pb-4">
          <div
            className="absolute top-0 h-[98%] bg-[#FF2C8B17]"
            style={{
              left: `${xScale(leftPrice)}px`,
              width: `${xScale(rightPrice) - xScale(leftPrice)}px`,
            }}
          />
          {/* left handle */}
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
            {/* percentage */}
            <div
              className="absolute top-0 flex w-[60px] select-none justify-center rounded-full border-2 border-gray-500 bg-box-background-secondary px-4 py-0.5 text-xs font-normal transition-all"
              style={{
                left: xScale(leftPrice) < 65 ? '10px' : '-65px',
              }}
            >
              {minPercentage.toFixed(0)}%
            </div>
          </div>
          {/* right handle */}
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
      )}
    </div>
  );
}

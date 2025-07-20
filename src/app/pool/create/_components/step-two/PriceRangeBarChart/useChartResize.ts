import { useEffect, useState } from 'react';

export default function useChartResize(containerRef: React.RefObject<HTMLDivElement>) {
  const [chartWidth, setChartWidth] = useState(200);

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
  }, [containerRef]);

  return { chartWidth };
}

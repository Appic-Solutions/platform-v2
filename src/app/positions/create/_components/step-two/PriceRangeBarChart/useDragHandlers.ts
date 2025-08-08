import { useCallback, useEffect, useRef, useState } from 'react';
import { ScaleLinear } from 'd3-scale';

export default function useDragHandlers(
  containerRef: React.RefObject<HTMLDivElement>,
  xScale: ScaleLinear<number, number>,
  leftPrice: number,
  rightPrice: number,
  setLeftPrice: (price: number) => void,
  setRightPrice: (price: number) => void,
  debouncedSetPrices: (left: number, right: number) => void,
) {
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const startLeftPrice = useRef(leftPrice);
  const startRightPrice = useRef(rightPrice);

  const handleLeftDrag = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let newPrice = xScale.invert(x);

      newPrice = Math.min(newPrice, rightPrice);
      setLeftPrice(newPrice);
      debouncedSetPrices(newPrice, rightPrice);
    },
    [xScale, rightPrice, setLeftPrice, debouncedSetPrices, containerRef],
  );

  const handleRightDrag = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let newPrice = xScale.invert(x);

      newPrice = Math.max(newPrice, leftPrice);

      setRightPrice(newPrice);
      debouncedSetPrices(leftPrice, newPrice);
    },
    [xScale, leftPrice, setRightPrice, debouncedSetPrices, containerRef],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handle: 'left' | 'right') => {
      e.preventDefault();
      setDragging(handle);
      startX.current = e.clientX;
      startLeftPrice.current = leftPrice;
      startRightPrice.current = rightPrice;
    },
    [leftPrice, rightPrice],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging === 'left') {
        handleLeftDrag(e.clientX);
      } else if (dragging === 'right') {
        handleRightDrag(e.clientX);
      }
    },
    [dragging, handleLeftDrag, handleRightDrag],
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, handle: 'left' | 'right') => {
      e.preventDefault();
      setDragging(handle);
      startX.current = e.touches[0].clientX;
      startLeftPrice.current = leftPrice;
      startRightPrice.current = rightPrice;
    },
    [leftPrice, rightPrice],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (dragging === 'left') {
        handleLeftDrag(e.touches[0].clientX);
      } else if (dragging === 'right') {
        handleRightDrag(e.touches[0].clientX);
      }
    },
    [dragging, handleLeftDrag, handleRightDrag],
  );

  const handleTouchEnd = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();
    const handleGlobalTouchMove = (e: TouchEvent) => handleTouchMove(e);
    const handleGlobalTouchEnd = () => handleTouchEnd();

    if (dragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalTouchMove);
      window.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [dragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return { dragging, setDragging, handleMouseDown, handleTouchStart };
}

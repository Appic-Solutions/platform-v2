import { useCallback, useEffect, useRef, useState } from 'react';
import { ScaleLinear } from 'd3-scale';
import { useWatch } from 'react-hook-form';
import { useCreatePosition } from '../../../_context/CreatePositionContext';
import { NORMALIZATION_FACTOR } from '.';
import BigNumber from 'bignumber.js';

/**
 * When editing values, use form values directly without making any requests (do not use minOrMaxHandler).
 * When submitting values, call minOrMaxHandler.
 * Submit triggers:
 *   - Price inputs: onBlur event
 *   - Chart: onMouseUp event
 **/

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

  const { createPositionForm, maxOrMinPriceHandler } = useCreatePosition();

  const [formMinPrice, formMaxPrice] = useWatch({
    control: createPositionForm.control,
    name: ['minPrice', 'maxPrice'],
  });

  useEffect(() => {
    try {
      const bnMin = formMinPrice === 'min' ? new BigNumber(0) : new BigNumber(formMinPrice);
      const bnMax = formMaxPrice === 'max' ? new BigNumber(Infinity) : new BigNumber(formMaxPrice);

      const compareResult = bnMax.comparedTo(bnMin);
      if (compareResult === null || compareResult === -1) return;

      const numMin = formMinPrice === 'min' ? 0 : BigNumber(formMinPrice).toNumber();
      const numMax = formMaxPrice === 'max' ? Infinity : BigNumber(formMaxPrice).toNumber();

      if (isNaN(numMin) || isNaN(numMax)) return;

      const normalizedMin = numMin / NORMALIZATION_FACTOR;
      const normalizedMax = numMax / NORMALIZATION_FACTOR;

      setLeftPrice(normalizedMin);
      setRightPrice(normalizedMax);
    } catch (e) {
      return;
    }
  }, [formMinPrice, formMaxPrice]);

  const handleLeftDrag = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const margin = 2;
      const minX = rect.left + margin;
      const maxX = rect.right - margin;
      const x = Math.max(minX, Math.min(clientX, maxX)) - rect.left;
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
      const margin = 2;
      const minX = rect.left + margin;
      const maxX = rect.right - margin;
      const x = Math.max(minX, Math.min(clientX, maxX)) - rect.left;
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
    maxOrMinPriceHandler({
      maxValue: formMaxPrice !== '0' && formMaxPrice !== '' ? formMaxPrice : 'max',
      minValue: formMinPrice !== '0' && formMinPrice !== '' ? formMinPrice : 'min',
    });

    setDragging(null);
  }, [formMinPrice, formMaxPrice]);

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

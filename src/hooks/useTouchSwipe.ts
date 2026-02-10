import { useRef, useCallback } from "react";
import type { SwipeConfig } from "../types";

export const useTouchSwipe = (config: SwipeConfig = {}) => {
  const { minSwipeDistance = 50 } = config;
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    // eslint-disable-next-line react-hooks/immutability
    return handleSwipe();
  }, []);

  const handleSwipe = useCallback(() => {
    if (!touchStartX.current || !touchEndX.current) return null;

    const distance = touchStartX.current - touchEndX.current;

    if (distance > minSwipeDistance) {
      return "right";
    } else if (distance < -minSwipeDistance) {
      return "left";
    }

    return null;
  }, [minSwipeDistance]);

  const resetTouch = useCallback(() => {
    touchStartX.current = 0;
    touchEndX.current = 0;
  }, []);

  return {
    handleTouchStart,
    handleTouchEnd,
    handleSwipe,
    resetTouch,
  };
};

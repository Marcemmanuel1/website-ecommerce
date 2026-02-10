import { useState, useCallback, useRef, useEffect } from "react";
import type { SliderConfig } from "../types";

interface UseSliderOptions extends SliderConfig {
  totalSlides: number;
}

export const useSlider = (options: UseSliderOptions) => {
  const {
    totalSlides,
    autoPlay = true,
    interval = 5000,
    transitionDuration = 700,
    pauseOnHover = true,
  } = options;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [isTransitioning, totalSlides, transitionDuration]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [isTransitioning, totalSlides, transitionDuration]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), transitionDuration);
    },
    [isTransitioning, currentSlide, transitionDuration],
  );

  const startSlider = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (autoPlay && totalSlides > 1) {
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          nextSlide();
        }
      }, interval) as unknown as number;
    }
  }, [autoPlay, interval, isPaused, nextSlide, totalSlides]);

  const stopSlider = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  }, [pauseOnHover]);

  useEffect(() => {
    startSlider();
    return () => {
      stopSlider();
    };
  }, [startSlider, stopSlider]);

  return {
    currentSlide,
    isTransitioning,
    nextSlide,
    prevSlide,
    goToSlide,
    handleMouseEnter,
    handleMouseLeave,
    startSlider,
    stopSlider,
    isPaused,
    setIsPaused,
  };
};

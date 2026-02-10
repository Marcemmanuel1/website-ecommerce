import { useState, useCallback, useRef, useEffect } from "react";

export const useHorizontalScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;

      setShowScrollLeft(scrollLeft > 10);
      setShowScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  }, []);

  const scrollLeft = useCallback((amount?: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = amount || container.clientWidth * 0.8;
      container.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollRight = useCallback((amount?: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = amount || container.clientWidth * 0.8;
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollToStart = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollToEnd = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [updateScrollButtons]);

  useEffect(() => {
    updateScrollButtons();
  }, [updateScrollButtons]);

  return {
    containerRef,
    showScrollLeft,
    showScrollRight,
    scrollLeft,
    scrollRight,
    scrollToStart,
    scrollToEnd,
    updateScrollButtons,
  };
};

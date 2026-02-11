import { useState, useEffect } from "react";

export const useMobileDetect = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < breakpoint);
      setIsTablet(width >= breakpoint && width < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return { isMobile, isTablet, windowWidth };
};

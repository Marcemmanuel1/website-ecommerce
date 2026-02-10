/* eslint-disable react-hooks/static-components */
import React from 'react';

interface ScrollNavigationProps {
  onScrollLeft: () => void;
  onScrollRight: () => void;
  showLeft: boolean;
  showRight: boolean;
  className?: string;
  position?: 'top' | 'center';
}

export const ScrollNavigation: React.FC<ScrollNavigationProps> = ({
  onScrollLeft,
  onScrollRight,
  showLeft,
  showRight,
  className = '',
  position = 'center'
}) => {
  const positionClass = position === 'top' ? 'top-4' : 'top-1/2 transform -translate-y-1/2';

  const LeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
    </svg>
  );

  const RightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <>
      {showLeft && (
        <button
          onClick={onScrollLeft}
          className={`absolute left-0 ${positionClass} z-10 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-300 ${className}`}
          aria-label="Défiler vers la gauche"
        >
          <LeftIcon />
        </button>
      )}

      {showRight && (
        <button
          onClick={onScrollRight}
          className={`absolute right-0 ${positionClass} z-10 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-300 ${className}`}
          aria-label="Défiler vers la droite"
        >
          <RightIcon />
        </button>
      )}
    </>
  );
};
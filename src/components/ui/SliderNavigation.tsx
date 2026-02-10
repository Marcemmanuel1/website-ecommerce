/* eslint-disable react-hooks/static-components */
import React from 'react';

interface SliderNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  className?: string;
  iconSize?: string;
  position?: 'inside' | 'outside';
  showLabels?: boolean;
  disabled?: boolean;
}

export const SliderNavigation: React.FC<SliderNavigationProps> = ({
  onPrev,
  onNext,
  className = '',
  iconSize = 'h-8 w-8',
  position = 'inside',
  showLabels = false,
  disabled = false
}) => {
  const PrevIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
    </svg>
  );

  const NextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
    </svg>
  );

  const positionClasses = position === 'outside'
    ? { prev: 'left-0', next: 'right-0' }
    : { prev: 'left-4 md:left-8', next: 'right-4 md:right-8' };

  return (
    <>
      <button
        onClick={onPrev}
        disabled={disabled}
        className={`absolute top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${positionClasses.prev} ${className}`}
        aria-label="Slide précédent"
      >
        <PrevIcon />
        {showLabels && <span className="sr-only">Précédent</span>}
      </button>

      <button
        onClick={onNext}
        disabled={disabled}
        className={`absolute top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${positionClasses.next} ${className}`}
        aria-label="Slide suivant"
      >
        <NextIcon />
        {showLabels && <span className="sr-only">Suivant</span>}
      </button>
    </>
  );
};
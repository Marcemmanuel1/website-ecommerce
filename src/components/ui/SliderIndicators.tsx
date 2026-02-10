import React from 'react';

interface SliderIndicatorsProps {
  totalSlides: number;
  currentSlide: number;
  onSlideClick: (index: number) => void;
  className?: string;
  indicatorClassName?: string;
  activeColor?: string;
  inactiveColor?: string;
  variant?: 'dots' | 'lines' | 'numbers';
}

export const SliderIndicators: React.FC<SliderIndicatorsProps> = ({
  totalSlides,
  currentSlide,
  onSlideClick,
  className = '',
  indicatorClassName = '',
  activeColor = 'bg-white',
  inactiveColor = 'bg-white/30',
  variant = 'lines'
}) => {
  if (totalSlides <= 1) return null;

  const renderIndicator = (index: number) => {
    const isActive = index === currentSlide;

    switch (variant) {
      case 'dots':
        return (
          <button
            key={index}
            onClick={() => onSlideClick(index)}
            className={`rounded-full transition-all duration-300 ${isActive ? activeColor : inactiveColor
              } ${indicatorClassName} ${isActive ? 'w-3 h-3' : 'w-2 h-2'}`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        );

      case 'numbers':
        return (
          <button
            key={index}
            onClick={() => onSlideClick(index)}
            className={`text-xs px-2 py-1 transition-all duration-300 ${isActive ? 'text-white font-medium border border-white' : 'text-white/50'
              }`}
            aria-label={`Aller au slide ${index + 1}`}
          >
            {index + 1}
          </button>
        );

      case 'lines':
      default:
        return (
          <button
            key={index}
            onClick={() => onSlideClick(index)}
            className={`h-px transition-all duration-300 ${isActive ? activeColor : inactiveColor
              } ${indicatorClassName}`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        );
    }
  };

  return (
    <div className={`flex ${className} ${variant === 'lines' ? 'flex-col space-y-2' :
        variant === 'numbers' ? 'space-x-2' :
          'space-x-2 items-center'
      }`}>
      {Array.from({ length: totalSlides }).map((_, index) => renderIndicator(index))}
    </div>
  );
};
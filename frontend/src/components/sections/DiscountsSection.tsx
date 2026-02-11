import React from 'react';
import type { HeroSlide } from '../../types';
import { useSlider, useTouchSwipe } from '../../hooks';
import { SliderNavigation } from '../ui/SliderNavigation';
import { SliderIndicators } from '../ui/SliderIndicators';

interface DiscountsSectionProps {
  slides: HeroSlide[];
  height?: string;
}

export const DiscountsSection: React.FC<DiscountsSectionProps> = ({
  slides,
  height = 'h-[70vh]'
}) => {
  const {
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    handleMouseEnter,
    handleMouseLeave
  } = useSlider({
    totalSlides: slides.length,
    autoPlay: true,
    interval: 5000,
    pauseOnHover: true
  });

  const { handleTouchStart, handleTouchEnd } = useTouchSwipe({
    minSwipeDistance: 50
  });

  const handleSwipe = () => {
    const swipeDirection = handleTouchEnd({} as never);
    if (swipeDirection === 'left') {
      prevSlide();
    } else if (swipeDirection === 'right') {
      nextSlide();
    }
  };

  if (slides.length === 0) return null;

  return (
    <section
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative ${height} overflow-hidden`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleSwipe}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            aria-hidden={index !== currentSlide}
          >
            <div className="container mx-auto px-4 md:px-8 h-full flex items-center">
              <div className="max-w-2xl">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl lg:text-6xl font-light tracking-tight mb-4 md:mb-6 text-white leading-none">
                    {slide.title}
                  </h2>
                  <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
                    {slide.subtitle}
                  </h3>
                  <p className="text-lg md:text-xl mb-6 md:mb-8 text-white/80 font-light tracking-wide">
                    {slide.description}
                  </p>
                </div>
                <a
                  href={slide.buttonLink}
                  className="inline-flex items-center border rounded-[50px] border-white px-8 md:px-12 py-3 md:py-4 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 group"
                >
                  {slide.buttonText}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-3 md:ml-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <SliderNavigation
            onPrev={prevSlide}
            onNext={nextSlide}
            className="hidden md:block"
          />

          <SliderIndicators
            totalSlides={slides.length}
            currentSlide={currentSlide}
            onSlideClick={goToSlide}
            className="absolute bottom-8 md:bottom-12 left-4 md:left-8"
            indicatorClassName="w-6 md:w-8"
            activeColor="bg-white"
            inactiveColor="bg-white/30"
          />
        </>
      )}
    </section>
  );
};
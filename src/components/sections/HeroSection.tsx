import React from 'react';
import type { HeroSlide } from '../../types';
import { useSlider, useTouchSwipe } from '../../hooks';
import { SliderNavigation } from '../ui/SliderNavigation';
import { SliderIndicators } from '../ui/SliderIndicators';

interface HeroSectionProps {
  slides: HeroSlide[];
  height?: string;
  showIndicators?: boolean;
  showNavigation?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  slides,
  height = 'h-[91vh]',
  showIndicators = true,
  showNavigation = true
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
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            aria-hidden={index !== currentSlide}
          >
            <div className="container mx-auto px-4 md:px-8 h-full flex items-center">
              <div className="max-w-2xl">
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight mb-4 md:mb-6 text-white leading-none">
                    {slide.title}
                  </h2>
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

      {showNavigation && slides.length > 1 && (
        <>
          <SliderNavigation
            onPrev={prevSlide}
            onNext={nextSlide}
            className="hidden md:block"
          />

          {/* Navigation mobile avec flèches */}
          <div className="md:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
            <button
              onClick={prevSlide}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Slide précédent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {showIndicators && (
              <SliderIndicators
                totalSlides={slides.length}
                currentSlide={currentSlide}
                onSlideClick={goToSlide}
                variant="numbers"
                activeColor="text-white"
                inactiveColor="text-white/50"
              />
            )}

            <button
              onClick={nextSlide}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Slide suivant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}

      {showIndicators && slides.length > 1 && (
        <div className="hidden md:block absolute bottom-8 md:bottom-12 left-4 md:left-8">
          <SliderIndicators
            totalSlides={slides.length}
            currentSlide={currentSlide}
            onSlideClick={goToSlide}
            indicatorClassName="w-6 md:w-8"
            activeColor="bg-white"
            inactiveColor="bg-white/30"
            variant="lines"
          />
        </div>
      )}
    </section>
  );
};
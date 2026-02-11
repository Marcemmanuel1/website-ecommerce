import React from 'react';
import type { Category } from '../../types';
import { useSlider, useTouchSwipe } from '../../hooks';
import { CategoryCard } from '../ui/CategoryCard';
import { SliderNavigation } from '../ui/SliderNavigation';
import { SliderIndicators } from '../ui/SliderIndicators';
import { goToCategory } from '../../utils';

interface CollectionsSectionProps {
  categories: Category[];
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({ categories }) => {
  const {
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    handleMouseEnter,
    handleMouseLeave
  } = useSlider({
    totalSlides: categories.length,
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

  const handleCategoryClick = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      goToCategory(category.name);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-8 md:mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-2 md:mb-4 text-gray-900">
              Collections
            </h2>
            <p className="text-xs md:text-sm tracking-widest uppercase text-gray-600">
              Explorez nos univers
            </p>
          </div>
          <a
            href="/collections"
            className="text-xs md:text-sm tracking-widest uppercase text-gray-600 hover:text-gray-900 transition-colors"
          >
            Tout voir →
          </a>
        </div>

        {/* Desktop Version - Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/categories/${category.name.toLowerCase()}`}
              className="group relative overflow-hidden block"
            >
              <CategoryCard
                category={category}
                onClick={handleCategoryClick}
                variant="desktop"
                showDiscount={false}
              />
            </a>
          ))}
        </div>

        {/* Mobile Version - Slider */}
        <div
          className="md:hidden relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleSwipe}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`flex transition-transform duration-700 ease-in-out`}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {categories.map((category) => (
              <div key={category.id} className="w-full flex-shrink-0 px-2">
                <a
                  href={`/categories/${category.name.toLowerCase()}`}
                  className="group relative block overflow-hidden rounded-lg"
                >
                  <CategoryCard
                    category={category}
                    onClick={handleCategoryClick}
                    variant="mobile"
                    showDiscount={false}
                  />
                </a>
              </div>
            ))}
          </div>

          {/* Mobile Navigation */}
          {categories.length > 1 && (
            <>
              <SliderNavigation
                onPrev={prevSlide}
                onNext={nextSlide}
                className="md:hidden"
                iconSize="h-6 w-6"
                position="inside"
              />

              <SliderIndicators
                totalSlides={categories.length}
                currentSlide={currentSlide}
                onSlideClick={goToSlide}
                className="flex justify-center space-x-2 mt-6"
                indicatorClassName="w-8"
                activeColor="bg-black"
                inactiveColor="bg-gray-300"
                variant="dots"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};
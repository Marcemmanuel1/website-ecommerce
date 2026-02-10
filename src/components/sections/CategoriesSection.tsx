import React from 'react';
import type { Category } from '../../types';
import { useSlider, useTouchSwipe } from '../../hooks';
import { CategoryCard } from '../ui/CategoryCard';
import { SliderNavigation } from '../ui/SliderNavigation';
import { SliderIndicators } from '../ui/SliderIndicators';
import { goToCategory } from '../../utils';
import { categoriesPerSlide, totalCategorySlides } from '../../constants/data';

interface CategoriesSectionProps {
  categories: Category[];
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  const {
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    handleMouseEnter,
    handleMouseLeave
  } = useSlider({
    totalSlides: totalCategorySlides,
    autoPlay: true,
    interval: 5000,
    pauseOnHover: true
  });

  const { handleTouchStart, handleTouchEnd } = useTouchSwipe({
    minSwipeDistance: 50
  });

  const handleSwipe = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const swipeDirection = handleTouchEnd({} as any);
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

  const getCategoriesForSlide = (slideIndex: number): Category[] => {
    const start = slideIndex * categoriesPerSlide;
    return categories.slice(start, start + categoriesPerSlide);
  };

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-2 text-gray-900">
              Catégories en Promotions
            </h2>
            <p className="text-[10px] md:text-sm tracking-widest uppercase text-gray-600">
              Jusqu'à -40% de réduction
            </p>
          </div>
          <a
            href="/categories"
            className="text-[10px] md:text-sm tracking-widest uppercase text-gray-600 hover:text-gray-900 transition-colors"
          >
            Tout voir →
          </a>
        </div>

        {/* Desktop Version - Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
                showDiscount={true}
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
            className={`flex transition-transform duration-500 ease-in-out`}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalCategorySlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {getCategoriesForSlide(slideIndex).map((category) => (
                    <a
                      key={category.id}
                      href={`/categories/${category.name.toLowerCase()}`}
                      className="group relative overflow-hidden block"
                    >
                      <CategoryCard
                        category={category}
                        onClick={handleCategoryClick}
                        variant="mobile"
                        showDiscount={true}
                      />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation */}
          {totalCategorySlides > 1 && (
            <>
              <SliderNavigation
                onPrev={prevSlide}
                onNext={nextSlide}
                className="md:hidden"
                iconSize="h-5 w-5"
                position="inside"
              />

              <SliderIndicators
                totalSlides={totalCategorySlides}
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
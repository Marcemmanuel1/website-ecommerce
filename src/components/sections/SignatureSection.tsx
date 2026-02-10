import React from 'react';
import type { Product } from '../../types';
import { useSlider, useHorizontalScroll, useTouchSwipe, useCart } from '../../hooks';
import { ProductCard } from '../ui/ProductCard';
import { ScrollNavigation } from '../ui/ScrollNavigation';
import { SliderNavigation } from '../ui/SliderNavigation';
import { SliderIndicators } from '../ui/SliderIndicators';
import { goToProductDetail } from '../../utils';

interface SignatureSectionProps {
  products: Product[];
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({ products }) => {
  const { addToCart } = useCart();
  const {
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    handleMouseEnter,
    handleMouseLeave
  } = useSlider({
    totalSlides: products.length,
    autoPlay: true,
    interval: 5000,
    pauseOnHover: true
  });

  const {
    containerRef,
    showScrollLeft,
    showScrollRight,
    scrollLeft,
    scrollRight,
    updateScrollButtons
  } = useHorizontalScroll();

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

  const handleProductClick = (productId: number) => {
    goToProductDetail(productId);
  };

  const handleAddToCart = (productId: number, e: React.MouseEvent) => {
    addToCart(productId, e);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-8 md:mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-2 md:mb-4 text-gray-900">
              Pièces Signature
            </h2>
            <p className="text-xs md:text-sm tracking-widest uppercase text-gray-600">
              Créations exclusives
            </p>
          </div>
          <a
            href="/products"
            className="hidden md:block text-sm tracking-widest uppercase text-gray-600 hover:text-gray-900 transition-colors"
          >
            Voir tous les articles →
          </a>
        </div>

        {/* Desktop Version - Horizontal Scroll */}
        <div className="hidden md:block relative">
          <ScrollNavigation
            onScrollLeft={() => scrollLeft()}
            onScrollRight={() => scrollRight()}
            showLeft={showScrollLeft}
            showRight={showScrollRight}
            className="-translate-x-4 translate-x-4"
          />

          <div
            ref={containerRef}
            className="flex overflow-x-auto pb-8 gap-6 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            onScroll={updateScrollButtons}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onClick={handleProductClick}
                variant="desktop"
              />
            ))}
          </div>
        </div>

        {/* Mobile Version - Slider */}
        <div className="md:hidden">
          <div
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleSwipe}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`flex transition-transform duration-500 ease-in-out`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {products.map((product) => (
                <div key={product.id} className="w-full flex-shrink-0 px-2">
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onClick={handleProductClick}
                    variant="mobile"
                  />
                </div>
              ))}
            </div>

            {/* Mobile Navigation */}
            {products.length > 1 && (
              <>
                <SliderNavigation
                  onPrev={prevSlide}
                  onNext={nextSlide}
                  className="md:hidden"
                  iconSize="h-5 w-5"
                  position="inside"
                />

                <SliderIndicators
                  totalSlides={products.length}
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

        <div className="text-center mt-8 md:mt-16">
          <a
            href="/products"
            className="inline-block border rounded-[50px] border-black px-8 md:px-12 py-3 md:py-4 text-sm tracking-widest uppercase text-black hover:bg-black hover:text-white transition-colors duration-300"
          >
            Voir tous nos articles
          </a>
        </div>
      </div>
    </section>
  );
};
import React from 'react';
import type { Product } from '../../types';
import { formatPrice } from '../../utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, e: React.MouseEvent) => void;
  onClick: (productId: number) => void;
  variant?: 'desktop' | 'mobile';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onClick,
  variant = 'desktop'
}) => {
  const isMobile = variant === 'mobile';

  return (
    <div
      className={`bg-white group relative cursor-pointer ${isMobile ? 'w-full' : 'flex-shrink-0 w-80'}`}
      onClick={() => onClick(product.id)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden mb-4">
        <div className={`overflow-hidden ${isMobile ? 'h-[400px]' : 'h-[400px]'}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10">
          {product.isNew && (
            <span className="inline-block px-3 py-1 bg-white text-black text-xs tracking-widest uppercase">
              Nouveau
            </span>
          )}
          {product.isSale && product.discountPercentage > 0 && (
            <span className="inline-block px-3 py-1 bg-black text-white text-xs tracking-widest uppercase ml-2">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={(e) => onAddToCart(product.id, e)}
          className={`absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white transition-colors duration-300 ${isMobile ? '' : 'opacity-0 group-hover:opacity-100'
            }`}
          aria-label="Ajouter au panier"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        {/* Overlay hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs tracking-widest uppercase mb-2 text-gray-600">
          {product.category}
        </p>
        <h3 className={`font-light mb-3 group-hover:text-gray-600 transition-colors text-gray-900 ${isMobile ? 'text-lg' : 'text-lg'
          }`}>
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <span className={`text-gray-900 ${isMobile ? 'text-lg' : 'text-lg'}`}>
              {formatPrice(product.price)}
            </span>
            {product.isSale && product.price < product.originalPrice && (
              <span className="ml-2 text-sm line-through text-gray-600">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
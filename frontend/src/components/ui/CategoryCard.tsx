import React from 'react';
import type { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  onClick: (categoryId: number) => void;
  variant?: 'desktop' | 'mobile';
  showDiscount?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  variant = 'desktop',
  showDiscount = true
}) => {
  const isMobile = variant === 'mobile';

  return (
    <div
      className="group relative overflow-hidden cursor-pointer"
      onClick={() => onClick(category.id)}
    >
      <div className={`overflow-hidden ${isMobile ? 'h-[400px]' : 'h-[500px]'}`}>
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Discount Badge */}
        {showDiscount && category.discountPercentage > 0 && (
          <div className={`absolute z-10 ${isMobile ? 'top-3 right-3' : 'top-4 right-4'}`}>
            <span className={`inline-block bg-red-600 text-white tracking-widest uppercase ${isMobile ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
              }`}>
              -{category.discountPercentage}%
            </span>
          </div>
        )}
      </div>

      <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'p-4' : 'p-8'
        }`}>
        <h3 className={`font-light text-white mb-2 ${isMobile ? 'text-lg' : 'text-2xl'
          }`}>
          {category.name}
        </h3>
        <p className={`text-white/80 ${isMobile ? 'text-xs' : 'text-sm'
          }`}>
          {category.count} pièces
        </p>

        {showDiscount && category.discountPercentage > 0 && (
          <p className={`text-red-300 font-medium mt-1 ${isMobile ? 'text-xs' : 'text-sm'
            }`}>
            Jusqu'à -{category.discountPercentage}% de réduction
          </p>
        )}

        <div className={`mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isMobile ? 'mt-2' : 'mt-4'
          }`}>
          <span className="inline-flex items-center text-white text-sm tracking-widest">
            {isMobile ? 'Voir' : 'Explorer la collection'}
            <svg xmlns="http://www.w3.org/2000/svg" className={`fill-none ml-2 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'
              }`} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};
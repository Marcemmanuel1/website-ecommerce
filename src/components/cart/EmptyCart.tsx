import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyCartProps {
  title?: string;
  subtitle?: string;
  showContinueShopping?: boolean;
}

const EmptyCart: React.FC<EmptyCartProps> = ({
  title = "Votre panier est vide",
  subtitle = "Explorez nos collections pour découvrir des pièces uniques",
  showContinueShopping = true,
}) => {
  return (
    <div className="text-center py-16 md:py-24">
      {/* Icône */}
      <div className="mb-8">
        <svg
          className="h-24 w-24 mx-auto text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>

      {/* Texte */}
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
          {title}
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Boutons d'action */}
      <div className="space-y-4">
        {showContinueShopping && (
          <Link
            to="/products"
            className="inline-block border border-black px-12 py-4 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300"
          >
            Découvrir nos collections
          </Link>
        )}

        <div className="pt-4">
          <Link
            to="/"
            className="text-sm tracking-widest uppercase text-gray-500 hover:text-black transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-16 pt-16 border-t border-gray-100">
        <h3 className="text-sm tracking-widest uppercase text-gray-500 mb-8">
          Vous pourriez aimer
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder pour les produits recommandés */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group">
              <div className="h-64 bg-gray-100 mb-4"></div>
              <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
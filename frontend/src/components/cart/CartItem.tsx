import React, { useState } from 'react';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import type { CartItem as CartItemType } from '../../types/cart';
import { formatPrice, validateQuantity, checkStockAvailability } from '../../utils/cartUtils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: number, quantity: number) => Promise<{ success: boolean; error?: string }>;
  onRemove: (itemId: number) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  isLoading = false
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = async (change: number) => {
    if (localLoading) return;

    const newQuantity = validateQuantity(item.quantity, change, item.availableStock);

    // Vérifier la disponibilité du stock
    const stockCheck = checkStockAvailability({ ...item, quantity: newQuantity });
    if (!stockCheck.isAvailable) {
      setError(stockCheck.message);
      return;
    }

    setLocalLoading(true);
    setError(null);

    const result = await onUpdateQuantity(item.id, newQuantity);

    if (!result.success && result.error) {
      setError(result.error);
    }

    setLocalLoading(false);
  };

  const handleRemove = async () => {
    if (localLoading) return;

    setLocalLoading(true);
    setError(null);

    await onRemove(item.id);

    setLocalLoading(false);
  };

  const totalPrice = item.price * item.quantity;
  const isOutOfStock = item.availableStock === 0;
  const isLowStock = item.availableStock < 5 && item.availableStock > 0;

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 pb-8 md:pb-12 border-b border-gray-100">
      {/* Image */}
      <div className="w-full md:w-48 lg:w-56 md:h-[240px] lg:h-[280px] h-[320px] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Infos */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Catégorie */}
          <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">
            {item.category}
          </p>

          {/* Nom */}
          <h3 className="text-lg md:text-xl font-light mb-3">
            {item.name}
          </h3>

          {/* Prix */}
          <div className="flex items-center gap-3 mb-4">
            <p className="text-lg font-medium">
              {formatPrice(item.price)}
            </p>
            {item.originalPrice && item.originalPrice > item.price && (
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(item.originalPrice)}
              </p>
            )}
          </div>

          {/* Options */}
          {(item.size || item.color) && (
            <div className="flex gap-4 mb-4">
              {item.size && (
                <div className="text-sm text-gray-600">
                  Taille: <span className="font-medium">{item.size}</span>
                </div>
              )}
              {item.color && (
                <div className="text-sm text-gray-600">
                  Couleur: <span className="font-medium">{item.color}</span>
                </div>
              )}
            </div>
          )}

          {/* Stock */}
          {isOutOfStock ? (
            <div className="text-sm text-red-600 font-medium mb-4">
              Épuisé
            </div>
          ) : isLowStock ? (
            <div className="text-sm text-amber-600 font-medium mb-4">
              Stock limité: {item.availableStock} disponible{item.availableStock > 1 ? 's' : ''}
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
          {/* Contrôle quantité */}
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={localLoading || isLoading || item.quantity <= 1}
              className={`p-2 border border-gray-200 rounded-l ${localLoading || isLoading || item.quantity <= 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50'
                }`}
              aria-label="Diminuer la quantité"
            >
              <FiMinus className="h-4 w-4" />
            </button>

            <div className="px-4 py-2 border-t border-b border-gray-200 min-w-[60px] text-center">
              <span className={localLoading || isLoading ? 'opacity-50' : ''}>
                {item.quantity}
              </span>
            </div>

            <button
              onClick={() => handleQuantityChange(1)}
              disabled={localLoading || isLoading || item.quantity >= item.availableStock}
              className={`p-2 border border-gray-200 rounded-r ${localLoading || isLoading || item.quantity >= item.availableStock
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50'
                }`}
              aria-label="Augmenter la quantité"
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>

          {/* Prix total et suppression */}
          <div className="flex items-center gap-6">
            {/* Prix total */}
            <div className="text-lg font-medium">
              {formatPrice(totalPrice)}
            </div>

            {/* Bouton suppression */}
            <button
              onClick={handleRemove}
              disabled={localLoading || isLoading}
              className={`text-gray-400 hover:text-red-600 transition-colors ${localLoading || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              aria-label="Supprimer l'article"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
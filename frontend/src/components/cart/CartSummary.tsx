import React, { useState } from 'react';
import type { Cart } from '../../types/cart';
import { formatPrice } from '../../utils/cartUtils';

interface CartSummaryProps {
  cart: Cart;
  onProceedToCheckout: () => void;
  onApplyDiscount?: (code: string) => Promise<{ success: boolean; error?: string }>;
  onRemoveDiscount?: () => Promise<void>;
  isLoading?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  onProceedToCheckout,
  onApplyDiscount,
  onRemoveDiscount,
  isLoading = false,
}) => {
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim() || !onApplyDiscount) return;

    setIsApplyingDiscount(true);
    setDiscountError(null);

    const result = await onApplyDiscount(discountCode);

    if (result.success) {
      setDiscountCode('');
    } else if (result.error) {
      setDiscountError(result.error);
    }

    setIsApplyingDiscount(false);
  };

  const handleRemoveDiscount = async () => {
    if (onRemoveDiscount) {
      await onRemoveDiscount();
    }
  };

  return (
    <div className="border border-gray-200 p-6 md:p-8 lg:p-10 h-fit sticky top-24">
      <h2 className="text-2xl font-light mb-8">Récapitulatif</h2>

      {/* Détails */}
      <div className="space-y-4 text-sm">
        {/* Sous-total */}
        <div className="flex justify-between items-center">
          <span className="tracking-widest uppercase text-gray-600">Sous-total</span>
          <span className="font-medium">{formatPrice(cart.subtotal)}</span>
        </div>

        {/* Livraison */}
        <div className="flex justify-between items-center">
          <span className="tracking-widest uppercase text-gray-600">Livraison</span>
          <span className="font-medium">
            {cart.shipping === 0 ? 'Gratuite' : formatPrice(cart.shipping)}
          </span>
        </div>

        {/* Code promo */}
        {onApplyDiscount && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value);
                  setDiscountError(null);
                }}
                placeholder="Code promo"
                className="flex-1 border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
                disabled={isApplyingDiscount || isLoading}
              />
              <button
                onClick={handleApplyDiscount}
                disabled={!discountCode.trim() || isApplyingDiscount || isLoading}
                className={`px-4 py-2 text-sm tracking-widest uppercase border border-black transition-colors ${!discountCode.trim() || isApplyingDiscount || isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-black hover:text-white'
                  }`}
              >
                {isApplyingDiscount ? '...' : 'Appliquer'}
              </button>
            </div>

            {discountError && (
              <p className="text-xs text-red-600 mt-1">{discountError}</p>
            )}
          </div>
        )}

        {/* Remise appliquée */}
        {cart.discount && cart.discount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span className="tracking-widest uppercase">
              Remise{cart.discountCode && ` (${cart.discountCode})`}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-medium">-{formatPrice(cart.discount)}</span>
              {onRemoveDiscount && (
                <button
                  onClick={handleRemoveDiscount}
                  className="text-xs text-gray-400 hover:text-gray-600"
                  aria-label="Supprimer la remise"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 mt-8 pt-6">
        <div className="flex justify-between items-center text-lg">
          <span className="font-light">Total</span>
          <div className="text-right">
            <div className="text-2xl font-light">{formatPrice(cart.total)}</div>
            <p className="text-xs text-gray-500 mt-1">TVA incluse</p>
          </div>
        </div>
      </div>

      {/* Bouton checkout */}
      <button
        onClick={onProceedToCheckout}
        disabled={isLoading || cart.items.length === 0}
        className={`w-full mt-8 py-4 text-sm tracking-widest uppercase border border-black transition-all duration-300 ${isLoading || cart.items.length === 0
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-black hover:text-white'
          }`}
      >
        {isLoading ? 'Chargement...' : 'Passer au paiement'}
      </button>

      {/* Lien continuer les achats */}
      <a
        href="/products"
        className="block mt-6 text-center text-xs tracking-widest uppercase text-gray-500 hover:text-black transition-colors"
      >
        Continuer vos achats
      </a>

      {/* Garanties */}
      <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Paiement sécurisé</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Retours gratuits sous 30 jours</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
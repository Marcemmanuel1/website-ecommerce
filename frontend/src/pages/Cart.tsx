import React, { useState } from 'react';
import CartLayout from '../components/cart/CartLayout';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useCart } from '../hooks/useCart';

const Cart: React.FC = () => {
  const {
    cart,
    isLoading,
    error,
    updateQuantity,
    removeFromCart,
    applyDiscount,
    removeDiscount,
    proceedToCheckout,
    getTotalItems,
    setError,
  } = useCart();

  const [removingItems, setRemovingItems] = useState<number[]>([]);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    const result = await updateQuantity(itemId, quantity);
    return result;
  };

  const handleRemoveItem = async (itemId: number) => {
    setRemovingItems(prev => [...prev, itemId]);
    const result = await removeFromCart(itemId);
    setRemovingItems(prev => prev.filter(id => id !== itemId));
    return result;
  };

  const handleApplyDiscount = async (code: string) => {
    const result = await applyDiscount(code);
    return result;
  };

  const handleRemoveDiscount = async () => {
    await removeDiscount();
  };

  // Affichage du chargement
  if (isLoading && cart.items.length === 0) {
    return (
      <CartLayout cartItemsCount={0}>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </CartLayout>
    );
  }

  // Panier vide
  if (cart.items.length === 0) {
    return (
      <CartLayout cartItemsCount={0}>
        <EmptyCart />
      </CartLayout>
    );
  }

  return (
    <CartLayout cartItemsCount={getTotalItems()}>
      {/* Erreur générale */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded">
          <div className="flex justify-between items-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Liste des articles */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-light">
              Vos articles ({getTotalItems()})
            </h2>
          </div>

          <div className="space-y-8">
            {cart.items.map((item) => (
              <CartItem
                key={`${item.id}-${item.size || ''}-${item.color || ''}`}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                isLoading={isLoading || removingItems.includes(item.id)}
              />
            ))}
          </div>

          {/* Actions supplémentaires */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => {
                  // Vider le panier
                  if (window.confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
                    // Implémenter la fonction clearCart si nécessaire
                    console.log('Vider le panier');
                  }
                }}
                className="text-sm tracking-widest uppercase text-gray-500 hover:text-black transition-colors"
              >
                Vider le panier
              </button>

              <a
                href="/products"
                className="text-sm tracking-widest uppercase text-gray-500 hover:text-black transition-colors"
              >
                Continuer vos achats
              </a>
            </div>
          </div>
        </div>

        {/* Récapitulatif */}
        <div className="lg:col-span-1">
          <CartSummary
            cart={cart}
            onProceedToCheckout={proceedToCheckout}
            onApplyDiscount={handleApplyDiscount}
            onRemoveDiscount={handleRemoveDiscount}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Informations complémentaires */}
      <div className="mt-16 pt-16 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <svg className="h-8 w-8 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-sm tracking-widest uppercase mb-2">Paiement sécurisé</h3>
            <p className="text-sm text-gray-600">Transactions cryptées SSL</p>
          </div>

          <div className="text-center">
            <svg className="h-8 w-8 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <h3 className="text-sm tracking-widest uppercase mb-2">Livraison gratuite</h3>
            <p className="text-sm text-gray-600">À partir de 50 000 XOF d'achat</p>
          </div>

          <div className="text-center">
            <svg className="h-8 w-8 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <h3 className="text-sm tracking-widest uppercase mb-2">Retours faciles</h3>
            <p className="text-sm text-gray-600">30 jours pour changer d'avis</p>
          </div>
        </div>
      </div>
    </CartLayout>
  );
};

export default Cart;
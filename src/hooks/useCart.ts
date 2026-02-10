import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem, Cart } from "../types/cart";
import { cartService } from "../services/cartService";
import { formatPrice } from "../utils/cartUtils";

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(() => {
    const localCart = cartService.getCartFromLocalStorage();
    return (
      localCart || {
        items: [],
        total: 0,
        subtotal: 0,
        shipping: 0,
      }
    );
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(false);
  const navigate = useNavigate();

  // Calculer les totaux
  const updateCartTotals = useCallback(
    (items: CartItem[], shipping: number = 0, discount: number = 0) => {
      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const total = subtotal + shipping - discount;

      const updatedCart = {
        items,
        total,
        subtotal,
        shipping,
        discount: discount > 0 ? discount : undefined,
      };

      setCart(updatedCart);
      cartService.saveCartToLocalStorage(updatedCart);

      return updatedCart;
    },
    [],
  );

  // Synchroniser le panier avec le serveur
  const syncCart = useCallback(async () => {
    if (!cartService.isUserAuthenticated() || isSynced) return;

    setIsLoading(true);
    try {
      const serverCart = await cartService.getCart();

      if (serverCart.items.length > 0) {
        setCart(serverCart);
        cartService.saveCartToLocalStorage(serverCart);
      } else if (cart.items.length > 0) {
        await cartService.syncCart(cart.items);
      }

      setIsSynced(true);
    } catch (err) {
      console.error("Sync cart failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [cart.items, isSynced]);

  // Ajouter au panier - Compatibilité avec votre version existante
  const addToCart = useCallback(
    async (productId: number, e?: React.MouseEvent) => {
      e?.stopPropagation();

      setIsLoading(true);
      setError(null);

      try {
        // Récupérer les détails du produit (à remplacer par un appel API)
        const productDetails = await getProductDetails(productId);

        const newItem: CartItem = {
          id: productId,
          name: productDetails.name,
          category: productDetails.category,
          price: productDetails.price,
          originalPrice: productDetails.originalPrice,
          image: productDetails.image,
          quantity: 1,
          availableStock: productDetails.availableStock || 10,
        };

        const existingItemIndex = cart.items.findIndex(
          (i) => i.id === productId,
        );
        let updatedItems: CartItem[];

        if (existingItemIndex > -1) {
          updatedItems = [...cart.items];
          const availableStock = updatedItems[existingItemIndex].availableStock;

          if (updatedItems[existingItemIndex].quantity < availableStock) {
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + 1,
            };
          } else {
            throw new Error("Stock insuffisant");
          }
        } else {
          updatedItems = [...cart.items, newItem];
        }

        updateCartTotals(updatedItems, cart.shipping, cart.discount || 0);

        // Animation feedback (votre code existant)
        if (e?.currentTarget) {
          const button = e.currentTarget as HTMLButtonElement;
          const originalBg = button.style.backgroundColor;
          button.style.backgroundColor = "#16a34a";

          setTimeout(() => {
            button.style.backgroundColor = originalBg;
          }, 300);
        }

        // Synchroniser avec le serveur si connecté
        if (cartService.isUserAuthenticated()) {
          await cartService.addToCart(productId, 1);
        }

        return { success: true, message: "Produit ajouté au panier" };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de l'ajout au panier";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [cart.items, cart.shipping, cart.discount, updateCartTotals],
  );

  // Mettre à jour la quantité
  const updateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      if (quantity < 1) {
        return removeFromCart(itemId);
      }

      setIsLoading(true);
      setError(null);

      try {
        const updatedItems = cart.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        );

        updateCartTotals(updatedItems, cart.shipping, cart.discount || 0);

        if (cartService.isUserAuthenticated()) {
          await cartService.updateQuantity(itemId, quantity);
        }

        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la mise à jour";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [cart.items, cart.shipping, cart.discount, updateCartTotals],
  );

  // Supprimer du panier
  const removeFromCart = useCallback(
    async (itemId: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedItems = cart.items.filter((item) => item.id !== itemId);
        updateCartTotals(updatedItems, cart.shipping, cart.discount || 0);

        if (cartService.isUserAuthenticated()) {
          await cartService.removeFromCart(itemId);
        }

        return { success: true, message: "Produit retiré du panier" };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la suppression";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [cart.items, cart.shipping, cart.discount, updateCartTotals],
  );

  // Vider le panier
  const clearCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      updateCartTotals([], 0, 0);

      if (cartService.isUserAuthenticated()) {
        await cartService.clearCart();
      }

      return { success: true, message: "Panier vidé" };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du vidage du panier";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [updateCartTotals]);

  // Vérifier si un produit est dans le panier (votre fonction existante)
  const isInCart = useCallback(
    (productId: number) => {
      return cart.items.some((item) => item.id === productId);
    },
    [cart.items],
  );

  // Mettre à jour la livraison
  const updateShipping = useCallback(
    async (shipping: number) => {
      updateCartTotals(cart.items, shipping, cart.discount || 0);
    },
    [cart.items, cart.discount, updateCartTotals],
  );

  // Appliquer un code promo
  const applyDiscount = useCallback(
    async (code: string) => {
      setIsLoading(true);
      setError(null);

      try {
        let discountAmount = 0;

        const discountCodes: Record<string, number> = {
          WELCOME10: 0.1,
          SUMMER20: 0.2,
          VIP30: 0.3,
        };

        if (discountCodes[code]) {
          discountAmount = cart.subtotal * discountCodes[code];

          updateCartTotals(cart.items, cart.shipping, discountAmount);

          if (cartService.isUserAuthenticated()) {
            await cartService.applyDiscount(code);
          }

          return {
            success: true,
            message: `Code promo appliqué : ${code} (-${formatPrice(discountAmount)})`,
          };
        } else {
          throw new Error("Code promo invalide");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Code promo invalide";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [cart.subtotal, cart.items, cart.shipping, updateCartTotals],
  );

  // Supprimer le code promo
  const removeDiscount = useCallback(async () => {
    updateCartTotals(cart.items, cart.shipping, 0);

    if (cartService.isUserAuthenticated()) {
      await cartService.removeDiscount();
    }
  }, [cart.items, cart.shipping, updateCartTotals]);

  // Naviguer vers le checkout
  const proceedToCheckout = useCallback(() => {
    if (cart.items.length === 0) {
      setError("Votre panier est vide");
      return;
    }

    if (cartService.isUserAuthenticated()) {
      navigate("/checkout");
    } else {
      localStorage.setItem("redirect_url", "/checkout");
      navigate("/login");
    }
  }, [cart.items.length, navigate]);

  // Calculer le nombre total d'articles
  const getTotalItems = useCallback(() => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart.items]);

  // Récupérer les IDs des produits (pour la compatibilité avec votre code existant)
  const cartItemsIds = cart.items.map((item) => item.id);

  // Effet pour synchroniser le panier
  useEffect(() => {
    syncCart();
  }, [syncCart]);

  return {
    // Votre interface existante
    cartItems: cartItemsIds,
    cartCount: getTotalItems(),
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,

    // Nouvelle interface étendue
    cart,
    isLoading,
    error,
    updateQuantity,
    updateShipping,
    applyDiscount,
    removeDiscount,
    proceedToCheckout,
    getTotalItems,
    isAuthenticated: cartService.isUserAuthenticated(),
    setError,
  };
};

// Fonction helper pour récupérer les détails du produit (à adapter)
const getProductDetails = async (productId: number) => {
  // À remplacer par un appel API réel
  const mockProducts = [
    {
      id: 1,
      name: "ROBE SCULPTURALE NOIR",
      category: "HAUTE COUTURE",
      price: 26600,
      originalPrice: 38000,
      image: "/robe-noir.jpg",
      availableStock: 5,
    },
    {
      id: 2,
      name: "SAC SCULPTÉ CUIR",
      category: "ACCESSOIRES",
      price: 28000,
      originalPrice: 35000,
      image: "/sac-en-cuir.jpg",
      availableStock: 10,
    },
    // Ajoutez d'autres produits selon vos besoins
  ];

  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    throw new Error("Produit non trouvé");
  }

  return product;
};

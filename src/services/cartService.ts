import type {
  CartItem,
  Cart,
  CartResponse,
  ShippingOption,
} from "../types/cart";

// Solution pour Vite : utiliser import.meta.env au lieu de process.env
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Configuration des headers avec authentification
const getHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Gestion des erreurs API
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "Une erreur est survenue",
    }));
    throw new Error(errorData.message || `Erreur ${response.status}`);
  }
  return response.json();
};

// Services du panier
export const cartService = {
  // Récupérer le panier
  async getCart(): Promise<Cart> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await handleResponse(response);
      return data.cart;
    } catch (error) {
      console.error("Get cart error:", error);
      // Retourner un panier vide en cas d'erreur
      return {
        items: [],
        total: 0,
        subtotal: 0,
        shipping: 0,
      };
    }
  },

  // Ajouter un produit au panier
  async addToCart(
    productId: number,
    quantity: number = 1,
    options?: { size?: string; color?: string },
  ): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          productId,
          quantity,
          ...options,
        }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Add to cart error:", error);
      throw error;
    }
  },

  // Mettre à jour la quantité d'un produit
  async updateQuantity(
    itemId: number,
    quantity: number,
  ): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ quantity }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Update quantity error:", error);
      throw error;
    }
  },

  // Supprimer un produit du panier
  async removeFromCart(itemId: number): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Remove from cart error:", error);
      throw error;
    }
  },

  // Vider le panier
  async clearCart(): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Clear cart error:", error);
      throw error;
    }
  },

  // Appliquer un code promo
  async applyDiscount(code: string): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/discount`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ code }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Apply discount error:", error);
      throw error;
    }
  },

  // Supprimer un code promo
  async removeDiscount(): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/discount`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Remove discount error:", error);
      throw error;
    }
  },

  // Récupérer les options de livraison
  async getShippingOptions(): Promise<ShippingOption[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/shipping-options`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await handleResponse(response);
      return data.options;
    } catch (error) {
      console.error("Get shipping options error:", error);
      // Retourner des options par défaut
      return [
        {
          id: 1,
          name: "Livraison Standard",
          description: "Livraison sous 5-7 jours ouvrables",
          price: 0,
          estimatedDays: 7,
        },
        {
          id: 2,
          name: "Livraison Express",
          description: "Livraison sous 2-3 jours ouvrables",
          price: 5000,
          estimatedDays: 3,
        },
      ];
    }
  },

  // Mettre à jour l'option de livraison
  async updateShippingOption(optionId: number): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/shipping`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ optionId }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Update shipping error:", error);
      throw error;
    }
  },

  // Synchroniser le panier local avec le serveur
  async syncCart(localItems: CartItem[]): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/sync`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ items: localItems }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Sync cart error:", error);
      throw error;
    }
  },

  // Sauvegarder le panier localement
  saveCartToLocalStorage(cart: Cart): void {
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  // Récupérer le panier depuis le localStorage
  getCartFromLocalStorage(): Cart | null {
    const cartStr = localStorage.getItem("cart");
    return cartStr ? JSON.parse(cartStr) : null;
  },

  // Vérifier si l'utilisateur est connecté
  isUserAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  },
};

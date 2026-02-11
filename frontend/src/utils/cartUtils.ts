import type { CartItem } from "../types/cart";

// Formater le prix
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Calculer le sous-total
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Calculer le total
export const calculateTotal = (
  items: CartItem[],
  shipping: number = 0,
  discount: number = 0,
): number => {
  const subtotal = calculateSubtotal(items);
  return subtotal + shipping - discount;
};

// Vérifier si le panier est vide
export const isCartEmpty = (items: CartItem[]): boolean => {
  return items.length === 0;
};

// Valider la quantité
export const validateQuantity = (
  currentQuantity: number,
  change: number,
  availableStock: number,
): number => {
  const newQuantity = currentQuantity + change;

  if (newQuantity < 1) return 1;
  if (newQuantity > availableStock) return availableStock;

  return newQuantity;
};

// Vérifier la disponibilité du stock
export const checkStockAvailability = (
  item: CartItem,
): {
  isAvailable: boolean;
  message: string;
} => {
  if (item.quantity > item.availableStock) {
    return {
      isAvailable: false,
      message: `Stock insuffisant. Disponible : ${item.availableStock}`,
    };
  }

  if (item.availableStock === 0) {
    return {
      isAvailable: false,
      message: "Produit épuisé",
    };
  }

  return {
    isAvailable: true,
    message: "",
  };
};

// Générer un récapitulatif du panier
export const generateCartSummary = (items: CartItem[]) => {
  const subtotal = calculateSubtotal(items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const uniqueItems = items.length;

  return {
    subtotal,
    itemCount,
    uniqueItems,
    formattedSubtotal: formatPrice(subtotal),
  };
};

// Formater les données pour l'API
export const formatCartForAPI = (items: CartItem[]) => {
  return items.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
    ...(item.size && { size: item.size }),
    ...(item.color && { color: item.color }),
  }));
};

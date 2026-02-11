export interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  availableStock: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discount?: number;
  discountCode?: string;
}

export interface CartUpdate {
  itemId: number;
  quantity: number;
}

export interface CartResponse {
  cart: Cart;
  message: string;
}

export interface ShippingOption {
  id: number;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

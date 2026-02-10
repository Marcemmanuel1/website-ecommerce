export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  isNew: boolean;
  isSale: boolean;
  discountPercentage: number;
}

export interface Category {
  id: number;
  name: string;
  count: number;
  image: string;
  discountPercentage: number;
}

export interface SliderConfig {
  autoPlay?: boolean;
  interval?: number;
  transitionDuration?: number;
  pauseOnHover?: boolean;
}

export interface SwipeConfig {
  minSwipeDistance?: number;
}

export interface Colors {
  black: string;
  darkGray: string;
  mediumGray: string;
  lightGray: string;
  white: string;
  accent: string;
  lightBg: string;
  border: string;
}

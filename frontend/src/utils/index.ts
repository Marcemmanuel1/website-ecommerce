export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const goToProductDetail = (productId: number): void => {
  window.location.href = `/detail?id=${productId}`;
};

export const goToCategory = (categoryName: string): void => {
  window.location.href = `/categories/${categoryName.toLowerCase()}`;
};

export const goToCollection = (collectionId: number): void => {
  window.location.href = `/collections/${collectionId}`;
};

export const calculateDiscountPercentage = (
  originalPrice: number,
  salePrice: number,
): number => {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export const debounce = <T extends (...args: never[]) => never>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: never[]) => never>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

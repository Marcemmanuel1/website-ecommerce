import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Types
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  isNew: boolean;
  isSale: boolean;
  discountPercentage: number;
  description?: string;
  sizes?: string[];
  colors?: string[];
  colorVariants?: number;
}

interface FilterOptions {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'discount';
}

const Product = () => {
  // Données complètes des produits avec prix en FCFA
  const allProductsData: Product[] = [
    {
      id: 1,
      name: "SWEAT COL ZIPPÉ BASIQUE",
      category: "VÊTEMENTS",
      price: 26264, // ~39.95 EUR converti à 657 FCFA/EUR
      originalPrice: 26264,
      image: "/article-un.jpg",
      isNew: false,
      isSale: false,
      discountPercentage: 0,
      description: "Sweat col zippé basique en coton",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Noir", "Gris", "Blanc", "Marine", "Beige", "Vert"],
      colorVariants: 6
    },
    {
      id: 2,
      name: "SANDALES À DOUBLE BRIDE",
      category: "CHAUSSURES",
      price: 19672, // ~29.95 EUR
      originalPrice: 19672,
      image: "/article-deux.jpg",
      isNew: false,
      isSale: false,
      discountPercentage: 0,
      description: "Sandales à double bride confortables",
      sizes: ["36", "37", "38", "39", "40", "41"],
      colors: ["Noir"]
    },
    {
      id: 3,
      name: "T-SHIRT IMPRIMÉ BIMATIÈRE",
      category: "VÊTEMENTS",
      price: 15078, // ~22.95 EUR
      originalPrice: 15078,
      image: "/article-trois.jpg",
      isNew: false,
      isSale: false,
      discountPercentage: 0,
      description: "T-shirt imprimé bimatière moderne",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Gris foncé", "Noir"]
    },
    {
      id: 4,
      name: "SANDALES À BRIDES",
      category: "CHAUSSURES",
      price: 19672, // ~29.95 EUR
      originalPrice: 19672,
      image: "/article-quatre.jpg",
      isNew: false,
      isSale: false,
      discountPercentage: 0,
      description: "Sandales à brides élégantes",
      sizes: ["36", "37", "38", "39", "40"],
      colors: ["Noir"]
    },
    {
      id: 5,
      name: "ROBE SCULPTURALE NOIR",
      category: "HAUTE COUTURE",
      price: 59114, // ~89.95 EUR
      originalPrice: 85395, // ~129.95 EUR
      image: "/article-dix-neuf.jpg",
      isNew: true,
      isSale: true,
      discountPercentage: 31,
      description: "Robe sculpturale en soie noire avec drapage asymétrique",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Noir", "Bordeaux"]
    },
    {
      id: 6,
      name: "BLOUSE SOIE PREMIUM",
      category: "SIGNATURE",
      price: 45962, // ~69.95 EUR
      originalPrice: 45962,
      image: "/article-cinq.jpg",
      isNew: true,
      isSale: false,
      discountPercentage: 0,
      description: "Blouse en soie pure avec col chemisier",
      sizes: ["S", "M", "L"],
      colors: ["Blanc", "Ecru", "Noir"]
    },
    {
      id: 7,
      name: "JUPE PLISSÉE",
      category: "AVANT-GARDE",
      price: 32827, // ~49.95 EUR
      originalPrice: 43330, // ~65.95 EUR
      image: "/article-six.jpg",
      isNew: false,
      isSale: true,
      discountPercentage: 24,
      description: "Jupe plissée à taille haute",
      sizes: ["XS", "S", "M"],
      colors: ["Noir", "Gris", "Bleu nuit"]
    },
    {
      id: 8,
      name: "SAC À MAIN STRUCTURÉ",
      category: "EXCLUSIVITÉ",
      price: 78834, // ~119.95 EUR
      originalPrice: 78834,
      image: "/sac-a-main.jpg",
      isNew: false,
      isSale: false,
      discountPercentage: 0,
      description: "Sac à main structuré en cuir pleine fleur",
      sizes: ["Unique"],
      colors: ["Noir", "Camel"]
    },
    {
      id: 9,
      name: "PULL EN MAILLE",
      category: "VÊTEMENTS",
      price: 30196, // ~45.95 EUR
      originalPrice: 30196,
      image: "/article-sept.jpg",
      isNew: true,
      isSale: false,
      discountPercentage: 0,
      description: "Pull en maille douce et confortable",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Beige", "Noir", "Gris"]
    },
    {
      id: 10,
      name: "BOTTINES EN CUIR",
      category: "CHAUSSURES",
      price: 59114, // ~89.95 EUR
      originalPrice: 78834, // ~119.95 EUR
      image: "/article-huit.jpg",
      isNew: false,
      isSale: true,
      discountPercentage: 25,
      description: "Bottines en cuir véritable",
      sizes: ["36", "37", "38", "39", "40", "41"],
      colors: ["Noir", "Marron"]
    },
    {
      id: 11,
      name: "CHEMISE OVERSIZE",
      category: "VÊTEMENTS",
      price: 26264, // ~39.95 EUR
      originalPrice: 26264,
      image: "/article-neuf.jpg",
      isNew: true,
      isSale: false,
      discountPercentage: 0,
      description: "Chemise oversize en coton",
      sizes: ["S", "M", "L"],
      colors: ["Blanc", "Bleu", "Rayé"]
    },
    {
      id: 12,
      name: "PANTALON TAILLEUR",
      category: "PRÊT-À-PORTER",
      price: 39396, // ~59.95 EUR
      originalPrice: 39396,
      image: "/article-dix.jpg",
      isNew: false,
      isSale: false,
      discountPercentage: 0,
      description: "Pantalon tailleur coupe droite",
      sizes: ["34", "36", "38", "40", "42"],
      colors: ["Noir", "Gris", "Beige"]
    },
    {
      id: 13,
      name: "MANTEAU LONG",
      category: "OUTERWEAR",
      price: 98535, // ~149.95 EUR
      originalPrice: 131380, // ~199.95 EUR
      image: "/article-onze.jpg",
      isNew: true,
      isSale: true,
      discountPercentage: 25,
      description: "Manteau long en laine mélangée",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Camel", "Noir", "Gris"]
    },
    {
      id: 14,
      name: "BASKETS MINIMALISTES",
      category: "CHAUSSURES",
      price: 52545, // ~79.95 EUR
      originalPrice: 52545,
      image: "/article-douze.jpg",
      isNew: false,
      isSale: false,
      discountPercentage: 0,
      description: "Baskets minimalistes en cuir",
      sizes: ["36", "37", "38", "39", "40", "41", "42"],
      colors: ["Blanc", "Noir"]
    },
    {
      id: 15,
      name: "ÉCHARPE EN LAINE",
      category: "ACCESSOIRES",
      price: 23627, // ~35.95 EUR
      originalPrice: 32827, // ~49.95 EUR
      image: "/article-treize.jpg",
      isNew: false,
      isSale: true,
      discountPercentage: 28,
      description: "Écharpe douce en laine mérinos",
      sizes: ["Unique"],
      colors: ["Beige", "Gris", "Noir", "Bordeaux"]
    },
    {
      id: 16,
      name: "ROBE MIDI FLUIDE",
      category: "VÊTEMENTS",
      price: 45962, // ~69.95 EUR
      originalPrice: 45962,
      image: "/article-quatorze.jpg",
      isNew: true,
      isSale: false,
      discountPercentage: 0,
      description: "Robe midi fluide pour toute occasion",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Noir", "Bleu nuit", "Bordeaux"]
    },
    {
      id: 17,
      name: "BLOUSON EN CUIR",
      category: "OUTERWEAR",
      price: 131380, // ~199.95 EUR
      originalPrice: 164225, // ~249.95 EUR
      image: "/article-quinze.jpg",
      isNew: false,
      isSale: true,
      discountPercentage: 20,
      description: "Blouson en cuir véritable",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Noir", "Marron"]
    },
    {
      id: 18,
      name: "LUNETTES DE SOLEIL",
      category: "ACCESSOIRES",
      price: 32827, // ~49.95 EUR
      originalPrice: 32827,
      image: "/article-seize.jpg",
      isNew: true,
      isSale: false,
      discountPercentage: 0,
      description: "Lunettes de soleil design moderne",
      sizes: ["Unique"],
      colors: ["Noir", "Écaille"]
    },
    {
      id: 19,
      name: "JEAN SLIM FIT",
      category: "VÊTEMENTS",
      price: 39396, // ~59.95 EUR
      originalPrice: 39396,
      image: "/article-dix-sept.jpg",
      isNew: false,
      isSale: false,
      discountPercentage: 0,
      description: "Jean slim fit confortable",
      sizes: ["28", "30", "32", "34", "36"],
      colors: ["Bleu foncé", "Noir", "Gris"]
    },
    {
      id: 20,
      name: "CARDIGAN LONG",
      category: "VÊTEMENTS",
      price: 45962, // ~69.95 EUR
      originalPrice: 59114, // ~89.95 EUR
      image: "/article-dix-huit.jpg",
      isNew: true,
      isSale: true,
      discountPercentage: 22,
      description: "Cardigan long en maille fine",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Beige", "Gris", "Noir"]
    }
  ];

  // États
  const [allProducts] = useState<Product[]>(allProductsData);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerLoad = 8;

  // Filtres
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: { min: 0, max: 250000 },
    sortBy: 'featured'
  });

  const [cartItems, setCartItems] = useState<number[]>([]);

  // Ref pour l'infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Détection mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Initialisation
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFilteredProducts(allProducts);
      setDisplayedProducts(allProducts.slice(0, itemsPerLoad));
      setLoading(false);
      setHasMore(allProducts.length > itemsPerLoad);
    }, 500);
  }, []);

  // Application des filtres
  useEffect(() => {
    let result = [...allProducts];

    // Filtre par catégorie
    if (filters.categories.length > 0) {
      result = result.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Filtre par prix
    result = result.filter(product =>
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max
    );

    // Tri
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'discount':
        result.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      default:
        result.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          if (a.isSale && !b.isSale) return -1;
          if (!a.isSale && b.isSale) return 1;
          return 0;
        });
    }

    setFilteredProducts(result);
    setDisplayedProducts(result.slice(0, itemsPerLoad));
    setPage(1);
    setHasMore(result.length > itemsPerLoad);
  }, [filters, allProducts]);

  // Charger plus de produits
  const loadMoreProducts = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * itemsPerLoad;
      const endIndex = startIndex + itemsPerLoad;
      const newProducts = filteredProducts.slice(startIndex, endIndex);

      if (newProducts.length > 0) {
        setDisplayedProducts(prev => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(endIndex < filteredProducts.length);
      } else {
        setHasMore(false);
      }

      setLoadingMore(false);
    }, 800);
  }, [page, filteredProducts, loadingMore, hasMore]);

  // Intersection Observer pour l'infinite scroll
  useEffect(() => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreProducts, hasMore, loadingMore, loading]);

  // Format prix en FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Ajouter au panier
  const addToCart = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCartItems(prev => [...prev, productId]);
  };

  // Redirection vers détail
  const goToProductDetail = (productId: number) => {
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = `/detail?id=${productId}`;
  };

  // Gestion des filtres
  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 250000 },
      sortBy: 'featured'
    });
  };

  const handleCartClick = () => {
    alert(`Vous avez ${cartItems.length} articles dans votre panier`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartItemsCount={cartItems.length} onCartClick={handleCartClick} />
        <div className="container mx-auto px-4 py-24 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartItemsCount={cartItems.length} onCartClick={handleCartClick} />

      {/* Main Content */}
      <div className="container mt-10 mx-auto px-4 max-w-7xl pb-16">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Products Grid */}
          <main className="flex-1">
            {displayedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 mb-4">Aucun produit trouvé</p>
                <button
                  onClick={clearFilters}
                  className="border border-black px-6 py-2 text-sm hover:bg-black hover:text-white"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                {/* Grid Style de l'image */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {displayedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group cursor-pointer relative"
                      onClick={() => goToProductDetail(product.id)}
                    >
                      {/* Image Container */}
                      <div className="relative bg-gray-100 mb-3 overflow-hidden">
                        <div className="aspect-square h-[250px] md:h-[400px] lg:h-[450px] w-full overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Bouton Add to Cart - Toujours visible sur mobile, au hover sur desktop */}
                        <button
                          onClick={(e) => addToCart(product.id, e)}
                          className={`absolute top-3 right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${isMobile
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                            } hover:bg-gray-100 hover:scale-110 active:scale-95`}
                          aria-label="Ajouter au panier"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.isNew && (
                            <span className="bg-black text-white text-xs px-2 py-1">
                              NOUVEAU
                            </span>
                          )}
                          {product.isSale && (
                            <span className="bg-red-600 text-white text-xs px-2 py-1">
                              -{product.discountPercentage}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div>
                        <h3 className="text-sm mb-1 line-clamp-2 font-light" style={{ color: '#333' }}>
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-light">
                            {formatPrice(product.price)}
                          </span>
                          {product.isSale && product.originalPrice > product.price && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Loading More Indicator */}
                <div ref={loadMoreRef} className="py-8 flex justify-center">
                  {loadingMore && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                      <span className="text-sm">Chargement...</span>
                    </div>
                  )}
                  {!hasMore && displayedProducts.length > 0 && (
                    <p className="text-sm text-gray-500">Tous les articles ont été chargés</p>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;
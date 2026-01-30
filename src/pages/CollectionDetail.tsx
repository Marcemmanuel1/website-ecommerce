import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
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

interface Collection {
  id: number;
  name: string;
  description: string;
  items: number;
  image: string;
  season: string;
  year: number;
  isNew: boolean;
  detailedDescription: string;
  inspiration: string;
  lookbook: string[];
  products: Product[];
}

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // États pour les produits
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerLoad = 12;

  const [cartItems, setCartItems] = useState<number[]>([]);

  // Ref pour l'infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Données des collections avec produits
  const collectionsData: Collection[] = [
    {
      id: 1,
      name: "NÉBULEUSE URBAINE – PAGNE ÉDITION",
      description: "Collection contemporaine de vêtements en pagne africain, pensée pour une mode urbaine, moderne et accessible.",
      detailedDescription: "La collection Nébuleuse Urbaine – Pagne Édition revisite le pagne africain dans une esthétique minimaliste et urbaine. Les motifs traditionnels sont réinterprétés à travers des coupes modernes, des volumes structurés et des lignes fluides, offrant une mode élégante, identitaire et accessible au quotidien.",
      items: 42,
      image: "/haute-couture-pagne.jpg",
      season: "Automne-Hiver",
      year: 2025,
      isNew: true,
      inspiration: "Pagne africain, architecture urbaine, modernité africaine",
      lookbook: [
        "/lookbook-pagne-1.jpg",
        "/lookbook-pagne-2.jpg",
        "/lookbook-pagne-3.jpg",
        "/lookbook-pagne-4.jpg"
      ],
      products: [
        {
          id: 101,
          name: "Veste Architecturale en Pagne",
          category: "VESTES",
          price: 50000,
          originalPrice: 50000,
          image: "/article-pagne-1.jpg",
          isNew: true,
          isSale: false,
          discountPercentage: 0,
          description: "Veste structurée en pagne premium aux épaules marquées",
          sizes: ["S", "M", "L", "XL"],
          colors: ["Motifs noir-or", "Motifs indigo", "Motifs terre"],
          colorVariants: 3
        },
        {
          id: 102,
          name: "Pantalon Fluide en Pagne",
          category: "PANTALONS",
          price: 38000,
          originalPrice: 38000,
          image: "/article-pagne-2.jpg",
          isNew: true,
          isSale: false,
          discountPercentage: 0,
          description: "Pantalon ample en pagne léger favorisant le mouvement",
          sizes: ["S", "M", "L"],
          colors: ["Motifs noir", "Motifs beige", "Motifs bleu nuit"],
          colorVariants: 3
        },
        {
          id: 103,
          name: "Robe Monolithe en Pagne",
          category: "ROBES",
          price: 50000,
          originalPrice: 50000,
          image: "/article-pagne-3.jpg",
          isNew: true,
          isSale: false,
          discountPercentage: 0,
          description: "Robe longue en pagne aux lignes graphiques contemporaines",
          sizes: ["S", "M", "L"],
          colors: ["Motifs bordeaux", "Motifs noir", "Motifs gris"],
          colorVariants: 3
        },
        {
          id: 105,
          name: "Jupe Sculpturale en Pagne",
          category: "JUPES",
          price: 35000,
          originalPrice: 35000,
          image: "/article-pagne-5.jpg",
          isNew: false,
          isSale: false,
          discountPercentage: 0,
          description: "Jupe en pagne structurée à la coupe élégante",
          sizes: ["S", "M", "L"],
          colors: ["Motifs noir", "Motifs bleu nuit", "Motifs beige"],
          colorVariants: 3
        },
        {
          id: 106,
          name: "Top Asymétrique en Pagne",
          category: "HAUTS",
          price: 25000,
          originalPrice: 25000,
          image: "/article-pagne-6.jpg",
          isNew: false,
          isSale: false,
          discountPercentage: 0,
          description: "Top en pagne avec découpes asymétriques modernes",
          sizes: ["S", "M"],
          colors: ["Motifs noir", "Motifs beige"],
          colorVariants: 2
        },
        {
          id: 107,
          name: "Pull Léger Mixte Pagne",
          category: "PULLS",
          price: 42000,
          originalPrice: 42000,
          image: "/article-pagne-7.jpg",
          isNew: true,
          isSale: false,
          discountPercentage: 0,
          description: "Pull léger intégrant des empiècements en pagne",
          sizes: ["S", "M", "L", "XL"],
          colors: ["Noir", "Gris", "Beige"],
          colorVariants: 3
        },
        {
          id: 109,
          name: "Ensemble Tailleur en Pagne",
          category: "ENSEMBLES",
          price: 50000,
          originalPrice: 50000,
          image: "/article-pagne-8.jpg",
          isNew: true,
          isSale: false,
          discountPercentage: 0,
          description: "Ensemble tailleur moderne en pagne africain",
          sizes: ["S", "M", "L"],
          colors: ["Motifs noir", "Motifs gris"],
          colorVariants: 2
        }
      ]
    },
    {
      id: 2,
      name: "ÉCHO SILENCIEUX",
      description: "Dialogue entre matières et silence",
      detailedDescription: "Écho Silencieux est une collection qui célèbre la puissance du minimalisme. Chaque pièce est conçue comme une note dans une partition visuelle, où les matières dialoguent dans une harmonie subtile.",
      items: 36,
      image: "/bijoux.jpg",
      season: "Printemps-Été",
      year: 2025,
      isNew: true,
      inspiration: "Le minimalisme japonais, les paysages désertiques, la poésie du silence",
      lookbook: [
        "/lookbook-5.jpg",
        "/lookbook-6.jpg",
        "/lookbook-7.jpg"
      ],
      products: [
        {
          id: 201,
          name: "Chemise Origami",
          category: "HAUTS",
          price: 65000,
          originalPrice: 65000,
          image: "/article-neuf.jpg",
          isNew: true,
          isSale: false,
          discountPercentage: 0,
          description: "Chemise aux plis structurés inspirée de l'origami",
          sizes: ["XS", "S", "M", "L"],
          colors: ["Blanc", "Ecru", "Noir"],
          colorVariants: 3
        },
        {
          id: 202,
          name: "Jupe Minimaliste",
          category: "JUPES",
          price: 72000,
          originalPrice: 72000,
          image: "/collection-deux.jpg",
          isNew: true,
          isSale: false,
          discountPercentage: 0,
          description: "Jupe aux lignes épurées",
          sizes: ["S", "M", "L"],
          colors: ["Noir", "Beige"],
          colorVariants: 2
        },
        {
          id: 203,
          name: "Robe Fluide",
          category: "ROBES",
          price: 125000,
          originalPrice: 125000,
          image: "/article-quatorze.jpg",
          isNew: true,
          isSale: false,
          discountPercentage: 0,
          description: "Robe fluide aux finitions invisibles",
          sizes: ["XS", "S", "M", "L"],
          colors: ["Noir", "Bleu nuit", "Vert sauge"],
          colorVariants: 3
        },
        {
          id: 204,
          name: "Pantalon Large",
          category: "PANTALONS",
          price: 95000,
          originalPrice: 95000,
          image: "/article-dix.jpg",
          isNew: false,
          isSale: false,
          discountPercentage: 0,
          description: "Pantalon large aux lignes épurées",
          sizes: ["S", "M", "L"],
          colors: ["Noir", "Beige", "Gris"],
          colorVariants: 3
        },
        {
          id: 205,
          name: "Veste Légère",
          category: "VESTES",
          price: 110000,
          originalPrice: 110000,
          image: "/article-un.jpg",
          isNew: true,
          isSale: false,
          discountPercentage: 0,
          description: "Veste légère aux finitions minimalistes",
          sizes: ["XS", "S", "M", "L"],
          colors: ["Beige", "Blanc", "Noir"],
          colorVariants: 3
        }
      ]
    },
    // Ajouter les autres collections...
  ];

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

  // Charger la collection
  useEffect(() => {
    const timer = setTimeout(() => {
      const foundCollection = collectionsData.find(c => c.id === parseInt(id || '0'));
      if (foundCollection) {
        setCollection(foundCollection);
        setDisplayedProducts(foundCollection.products.slice(0, itemsPerLoad));
        setHasMore(foundCollection.products.length > itemsPerLoad);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  // Charger plus de produits
  const loadMoreProducts = useCallback(() => {
    if (!collection || loadingMore || !hasMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * itemsPerLoad;
      const endIndex = startIndex + itemsPerLoad;
      const newProducts = collection.products.slice(startIndex, endIndex);

      if (newProducts.length > 0) {
        setDisplayedProducts(prev => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(endIndex < collection.products.length);
      } else {
        setHasMore(false);
      }

      setLoadingMore(false);
    }, 800);
  }, [collection, page, loadingMore, hasMore]);

  // Intersection Observer pour l'infinite scroll
  useEffect(() => {
    if (isLoading || !collection) return;

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
  }, [loadMoreProducts, hasMore, loadingMore, isLoading, collection]);

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
    e.preventDefault();
    setCartItems(prev => [...prev, productId]);
  };

  // Redirection vers détail produit
  const goToProductDetail = (productId: number) => {
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = `/detail?id=${productId}`;
  };

  const handleCartClick = () => {
    alert(`Vous avez ${cartItems.length} articles dans votre panier`);
  };

  const colors = {
    black: '#000000',
    darkGray: '#1a1a1a',
    mediumGray: '#333333',
    lightGray: '#666666',
    white: '#ffffff',
    accent: '#000000',
    lightBg: '#f5f5f5',
    border: '#e0e0e0'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm tracking-widest uppercase" style={{ color: colors.lightGray }}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartItemsCount={cartItems.length} onCartClick={handleCartClick} />
        <div className="container mx-auto px-8 py-32 text-center">
          <h1 className="text-4xl font-light mb-6" style={{ color: colors.darkGray }}>
            Collection non trouvée
          </h1>
          <Link
            to="/collections"
            className="inline-flex items-center border border-black px-6 py-3 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
          >
            Retour aux collections
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar cartItemsCount={cartItems.length} onCartClick={handleCartClick} />

      {/* Hero de la collection avec slider */}
      <section className="relative">
        <div className="h-[92vh] relative overflow-hidden">
          {/* Image principale de la collection */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${collection.image})`,
              opacity: selectedImage === 0 ? 1 : 0
            }}
          />

          {/* Images du lookbook */}
          {collection.lookbook.map((img, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{
                backgroundImage: `url(${img})`,
                opacity: selectedImage === index + 1 ? 1 : 0
              }}
            />
          ))}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Contenu hero */}
          <div className="container mx-auto px-8 h-full flex items-end pb-20 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-6xl lg:text-8xl font-light text-white mb-8 leading-none">
                {collection.name}
              </h1>
            </div>
          </div>

          {/* Navigation des images */}
          <div className="absolute bottom-12 right-8 flex space-x-3 z-10">
            <button
              onClick={() => setSelectedImage(0)}
              className={`w-12 h-px transition-all duration-300 ${selectedImage === 0 ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
              aria-label="Image principale"
            />
            {collection.lookbook.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index + 1)}
                className={`w-12 h-px transition-all duration-300 ${selectedImage === index + 1 ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                aria-label={`Lookbook ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Titre de la section produits */}
      <section className="pt-20 pb-8">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-light tracking-tight mb-2" style={{ color: colors.darkGray }}>
                Les Pièces de la Collection
              </h2>
              <p className="text-sm tracking-widest uppercase" style={{ color: colors.lightGray }}>
                {collection.products.length} articles disponibles
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm" style={{ color: colors.lightGray }}>
                Collection {collection.season} {collection.year}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grille des produits */}
      <section className="pb-20">
        <div className="container mx-auto px-8">
          {displayedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 mb-4">Aucun produit trouvé dans cette collection</p>
              <Link
                to="/collections"
                className="border border-black px-6 py-2 text-sm hover:bg-black hover:text-white transition-colors"
              >
                Voir toutes les collections
              </Link>
            </div>
          ) : (
            <>
              {/* Grid des produits - style similaire à la page Product */}
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
              <div ref={loadMoreRef} className="py-16 flex justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    <span className="text-sm tracking-widest uppercase">Chargement...</span>
                  </div>
                )}
                {!hasMore && displayedProducts.length > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">Tous les articles de la collection ont été chargés</p>
                    <div className="flex justify-center space-x-4">
                      <Link
                        to="/collections"
                        className="border border-black px-6 py-2 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
                      >
                        Voir toutes les collections
                      </Link>
                      <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="border border-gray-300 px-6 py-2 text-xs tracking-widest uppercase hover:border-black transition-colors"
                      >
                        Remonter en haut
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CollectionDetail;
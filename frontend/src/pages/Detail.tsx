import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface ProductDetail {
  id: number;
  name: string;
  category: string;
  description: string;
  detailedDescription: string;
  price: number;
  originalPrice: number;
  images: string[];
  isNew: boolean;
  isSale: boolean;
  discountPercentage: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  materials: string[];
  careInstructions: string[];
  stock: number;
  measurements?: {
    length?: string;
    waist?: string;
    bust?: string;
    hips?: string;
  };
  features?: string[];
  season?: string;
  designer?: string;
  productCode?: string;
}

const Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const productId = parseInt(searchParams.get('id') || '1');

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Données de détail des produits
  const productDetails: ProductDetail[] = [
    {
      id: 1,
      name: "ROBE SCULPTURALE NOIR",
      category: "PRÊT-À-PORTER",
      description: "Robe longue noire à coupe sculpturale et lignes architecturales",
      detailedDescription: "Cette robe sculpturale noire se distingue par une coupe architecturale pensée pour sublimer la silhouette. Confectionnée dans un tissu premium à la tenue impeccable, elle épouse le corps avec élégance tout en offrant une structure moderne. Son design minimaliste est rehaussé par des découpes précises et des finitions soignées, faisant de cette pièce un incontournable chic et intemporel.",
      price: 35000,
      originalPrice: 35000,
      images: [
        "/robe-noir.jpg",
        "/robe-un.jpg",
        "/robe-deux.jpg",
        "/robe-trois.jpg",
        "/robe-quatre.jpg"
      ],
      isNew: true,
      isSale: false,
      discountPercentage: 0,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Noir", hex: "#000000" },
        { name: "Vert sauge", hex: "#9CAF88" },
        { name: "Rouge bourdeau", hex: "#800020" },
        { name: "beige", hex: "#F5F5DC" }
      ],
      materials: [
        "Tissu premium structuré",
        "Mélange polyester et viscose",
        "Doublure satinée"
      ],
      careInstructions: [
        "Nettoyage à sec recommandé",
        "Repassage à basse température",
        "Éviter le blanchiment",
        "Conserver sur cintre",
        "Ne pas exposer longtemps au soleil"
      ],
      stock: 8,
      measurements: {
        length: "135 cm",
        bust: "86-92 cm",
        hips: "92-98 cm"
      },
      features: [
        "Coupe sculpturale",
        "Silhouette élégante et structurée",
        "Fermeture discrète au dos",
        "Taille marquée",
        "Finitions couture"
      ],
      season: "Collection Permanente",
      designer: "Atelier Couture",
      productCode: "RSN-001"
    },

    {
      id: 2,
      name: "ROBE SOIRÉE ASYMÉTRIQUE",
      category: "SOIRÉE",
      description: "Robe de soirée à l'épaule dénudée",
      detailedDescription: "Robe de soirée spectaculaire avec une ligne asymétrique et une épaule dénudée. Le tissu satiné reflète la lumière avec élégance, tandis que la fente latérale ajoute une touche de sensualité. Une pièce qui allie glamour et modernité pour vos événements les plus importants.",
      price: 18900,
      originalPrice: 27000,
      images: [
        "/robe-soiree-un.jpg",
        "/robe-soiree-deux.jpg"
      ],
      isNew: true,
      isSale: true,
      discountPercentage: 30,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Rouge passion", hex: "#DC143C" },
        { name: "Noir", hex: "#000000" },
        { name: "Argent", hex: "#C0C0C0" }
      ],
      materials: ["Satin de soie", "Doublure viscose"],
      careInstructions: [
        "Lavage à la main",
        "Repasser à l'envers",
        "Ne pas sécher en machine"
      ],
      stock: 8,
      features: [
        "Épaule dénudée",
        "Fente latérale",
        "Dos ouvert"
      ],
      season: "Automne-Hiver 2023",
      designer: "Sophie Martin",
      productCode: "M28325"
    },
    {
      id: 3,
      name: "ROBE MIDI FLUIDE",
      category: "PRÊT-À-PORTER",
      description: "Robe midi fluide en crêpe",
      detailedDescription: "Robe midi fluide en crêpe léger qui danse avec le mouvement. La coupe ajustée au buste et les manches ballon créent une silhouette féminine et romantique. Parfaite pour le jour comme pour le soir.",
      price: 12500,
      originalPrice: 12500,
      images: [
        "/robe-midi-un.jpg",
        "/robe-midi-deux.jpg"
      ],
      isNew: true,
      isSale: false,
      discountPercentage: 0,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Blanc cassé", hex: "#F5F5DC" },
        { name: "Rose poudré", hex: "#F8C8DC" },
        { name: "Bleu pétrole", hex: "#003153" }
      ],
      materials: ["Crêpe de soie", "Viscose"],
      careInstructions: [
        "Lavage délicat à 30°",
        "Repasser à basse température"
      ],
      stock: 15,
      features: [
        "Manches ballon",
        "Encolure carrée",
        "Poches intégrées"
      ],
      season: "Printemps-Été 2024",
      designer: "Camille Dubois",
      productCode: "M28326"
    },
    {
      id: 4,
      name: "ROBE COCKTAIL STRUCTURÉE",
      category: "COCKTAIL",
      description: "Robe cocktail à la taille corsetée",
      detailedDescription: "Robe cocktail qui sublime la silhouette avec sa taille corsetée et son jupon structuré. Les détails de broderie et les perles ajoutent une touche de sophistication. Idéale pour les cocktails et réceptions.",
      price: 16500,
      originalPrice: 22000,
      images: [
        "/robe-part-un.jpg",
        "/robe-part-deux.jpg",
        "/robe-part-trois.jpg"
      ],
      isNew: false,
      isSale: true,
      discountPercentage: 25,
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Noir", hex: "#000000" },
        { name: "Bordeaux", hex: "#800020" }
      ],
      materials: ["Taffetas", "Corset en coton", "Broderie perles"],
      careInstructions: [
        "Nettoyage à sec uniquement",
        "Conserver dans sa housse"
      ],
      stock: 6,
      features: [
        "Taille corsetée",
        "Jupon structuré",
        "Broderie main"
      ],
      season: "Automne-Hiver 2023",
      designer: "Anne-Claire",
      productCode: "M28327"
    },
    {
      id: 5,
      name: "ROBE MAXI ÉVASÉE",
      category: "JOURNÉE",
      description: "Robe maxi évasée en lin",
      detailedDescription: "Robe maxi évasée en lin biologique, parfaite pour les journées d'été. Le décolleté en V et les manches courtes ajoutent une touche d'élégance décontractée.",
      price: 8900,
      originalPrice: 12000,
      images: [
        "/robe-maxi-un.jpg",
        "/robe-maxi-deux.jpg",
        "/robe-maxi-trois.jpg"
      ],
      isNew: false,
      isSale: true,
      discountPercentage: 26,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Lin naturel", hex: "#FAF0E6" },
        { name: "Bleu denim", hex: "#1560BD" },
        { name: "Vert sauge", hex: "#9CAF88" }
      ],
      materials: ["Lin biologique", "Coton"],
      careInstructions: [
        "Lavage machine 40°",
        "Repasser humide"
      ],
      stock: 12,
      features: [
        "Tissu respirant",
        "Poches latérales",
        "Ceinture intégrée"
      ],
      season: "Printemps-Été 2024",
      designer: "Élise",
      productCode: "M28328"
    },
    {
      id: 6,
      name: "ROBE SOIRÉE SATIN",
      category: "SOIRÉE",
      description: "Robe en satin avec jupe drapée",
      detailedDescription: "Robe en satin avec jupe drapée. Une silhouette classique réinterprétée de manière moderne pour les occasions spéciales.",
      price: 14200,
      originalPrice: 19000,
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=30",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=30",
        "https://images.unsplash.com/photo-1585487000160-6eb9ce6b5aae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=30"
      ],
      isNew: true,
      isSale: true,
      discountPercentage: 25,
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Satin noir", hex: "#0A0A0A" },
        { name: "Ivoire", hex: "#FFFFF0" }
      ],
      materials: ["Satin duchesse", "Bonnetage rigide"],
      careInstructions: [
        "Nettoyage à sec",
        "Conserver sur mannequin"
      ],
      stock: 4,
      features: [
        "Bustier structuré",
        "Jupe drapée",
        "Fermeture dos"
      ],
      season: "Printemps-Été 2024",
      designer: "Marie",
      productCode: "M28329"
    }
  ];

  // Récupérer le produit actuel
  const currentProduct = productDetails.find(product => product.id === productId) || productDetails[0];

  // Produits similaires (exclure le produit actuel)
  const similarProducts = productDetails.filter(product => product.id !== currentProduct.id);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Simuler un chargement
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [productId]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      setSelectedImage((prev) =>
        prev < currentProduct.images.length - 1 ? prev + 1 : prev
      );
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      setSelectedImage((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  // Fonction pour formater le prix en FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price) + ' FCFA';
  };

  // Fonction pour ajouter au panier
  const addToCart = () => {
    if (!selectedSize && currentProduct.sizes.length > 0) {
      alert("Veuillez sélectionner une taille");
      return;
    }

    if (!selectedColor && currentProduct.colors.length > 0) {
      alert("Veuillez sélectionner une couleur");
      return;
    }

    const cartItem = {
      productId: currentProduct.id,
      name: currentProduct.name,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      price: currentProduct.price,
      image: currentProduct.images[0]
    };

    // Récupérer le panier existant
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Vérifier si l'article existe déjà avec la même taille et couleur
    const existingItemIndex = existingCart.findIndex((item: any) =>
      item.productId === cartItem.productId &&
      item.size === cartItem.size &&
      item.color === cartItem.color
    );

    if (existingItemIndex > -1) {
      // Mettre à jour la quantité si l'article existe déjà
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Ajouter le nouvel article
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));

    // Mettre à jour l'état
    setCartItems([...cartItems, currentProduct.id]);
    setIsAddedToCart(true);

    // Réinitialiser après 3 secondes
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 3000);
  };

  // Fonction pour naviguer vers un autre produit
  const navigateToProduct = (id: number) => {
    navigate(`/detail?id=${id}`);
    setSelectedImage(0);
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
    setIsAddedToCart(false);
    window.scrollTo(0, 0);
  };

  // Fonction pour gérer le clic sur le panier
  const handleCartClick = () => {
    alert(`Vous avez ${cartItems.length} articles dans votre panier`);
  };

  // Palette de couleurs
  const colors = {
    black: '#000000',
    darkGray: '#1a1a1a',
    mediumGray: '#333333',
    lightGray: '#666666',
    veryLightGray: '#999999',
    white: '#ffffff',
    accent: '#000000',
    lightBg: '#f5f5f5',
    border: '#e0e0e0'
  };

  // Incrémenter la quantité
  const incrementQuantity = () => {
    if (quantity < currentProduct.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Décrémenter la quantité
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Fonctions pour le carousel mobile
  const nextSlide = () => {
    if (currentSlide < similarProducts.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Touch handlers pour le carousel mobile
  const handleCarouselTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleCarouselTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar cartItemsCount={cartItems.length} onCartClick={handleCartClick} />

      {/* Main Product Section */}
      <section className="py-0">
        <div className="container mx-auto px-0 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16">
            {/* Left Column - Images Gallery */}
            <div className="relative">
              {/* Desktop: Vertical Scrolling Gallery */}
              <div className="hidden md:block">
                <div
                  ref={galleryRef}
                  className="space-y-0 overflow-y-auto h-screen snap-y snap-mandatory"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  <style>
                    {`
                      .space-y-0::-webkit-scrollbar {
                        display: none;
                      }
                    `}
                  </style>
                  {currentProduct.images.map((image, index) => (
                    <div
                      key={index}
                      className="w-full h-screen snap-start flex items-center justify-center bg-gray-50"
                    >
                      <img
                        src={image}
                        alt={`${currentProduct.name} - vue ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Scroll Indicator - Desktop */}
                <div className="absolute -left-15 top-1/4 transform -translate-y-1/2 flex flex-col items-center space-y-2 z-10">
                  <button
                    onClick={() => {
                      const gallery = galleryRef.current;
                      if (gallery) {
                        const scrollAmount = gallery.scrollTop - window.innerHeight;
                        gallery.scrollTo({ top: scrollAmount, behavior: 'smooth' });
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                    aria-label="Image précédente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                  </button>

                  <div className="flex flex-col space-y-2">
                    {currentProduct.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const gallery = galleryRef.current;
                          if (gallery) {
                            gallery.scrollTo({ top: window.innerHeight * index, behavior: 'smooth' });
                          }
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${selectedImage === index ? 'bg-black w-1.5 h-8' : 'bg-gray-300'
                          }`}
                        aria-label={`Aller à l'image ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const gallery = galleryRef.current;
                      if (gallery) {
                        const scrollAmount = gallery.scrollTop + window.innerHeight;
                        gallery.scrollTo({ top: scrollAmount, behavior: 'smooth' });
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                    aria-label="Image suivante"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile: Horizontal Slider */}
              <div className="md:hidden relative">
                <div
                  className="relative overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${selectedImage * 100}%)` }}
                  >
                    {currentProduct.images.map((image, index) => (
                      <div
                        key={index}
                        className="w-full flex-shrink-0"
                      >
                        <div className="h-[500px] bg-gray-50">
                          <img
                            src={image}
                            alt={`${currentProduct.name} - vue ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows - Mobile */}
                  {selectedImage > 0 && (
                    <button
                      onClick={() => setSelectedImage(prev => prev - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg z-10"
                      aria-label="Image précédente"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                  )}

                  {selectedImage < currentProduct.images.length - 1 && (
                    <button
                      onClick={() => setSelectedImage(prev => prev + 1)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg z-10"
                      aria-label="Image suivante"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Dots Indicator - Mobile */}
                <div className="flex justify-center space-x-2 mt-4 mb-6">
                  {currentProduct.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-1.5 rounded-full transition-all ${selectedImage === index ? 'bg-black w-8' : 'bg-gray-300 w-1.5'
                        }`}
                      aria-label={`Aller à l'image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="px-6 sm:px-8 lg:px-12 py-8 lg:py-12 flex flex-col">

              {/* Title */}
              <h1
                className="text-3xl sm:text-4xl font-light mb-8 leading-tight"
                style={{ color: colors.darkGray }}
              >
                {currentProduct.name}
              </h1>

              {/* Price */}
              <div className="mb-10">
                <span className="text-2xl font-light" style={{ color: colors.darkGray }}>
                  {formatPrice(currentProduct.price)}
                </span>
                {currentProduct.isSale && currentProduct.price < currentProduct.originalPrice && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg line-through" style={{ color: colors.veryLightGray }}>
                      {formatPrice(currentProduct.originalPrice)}
                    </span>
                    <span className="text-sm bg-red-50 text-red-600 px-2 py-1">
                      -{currentProduct.discountPercentage}%
                    </span>
                  </div>
                )}
              </div>

              {/* Sélection de la couleur */}
              {currentProduct.colors.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base font-light mb-4" style={{ color: colors.darkGray }}>
                    Couleur: {selectedColor || "Sélectionnez une couleur"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {currentProduct.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color.name)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-all ${selectedColor === color.name
                          ? 'border-black bg-gray-50'
                          : 'border-gray-300 hover:border-gray-400'
                          }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm" style={{ color: colors.mediumGray }}>
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sélection de la taille */}
              {currentProduct.sizes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base font-light mb-4" style={{ color: colors.darkGray }}>
                    Taille: {selectedSize || "Sélectionnez une taille"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {currentProduct.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex items-center justify-center border text-sm transition-all ${selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sélection de la quantité */}
              <div className="mb-10">
                <h3 className="text-base font-light mb-4" style={{ color: colors.darkGray }}>
                  Quantité
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-full">
                    <button
                      onClick={decrementQuantity}
                      className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-50 rounded-l-full transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center" style={{ color: colors.darkGray }}>
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-50 rounded-r-full transition-colors"
                      disabled={quantity >= currentProduct.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                id="add-to-cart-button"
                onClick={addToCart}
                className={`w-full py-5 px-8 text-white text-base hover:bg-white font-light rounded-full transition-all duration-300 mb-4 ${isAddedToCart
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-black hover:text-black hover:border-1"
                  }`}
                aria-label="Ajouter au panier"
                disabled={!selectedSize || !selectedColor}
              >
                {isAddedToCart
                  ? "Ajouté au panier ✓"
                  : !selectedSize || !selectedColor
                    ? "Sélectionnez taille et couleur"
                    : `Ajouter au panier - ${formatPrice(currentProduct.price * quantity)}`}
              </button>

              {/* Delivery Info */}
              <p
                className="text-sm mb-12 leading-relaxed"
                style={{ color: colors.mediumGray }}
              >
                Livraison le jour même ou le jour ouvré suivant, selon la disponibilité
                produit.
              </p>

              {/* Product Description */}
              <div className="mb-10">
                <p
                  className="text-base leading-relaxed mb-4"
                  style={{ color: colors.mediumGray }}
                >
                  {currentProduct.detailedDescription}
                </p>

                <button
                  className="text-sm underline hover:no-underline font-light"
                  style={{ color: colors.darkGray }}
                >
                  Voir plus
                </button>
              </div>

              {/* Collapsible Sections */}
              <div className="space-y-0 border-t" style={{ borderColor: colors.border }}>
                {/* Durability */}
                <details className="group border-b py-6" style={{ borderColor: colors.border }}>
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-base font-light" style={{ color: colors.darkGray }}>
                      Durabilité
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 transition-transform group-open:rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </summary>

                  <div
                    className="mt-6 text-sm leading-relaxed"
                    style={{ color: colors.mediumGray }}
                  >
                    <p>
                      Nos produits sont conçus pour durer. Fabriqués avec des matériaux de
                      première qualité et un savoir-faire exceptionnel, chaque pièce est
                      pensée pour résister à l'épreuve du temps tout en conservant son
                      élégance.
                    </p>
                  </div>
                </details>

                {/* Care Instructions */}
                <details className="group border-b py-6" style={{ borderColor: colors.border }}>
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-base font-light" style={{ color: colors.darkGray }}>
                      Entretien du produit
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 transition-transform group-open:rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </summary>

                  <div className="mt-6">
                    <ul
                      className="space-y-2 text-sm leading-relaxed"
                      style={{ color: colors.mediumGray }}
                    >
                      {currentProduct.careInstructions.map((instruction, index) => (
                        <li key={index}>• {instruction}</li>
                      ))}
                    </ul>
                  </div>
                </details>

                {/* Find in Store */}
                <details className="group border-b py-6" style={{ borderColor: colors.border }}>
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-base font-light" style={{ color: colors.darkGray }}>
                      Trouver ce produit en magasin
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 transition-transform group-open:rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </summary>

                  <div
                    className="mt-6 text-sm leading-relaxed"
                    style={{ color: colors.mediumGray }}
                  >
                    <p>
                      Ce produit est disponible dans nos boutiques sélectionnées. Contactez
                      notre service client au +33 1 23 45 67 89 pour connaître la
                      disponibilité près de chez vous.
                    </p>
                  </div>
                </details>
              </div>

              {/* Additional Links */}
              <div
                className="mt-8 space-y-0 border-t pt-8"
                style={{ borderColor: colors.border }}
              >
                <a
                  href="#"
                  className="flex justify-between items-center py-5 text-base font-light hover:bg-gray-50 transition-colors"
                  style={{ color: colors.darkGray }}
                >
                  <span>Livraison & Retours</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="flex justify-between items-center py-5 text-base font-light border-t hover:bg-gray-50 transition-colors"
                  style={{ color: colors.darkGray, borderColor: colors.border }}
                >
                  <span>L'Art d'Offrir</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 lg:py-24 border-t" style={{ borderColor: colors.border, backgroundColor: colors.lightBg }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12 lg:mb-16">
            <div className="mb-6 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight mb-2" style={{ color: colors.darkGray }}>
                Produits similaires
              </h2>
              <p className="text-sm tracking-wide" style={{ color: colors.veryLightGray }}>
                Découvrez notre sélection
              </p>
            </div>
            <a
              href="/products"
              className="text-sm tracking-wide hover:text-gray-600 transition-colors inline-block font-light"
              style={{ color: colors.mediumGray }}
            >
              Voir tous les produits →
            </a>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-3">
            {similarProducts
              .slice(0, 4)
              .map(product => (
                <div
                  key={product.id}
                  className="group cursor-pointer bg-white transition-shadow duration-300"
                  onClick={() => navigateToProduct(product.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigateToProduct(product.id);
                    }
                  }}
                  aria-label={`Voir les détails de ${product.name}`}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden mb-4">
                    <div className="h-[350px] sm:h-[400px] lg:h-[450px] overflow-hidden bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-10">
                      {product.isNew && (
                        <span className="inline-block px-3 py-1 bg-white text-black text-xs tracking-wide font-light">
                          Nouveau
                        </span>
                      )}
                      {product.isSale && product.discountPercentage > 0 && (
                        <span className="inline-block px-3 py-1 bg-black text-white text-xs tracking-wide font-light ml-2">
                          -{product.discountPercentage}%
                        </span>
                      )}
                    </div>

                    {/* Quick View */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white px-6 py-3 text-sm tracking-wide font-light">
                        Voir détails
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs tracking-wide mb-2 font-light" style={{ color: colors.veryLightGray }}>
                      {product.category}
                    </p>
                    <h3 className="text-base lg:text-lg font-light mb-2 group-hover:text-gray-600 transition-colors line-clamp-1" style={{ color: colors.darkGray }}>
                      {product.name}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-base lg:text-lg font-light" style={{ color: colors.darkGray }}>
                        {formatPrice(product.price)}
                      </span>
                      {product.isSale && product.price < product.originalPrice && (
                        <span className="ml-2 text-sm line-through font-light" style={{ color: colors.veryLightGray }}>
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Mobile Carousel - Un produit par slide */}
          <div className="md:hidden relative">
            <div
              ref={carouselRef}
              className="overflow-hidden"
              onTouchStart={handleCarouselTouchStart}
              onTouchMove={handleCarouselTouchEnd}
              onTouchEnd={handleCarouselTouchEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {similarProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div
                      className="group cursor-pointer bg-white hover:shadow-lg transition-shadow duration-300"
                      onClick={() => navigateToProduct(product.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigateToProduct(product.id);
                        }
                      }}
                      aria-label={`Voir les détails de ${product.name}`}
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden mb-4">
                        <div className="h-[400px] overflow-hidden bg-gray-100">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                        </div>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-10">
                          {product.isNew && (
                            <span className="inline-block px-3 py-1 bg-white text-black text-xs tracking-wide font-light">
                              Nouveau
                            </span>
                          )}
                          {product.isSale && product.discountPercentage > 0 && (
                            <span className="inline-block px-3 py-1 bg-black text-white text-xs tracking-wide font-light ml-2">
                              -{product.discountPercentage}%
                            </span>
                          )}
                        </div>

                        {/* Quick View */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="bg-white px-6 py-3 text-sm tracking-wide font-light">
                            Voir détails
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <p className="text-xs tracking-wide mb-2 font-light" style={{ color: colors.veryLightGray }}>
                          {product.category}
                        </p>
                        <h3 className="text-lg font-light mb-2 group-hover:text-gray-600 transition-colors line-clamp-1" style={{ color: colors.darkGray }}>
                          {product.name}
                        </h3>
                        <p className="text-sm mb-3 text-gray-600 line-clamp-2 font-light" style={{ color: colors.mediumGray }}>
                          {product.description}
                        </p>
                        <div className="flex items-center">
                          <span className="text-lg font-light" style={{ color: colors.darkGray }}>
                            {formatPrice(product.price)}
                          </span>
                          {product.isSale && product.price < product.originalPrice && (
                            <span className="ml-2 text-sm line-through font-light" style={{ color: colors.veryLightGray }}>
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows - Mobile Carousel */}
            {currentSlide > 0 && (
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg z-10 -ml-5"
                aria-label="Produit précédent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}

            {currentSlide < similarProducts.length - 1 && (
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg z-10 -mr-5"
                aria-label="Produit suivant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}

            {/* Dots Indicator - Mobile Carousel */}
            {similarProducts.length > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {similarProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all ${currentSlide === index ? 'bg-black w-6' : 'bg-gray-300 w-1.5'
                      }`}
                    aria-label={`Aller au produit ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* View More Button for Mobile */}
          {isMobile && similarProducts.length > 1 && (
            <div className="mt-10 text-center">
              <button
                onClick={() => navigate('/products')}
                className="border border-black px-8 py-4 text-sm tracking-wide font-light hover:bg-black hover:text-white transition-colors duration-300"
              >
                Voir plus de produits
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 border-t" style={{ borderColor: colors.border }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight mb-6" style={{ color: colors.darkGray }}>
              La perfection dans chaque détail
            </h2>
            <p className="mb-8 text-base lg:text-lg font-light" style={{ color: colors.mediumGray }}>
              Recevez nos conseils d'experts et l'accès exclusif aux nouvelles collections.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 border-b border-black px-4 py-4 text-center text-sm tracking-wide font-light focus:outline-none focus:border-gray-400 bg-transparent"
                required
              />
              <button
                type="submit"
                className="border rounded-full border-black px-8 py-4 text-sm tracking-wide font-light hover:bg-black hover:text-white transition-colors duration-300 whitespace-nowrap"
              >
                S'inscrire
              </button>
            </form>
            <p className="mt-6 text-xs font-light" style={{ color: colors.veryLightGray }}>
              En vous inscrivant, vous acceptez notre politique de confidentialité. Désabonnement à tout moment.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Detail;
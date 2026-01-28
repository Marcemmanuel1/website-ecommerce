import React, { useState, useEffect } from 'react';
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

  // Données de détail des produits - Robe en premier
  const productDetails: ProductDetail[] = [
    {
      id: 1,
      name: "ROBE SCULPTURALE NOIR",
      category: "HAUTE COUTURE",
      description: "Robe structurée à la coupe architecturale pour soirée",
      detailedDescription: "Cette robe sculpturale en noir profond est une pièce signature de notre collection Haute Couture Printemps-Été 2024. Taillée dans un tissu technique à fort maintien, elle épouse les courbes du corps tout en créant une silhouette avant-gardiste. Les détails de couture apparents et les empiècements structurés confèrent à cette robe une dimension architecturale unique. Parfaite pour les événements d'exception, elle est conçue pour faire sensation.",
      price: 26600,
      originalPrice: 38000,
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=70",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
      ],
      isNew: true,
      isSale: true,
      discountPercentage: 30,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Noir profond", hex: "#000000" },
        { name: "Bordeaux", hex: "#800020" },
        { name: "Vert émeraude", hex: "#50C878" }
      ],
      materials: ["Polyester technique premium", "Élasthanne 5%", "Doublure soie"],
      careInstructions: [
        "Nettoyage à sec uniquement",
        "Repasser à basse température",
        "Ne pas blanchir",
        "Sécher à plat",
        "Conserver sur cintre en bois"
      ],
      stock: 5,
      measurements: {
        length: "125 cm",
        waist: "Adaptable",
        bust: "Adaptable",
        hips: "Adaptable"
      },
      features: [
        "Coupe architecturale",
        "Dos ouvert avec lacets",
        "Fermeture invisible",
        "Tissu respirant",
        "Made in France"
      ],
      season: "Printemps-Été 2024",
      designer: "Émilie Laurent"
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
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1585487000160-6eb9ce6b5aae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
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
      designer: "Sophie Martin"
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
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=60",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=60"
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
      designer: "Camille Dubois"
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
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=50"
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
      designer: "Anne-Claire"
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
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=40"
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
      designer: "Élise"
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
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=30"
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
      designer: "Marie"
    }
  ];

  // Récupérer le produit actuel (robe par défaut)
  const currentProduct = productDetails.find(product => product.id === productId) || productDetails[0];

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

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price);
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
      quantity,
      price: currentProduct.price,
      image: currentProduct.images[0]
    };

    // Récupérer le panier existant
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(existingCart));

    // Mettre à jour l'état
    setCartItems([...cartItems, currentProduct.id]);
    setIsAddedToCart(true);

    // Réinitialiser après 3 secondes
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 3000);

    // Animation feedback
    const addButton = document.getElementById('add-to-cart-button');
    if (addButton) {
      addButton.classList.add('bg-green-600');
      setTimeout(() => {
        addButton.classList.remove('bg-green-600');
      }, 300);
    }
  };

  // Fonction pour augmenter/diminuer la quantité
  const increaseQuantity = () => {
    if (quantity < currentProduct.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
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

  // Palette de couleurs inspirée de Home.tsx
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar cartItemsCount={cartItems.length} onCartClick={handleCartClick} />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
          <a href="/" className="hover:text-gray-600 transition-colors" style={{ color: colors.lightGray }}>
            Accueil
          </a>
          <span className="mx-2" style={{ color: colors.lightGray }}>/</span>
          <a href="/products" className="hover:text-gray-600 transition-colors" style={{ color: colors.lightGray }}>
            Collections
          </a>
          <span className="mx-2" style={{ color: colors.lightGray }}>/</span>
          <a href={`/categories/${currentProduct.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-gray-600 transition-colors" style={{ color: colors.lightGray }}>
            {currentProduct.category}
          </a>
          <span className="mx-2" style={{ color: colors.lightGray }}>/</span>
          <span className="tracking-widest uppercase font-medium" style={{ color: colors.darkGray }}>
            {currentProduct.name}
          </span>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column - Images */}
            <div>
              {/* Main Image */}
              <div className="mb-4 sm:mb-6">
                <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden bg-gray-100">
                  <img
                    src={currentProduct.images[selectedImage]}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 sm:pb-4">
                {currentProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 overflow-hidden border transition-all duration-300 ${selectedImage === index ? 'border-black scale-105' : 'border-gray-200 hover:border-gray-400'}`}
                    aria-label={`Voir image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${currentProduct.name} - vue ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="px-2 sm:px-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                {currentProduct.isNew && (
                  <span className="inline-block px-3 py-1 bg-black text-white text-xs tracking-widest uppercase">
                    Nouvelle Collection
                  </span>
                )}
                {currentProduct.isSale && currentProduct.discountPercentage > 0 && (
                  <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs tracking-widest uppercase">
                    -{currentProduct.discountPercentage}%
                  </span>
                )}
                {currentProduct.season && (
                  <span className="inline-block px-3 py-1 border border-black text-black text-xs tracking-widest uppercase">
                    {currentProduct.season}
                  </span>
                )}
              </div>

              {/* Category */}
              <p className="text-xs tracking-widest uppercase mb-3 sm:mb-4" style={{ color: colors.lightGray }}>
                {currentProduct.category}
              </p>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-4 sm:mb-6" style={{ color: colors.darkGray }}>
                {currentProduct.name}
              </h1>

              {/* Designer */}
              {currentProduct.designer && (
                <p className="text-sm mb-3 sm:mb-4" style={{ color: colors.mediumGray }}>
                  Conçu par <span className="font-medium">{currentProduct.designer}</span>
                </p>
              )}

              {/* Short Description */}
              <p className="text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed" style={{ color: colors.mediumGray }}>
                {currentProduct.description}
              </p>

              {/* Price */}
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span className="text-2xl sm:text-3xl font-light" style={{ color: colors.darkGray }}>
                    {formatPrice(currentProduct.price)}
                  </span>
                  {currentProduct.isSale && currentProduct.price < currentProduct.originalPrice && (
                    <>
                      <span className="text-base sm:text-lg line-through" style={{ color: colors.lightGray }}>
                        {formatPrice(currentProduct.originalPrice)}
                      </span>
                      <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-red-50 text-red-600 font-medium">
                        Économisez {formatPrice(currentProduct.originalPrice - currentProduct.price)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Colors */}
              {currentProduct.colors.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-sm tracking-widest uppercase mb-3 sm:mb-4" style={{ color: colors.darkGray }}>
                    Couleur
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {currentProduct.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color.name)}
                        className={`flex flex-col items-center ${selectedColor === color.name ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                        aria-label={`Sélectionner la couleur ${color.name}`}
                      >
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 ${selectedColor === color.name ? 'border-black scale-110' : 'border-gray-300'} transition-all duration-300`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                        <span className="mt-1 sm:mt-2 text-xs text-center" style={{ color: colors.mediumGray }}>
                          {isMobile && color.name.length > 10 ? `${color.name.substring(0, 8)}...` : color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {currentProduct.sizes.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
                    <h3 className="text-sm tracking-widest uppercase mb-2 sm:mb-0" style={{ color: colors.darkGray }}>
                      Taille
                    </h3>
                    <a href="#" className="text-xs hover:text-gray-600 transition-colors flex items-center" style={{ color: colors.lightGray }}>
                      Guide des tailles
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {currentProduct.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 sm:px-6 sm:py-3 border text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 ${selectedSize === size ? 'bg-black text-white border-black scale-105' : 'border-gray-300 hover:border-black hover:bg-gray-50'}`}
                        aria-label={`Sélectionner la taille ${size}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="mb-8 sm:mb-10">
                <div className="flex items-center mb-4 sm:mb-6">
                  <h3 className="text-sm tracking-widest uppercase mr-4 sm:mr-8" style={{ color: colors.darkGray }}>
                    Quantité
                  </h3>
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={decreaseQuantity}
                      className="px-3 py-2 sm:px-4 sm:py-3 hover:bg-gray-50 transition-colors disabled:opacity-30"
                      disabled={quantity <= 1}
                      aria-label="Diminuer la quantité"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg" style={{ color: colors.darkGray }}>
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="px-3 py-2 sm:px-4 sm:py-3 hover:bg-gray-50 transition-colors disabled:opacity-30"
                      disabled={quantity >= currentProduct.stock}
                      aria-label="Augmenter la quantité"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    id="add-to-cart-button"
                    onClick={addToCart}
                    className={`flex-1 py-3 sm:py-4 text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 ${isAddedToCart ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
                    aria-label={isAddedToCart ? "Article ajouté au panier" : "Ajouter au panier"}
                  >
                    {isAddedToCart ? (
                      <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Ajoutée au panier
                      </span>
                    ) : (
                      'Ajouter au panier'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      addToCart();
                      navigate('/cart');
                    }}
                    className="flex-1 py-3 sm:py-4 border border-black text-xs sm:text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
                    aria-label="Acheter maintenant"
                  >
                    Acheter maintenant
                  </button>
                </div>

                {/* Stock Information */}
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm" style={{ color: colors.lightGray }}>
                  {currentProduct.stock > 5 ? (
                    <span className="text-green-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      En stock • Expédition sous 24-48h
                    </span>
                  ) : currentProduct.stock > 0 ? (
                    <span className="text-yellow-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Plus que {currentProduct.stock} pièce(s) disponible(s)
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Rupture de stock
                    </span>
                  )}
                </p>
              </div>

              {/* Detailed Description */}
              <div className="mb-8 sm:mb-10 border-t border-b py-6 sm:py-8" style={{ borderColor: colors.border }}>
                <h3 className="text-sm tracking-widest uppercase mb-4 sm:mb-6" style={{ color: colors.darkGray }}>
                  Description détaillée
                </h3>
                <p className="leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: colors.mediumGray }}>
                  {currentProduct.detailedDescription}
                </p>

                {/* Features */}
                {currentProduct.features && currentProduct.features.length > 0 && (
                  <div className="mt-4 sm:mt-6">
                    <h4 className="text-xs tracking-widest uppercase mb-2 sm:mb-3" style={{ color: colors.darkGray }}>
                      Caractéristiques
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                      {currentProduct.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-xs sm:text-sm" style={{ color: colors.mediumGray }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="border-t border-b py-6 sm:py-8" style={{ borderColor: colors.border }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {/* Materials */}
                  {currentProduct.materials.length > 0 && (
                    <div>
                      <h4 className="text-xs tracking-widest uppercase mb-2 sm:mb-3" style={{ color: colors.darkGray }}>
                        Composition
                      </h4>
                      <ul className="space-y-1 sm:space-y-2">
                        {currentProduct.materials.map((material, index) => (
                          <li key={index} className="text-xs sm:text-sm" style={{ color: colors.mediumGray }}>
                            {material}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Care Instructions */}
                  {currentProduct.careInstructions.length > 0 && (
                    <div>
                      <h4 className="text-xs tracking-widest uppercase mb-2 sm:mb-3" style={{ color: colors.darkGray }}>
                        Entretien
                      </h4>
                      <ul className="space-y-1 sm:space-y-2">
                        {currentProduct.careInstructions.map((instruction, index) => (
                          <li key={index} className="text-xs sm:text-sm" style={{ color: colors.mediumGray }}>
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Measurements */}
                  {currentProduct.measurements && (
                    <div>
                      <h4 className="text-xs tracking-widest uppercase mb-2 sm:mb-3" style={{ color: colors.darkGray }}>
                        Dimensions
                      </h4>
                      <ul className="space-y-1 sm:space-y-2">
                        {Object.entries(currentProduct.measurements).map(([key, value]) => (
                          <li key={key} className="text-xs sm:text-sm" style={{ color: colors.mediumGray }}>
                            <span className="capitalize">{key} : </span>
                            <span className="font-medium">{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products - Robes similaires avec navigation */}
      <section className="py-12 sm:py-16 lg:py-24 border-t" style={{ borderColor: colors.border, backgroundColor: colors.lightBg }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 sm:mb-12 lg:mb-16">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-light tracking-tight mb-2 sm:mb-4" style={{ color: colors.darkGray }}>
                Robes similaires
              </h2>
              <p className="text-xs sm:text-sm tracking-widest uppercase" style={{ color: colors.lightGray }}>
                Complétez votre dressing
              </p>
            </div>
            <a
              href="/categories/robes"
              className="text-xs sm:text-sm tracking-widest uppercase hover:text-gray-600 transition-colors inline-block"
              style={{ color: colors.lightGray }}
            >
              Voir toutes les robes →
            </a>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {productDetails
              .filter(product => product.id !== currentProduct.id)
              .slice(0, isMobile ? 2 : 4)
              .map(product => (
                <div
                  key={product.id}
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
                  <div className="relative overflow-hidden mb-3 sm:mb-4">
                    <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] overflow-hidden bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                      {product.isNew && (
                        <span className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-white text-black text-xs tracking-widest uppercase">
                          Nouveau
                        </span>
                      )}
                      {product.isSale && product.discountPercentage > 0 && (
                        <span className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-black text-white text-xs tracking-widest uppercase ml-1 sm:ml-2">
                          -{product.discountPercentage}%
                        </span>
                      )}
                    </div>

                    {/* Quick View */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm tracking-widest uppercase">
                        Voir détails
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    <p className="text-xs tracking-widest uppercase mb-1 sm:mb-2" style={{ color: colors.lightGray }}>
                      {product.category}
                    </p>
                    <h3 className="text-sm sm:text-base lg:text-lg font-light mb-1 sm:mb-2 group-hover:text-gray-600 transition-colors line-clamp-1" style={{ color: colors.darkGray }}>
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm mb-2 sm:mb-3 text-gray-600 line-clamp-2" style={{ color: colors.mediumGray }}>
                      {product.description}
                    </p>
                    <div className="flex items-center">
                      <span className="text-sm sm:text-base lg:text-lg font-light" style={{ color: colors.darkGray }}>
                        {formatPrice(product.price)}
                      </span>
                      {product.isSale && product.price < product.originalPrice && (
                        <span className="ml-2 text-xs sm:text-sm line-through" style={{ color: colors.lightGray }}>
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* View More Button for Mobile */}
          {isMobile && productDetails.filter(p => p.id !== currentProduct.id).length > 2 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/categories/robes')}
                className="border border-black px-6 py-3 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
              >
                Voir plus de robes
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 lg:py-24 border-t" style={{ borderColor: colors.border }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-light tracking-tight mb-4 sm:mb-6" style={{ color: colors.darkGray }}>
              La perfection dans chaque détail
            </h2>
            <p className="mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg" style={{ color: colors.mediumGray }}>
              Recevez nos conseils d'experts pour choisir et entretenir vos robes, ainsi que l'accès exclusif aux nouvelles collections.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 border-b border-black px-4 py-3 text-center text-xs sm:text-sm tracking-widest uppercase focus:outline-none focus:border-gray-400 bg-transparent"
                required
              />
              <button
                type="submit"
                className="border rounded-[50px] border-black px-6 sm:px-8 py-3 text-xs sm:text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300 whitespace-nowrap"
              >
                S'inscrire à la newsletter
              </button>
            </form>
            <p className="mt-4 sm:mt-6 text-xs" style={{ color: colors.lightGray }}>
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
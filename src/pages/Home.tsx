import React, { useState, useEffect, useCallback, useRef } from 'react';

// Types pour une meilleure typage
interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  isNew: boolean;
  isSale: boolean;
}

interface Category {
  id: number;
  name: string;
  count: number;
  image: string;
}

const Home = () => {
  // État pour le slider hero
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // État pour le slider des produits
  const [currentProductSlide, setCurrentProductSlide] = useState(0);
  const [isProductTransitioning, setIsProductTransitioning] = useState(false);
  const productsPerPage = 4;
  const totalProductSlides = Math.ceil(8 / productsPerPage); // Nous avons 8 produits

  // État pour le panier
  const [cartItems, setCartItems] = useState<number[]>([]);

  // État pour la newsletter
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Références pour les intervalles
  const sliderIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const productSliderIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Données des slides du hero
  const heroSlides: HeroSlide[] = [
    {
      id: 1,
      title: "COLLECTION PRINTEMPS-ÉTÉ 2026",
      subtitle: "L'élégance renaît",
      description: "Des pièces exclusives dessinées pour sublimer votre silhouette",
      image: "/hero-section-un.jpg",
      buttonText: "EXPLORER",
      buttonLink: "/collection"
    },
    {
      id: 2,
      title: "ÉDITION LIMITÉE",
      subtitle: "Pièces uniques",
      description: "Chaque création est une œuvre d'art à porter",
      image: "/hero-section-deux.jpeg",
      buttonText: "DÉCOUVRIR",
      buttonLink: "/sales"
    },
    {
      id: 3,
      title: "L'ART DE L'ACCESSOIRE",
      subtitle: "Sculptez votre style",
      description: "Bijoux et accessoires qui racontent votre histoire",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: "EXPLORER",
      buttonLink: "/new-arrivals"
    }
  ];

  // Données des produits
  const products: Product[] = [
    {
      id: 1,
      name: "ROBE SCULPTURALE NOIR",
      category: "HAUTE COUTURE",
      price: 12500,
      originalPrice: 18000,
      image: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      isSale: true
    },
    {
      id: 2,
      name: "BLOUSE SOIE NATURELLE",
      category: "SIGNATURE",
      price: 22000,
      originalPrice: 22000,
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      isSale: false
    },
    {
      id: 3,
      name: "JUPE ARCHITECTURALE",
      category: "AVANT-GARDE",
      price: 15500,
      originalPrice: 21000,
      image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: false,
      isSale: true
    },
    {
      id: 4,
      name: "TALLAIRE SUR MESURE",
      category: "EXCLUSIVITÉ",
      price: 35000,
      originalPrice: 35000,
      image: "https://images.unsplash.com/photo-1624380741-811b28d0e8f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: false,
      isSale: false
    },
    {
      id: 5,
      name: "SAC SCULPTÉ CUIR",
      category: "ACCESSOIRES",
      price: 28000,
      originalPrice: 35000,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      isSale: true
    },
    {
      id: 6,
      name: "PARURE OR 18K",
      category: "BIJOUX",
      price: 8500,
      originalPrice: 12000,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: false,
      isSale: true
    },
    {
      id: 7,
      name: "ESCARPINS ARCHITECTURAUX",
      category: "CHAUSSURES",
      price: 32000,
      originalPrice: 40000,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: true,
      isSale: false
    },
    {
      id: 8,
      name: "VESTE STRUCTURÉE",
      category: "OUTERWEAR",
      price: 27500,
      originalPrice: 34000,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      isNew: false,
      isSale: true
    }
  ];

  // Catégories
  const categories: Category[] = [
    { id: 1, name: "HAUTE COUTURE", count: 24, image: "/haute-couture.jpg" },
    { id: 2, name: "PRÊT-À-PORTER", count: 32, image: "/pret-a-porter.jpg" },
    { id: 3, name: "ACCESSOIRES", count: 18, image: "/sac-accessoire.jpg" },
    { id: 4, name: "BIJOUX", count: 45, image: "/bijoux.jpg" },
  ];

  // Fonction pour passer au slide suivant du hero
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, heroSlides.length]);

  // Fonction pour passer au slide précédent du hero
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, heroSlides.length]);

  // Fonction pour aller à un slide spécifique du hero
  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  // Fonctions pour le slider des produits
  const nextProductSlide = () => {
    if (isProductTransitioning) return;
    setIsProductTransitioning(true);
    setCurrentProductSlide((prev) => (prev + 1) % totalProductSlides);
    setTimeout(() => setIsProductTransitioning(false), 500);
  };

  const prevProductSlide = () => {
    if (isProductTransitioning) return;
    setIsProductTransitioning(true);
    setCurrentProductSlide((prev) => (prev - 1 + totalProductSlides) % totalProductSlides);
    setTimeout(() => setIsProductTransitioning(false), 500);
  };

  const goToProductSlide = (index: number) => {
    if (isProductTransitioning || index === currentProductSlide) return;
    setIsProductTransitioning(true);
    setCurrentProductSlide(index);
    setTimeout(() => setIsProductTransitioning(false), 500);
  };

  // Fonction pour obtenir les produits du slide courant
  const getCurrentProducts = () => {
    const start = currentProductSlide * productsPerPage;
    const end = start + productsPerPage;
    return products.slice(start, end);
  };

  // Gestion du slider automatique du hero
  const startHeroSlider = useCallback(() => {
    if (sliderIntervalRef.current) {
      clearInterval(sliderIntervalRef.current);
    }
    sliderIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, 5000);
  }, [nextSlide, isPaused]);

  // Gestion du slider automatique des produits
  const startProductSlider = useCallback(() => {
    if (productSliderIntervalRef.current) {
      clearInterval(productSliderIntervalRef.current);
    }
    productSliderIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        nextProductSlide();
      }
    }, 6000);
  }, [nextProductSlide, isPaused]);

  // Gestion des pauses
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Gestion des événements clavier pour l'accessibilité
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Auto-slide du hero
  useEffect(() => {
    startHeroSlider();
    return () => {
      if (sliderIntervalRef.current) {
        clearInterval(sliderIntervalRef.current);
      }
    };
  }, [startHeroSlider]);

  // Auto-slide des produits
  useEffect(() => {
    startProductSlider();
    return () => {
      if (productSliderIntervalRef.current) {
        clearInterval(productSliderIntervalRef.current);
      }
    };
  }, [startProductSlider]);

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price);
  };

  // Fonction pour calculer la réduction
  const calculateDiscount = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Fonction pour ajouter au panier
  const addToCart = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la redirection vers /detail
    setCartItems(prev => [...prev, productId]);
    // Animation feedback
    const button = e.currentTarget;
    button.classList.add('bg-green-600');
    setTimeout(() => {
      button.classList.remove('bg-green-600');
    }, 300);
  };

  // Fonction pour rediriger vers la page détail
  const goToProductDetail = (productId: number) => {
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = `/detail?id=${productId}`;
  };

  // Gestion de l'inscription à la newsletter
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => {
        alert('Merci pour votre inscription à notre newsletter !');
      }, 300);
    }
  };

  // Palette de couleurs minimaliste
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header minimaliste avec icônes */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-2xl tracking-widest font-light uppercase">
              CAPRICE
            </h1>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-12">
              {['Collections', 'Couture', 'Accessoires', 'Éditions', 'Studio'].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm tracking-widest uppercase hover:text-gray-600 transition-colors duration-300 relative group"
                  style={{ color: colors.lightGray }}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            {/* Icônes */}
            <div className="flex items-center space-x-8">
              <button
                className="hover:text-gray-600 transition-colors"
                aria-label="Rechercher"
                style={{ color: colors.lightGray }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <button
                className="hover:text-gray-600 transition-colors"
                aria-label="Compte"
                style={{ color: colors.lightGray }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              <button
                className="relative hover:text-gray-600 transition-colors"
                onClick={() => alert(`Vous avez ${cartItems.length} articles dans votre panier`)}
                aria-label="Panier"
                style={{ color: colors.lightGray }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs h-5 w-5 flex items-center justify-center text-xs">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative h-[90vh] overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="container mx-auto px-8 h-full flex items-center">
                <div className="max-w-2xl">
                  <div className="mb-8">
                    <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-6 text-white leading-none">
                      {slide.title}
                    </h2>
                    <p className="text-xl mb-8 text-white/80 font-light tracking-wide">
                      {slide.description}
                    </p>
                  </div>
                  <a
                    href={slide.buttonLink}
                    className="inline-flex items-center border border-white px-12 py-4 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 group"
                  >
                    {slide.buttonText}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Hero */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300"
          aria-label="Slide précédent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300"
          aria-label="Slide suivant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicateurs Hero */}
        <div className="absolute bottom-12 left-8 flex flex-col space-y-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-px w-8 transition-all duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/30'}`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Section Collections */}
      <section className="py-24">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-light tracking-tight mb-4" style={{ color: colors.darkGray }}>
                Collections
              </h2>
              <p className="text-sm tracking-widest uppercase" style={{ color: colors.lightGray }}>
                Explorez nos univers
              </p>
            </div>
            <a
              href="/collections"
              className="text-sm tracking-widest uppercase hover:text-gray-600 transition-colors"
              style={{ color: colors.lightGray }}
            >
              Tout voir →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/categories/${category.name.toLowerCase()}`}
                className="group relative overflow-hidden"
              >
                <div className="h-[500px] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-light text-white mb-2">{category.name}</h3>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center text-white text-sm tracking-widest">
                      Explorer
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section Produits Signature - SLIDER */}
      <section
        className="py-24"
        style={{ backgroundColor: colors.lightBg }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-light tracking-tight mb-4" style={{ color: colors.darkGray }}>
                Pièces Signature
              </h2>
              <p className="text-sm tracking-widest uppercase" style={{ color: colors.lightGray }}>
                Créations exclusives
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={prevProductSlide}
                className="p-2 hover:bg-gray-200 transition-colors duration-300"
                aria-label="Produits précédents"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.darkGray }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextProductSlide}
                className="p-2 hover:bg-gray-200 transition-colors duration-300"
                aria-label="Produits suivants"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.darkGray }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Slider des produits */}
          <div className="relative overflow-hidden">
            <div
              className={`transition-transform duration-500 ease-in-out`}
              style={{
                transform: `translateX(-${currentProductSlide * 100}%)`
              }}
            >
              <div className="flex">
                {Array.from({ length: totalProductSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {products.slice(slideIndex * productsPerPage, slideIndex * productsPerPage + productsPerPage).map((product) => (
                        <div
                          key={product.id}
                          className="bg-white group relative cursor-pointer"
                          onClick={() => goToProductDetail(product.id)}
                        >
                          {/* Image Container */}
                          <div className="relative overflow-hidden mb-4">
                            <div className="h-[400px] overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            </div>

                            {/* Badges */}
                            <div className="absolute top-4 left-4 z-10">
                              {product.isNew && (
                                <span className="inline-block px-3 py-1 bg-white text-black text-xs tracking-widest uppercase">
                                  Nouveau
                                </span>
                              )}
                              {product.isSale && product.price < product.originalPrice && (
                                <span className="inline-block px-3 py-1 bg-black text-white text-xs tracking-widest uppercase ml-2">
                                  -{calculateDiscount(product.price, product.originalPrice)}%
                                </span>
                              )}
                            </div>

                            {/* Bouton ajouter au panier en haut à droite */}
                            <button
                              onClick={(e) => addToCart(product.id, e)}
                              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white transition-colors duration-300 opacity-0 group-hover:opacity-100"
                              aria-label="Ajouter au panier"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>

                            {/* Overlay hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>

                          {/* Product Info */}
                          <div className="p-4">
                            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: colors.lightGray }}>
                              {product.category}
                            </p>
                            <h3 className="text-lg font-light mb-3 group-hover:text-gray-600 transition-colors" style={{ color: colors.darkGray }}>
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg" style={{ color: colors.darkGray }}>
                                  {formatPrice(product.price)}
                                </span>
                                {product.isSale && product.price < product.originalPrice && (
                                  <span className="ml-2 text-sm line-through" style={{ color: colors.lightGray }}>
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
                ))}
              </div>
            </div>
          </div>

          {/* Indicateurs du slider produit */}
          <div className="flex justify-center space-x-2 mt-12">
            {Array.from({ length: totalProductSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToProductSlide(index)}
                className={`h-px w-8 transition-all duration-300 ${index === currentProductSlide ? 'bg-black' : 'bg-gray-300'}`}
                aria-label={`Aller au slide produit ${index + 1}`}
              />
            ))}
          </div>

          <div className="text-center mt-16">
            <a
              href="/products"
              className="inline-block border border-black px-12 py-4 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
            >
              Voir toutes les créations
            </a>
          </div>
        </div>
      </section>

      <section
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative h-[70vh]">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="container mx-auto px-8 h-full flex items-center">
                <div className="w-full">
                  <div className="mb-8">
                    <h2 className="text-5xl text-center md:text-7xl font-bold tracking-tight mb-6 text-white leading-none">
                      {slide.title}
                    </h2>
                    <p className="text-xl text-center mb-8 text-white/80 font-light tracking-wide">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Hero */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300"
          aria-label="Slide précédent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300"
          aria-label="Slide suivant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Section Collections */}
      <section className="py-10">
        <div className="container mx-auto px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/categories/${category.name.toLowerCase()}`}
                className="group relative overflow-hidden"
              >
                <div className="h-[300px] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-light text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-white/80">{category.count} pièces</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center text-white text-sm tracking-widest">
                      Explorer
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section Newsletter Minimaliste */}
      <section className="py-24 border-t border-b" style={{ borderColor: colors.border }}>
        <div className="container mx-auto px-8 max-w-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-light tracking-tight mb-6" style={{ color: colors.darkGray }}>
              L'Art de la Mode
            </h2>
            <p className="mb-8" style={{ color: colors.lightGray }}>
              Recevez en exclusivité nos éditions limitées et invitations aux événements privés.
            </p>

            {isSubscribed ? (
              <div className="py-8">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.darkGray }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm tracking-widest uppercase" style={{ color: colors.darkGray }}>
                  Merci pour votre inscription
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-6">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="flex-1 border-b border-black px-4 py-3 text-center text-sm tracking-widest uppercase focus:outline-none focus:border-gray-400"
                    style={{ backgroundColor: 'transparent' }}
                    required
                  />
                  <button
                    type="submit"
                    className="border border-black px-8 py-3 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
                  >
                    S'inscrire
                  </button>
                </div>
                <p className="text-xs" style={{ color: colors.lightGray }}>
                  En vous inscrivant, vous acceptez notre politique de confidentialité.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer Minimaliste */}
      <footer className="py-16" style={{ backgroundColor: colors.black, color: colors.white }}>
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-sm tracking-widest uppercase mb-6">CAPRICE</h3>
              <p className="text-sm mb-6" style={{ color: colors.lightGray }}>
                Maison de couture contemporaine. Créations exclusives depuis 2010.
              </p>
              <div className="flex space-x-4">
                {['Instagram', 'Pinterest', 'LinkedIn'].map((social) => (
                  <a
                    key={social}
                    href={`https://${social.toLowerCase()}.com`}
                    className="text-sm tracking-widest uppercase hover:text-gray-400 transition-colors"
                    style={{ color: colors.lightGray }}
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: 'Collections',
                items: ['Haute Couture', 'Prêt-à-porter', 'Accessoires', 'Bijoux']
              },
              {
                title: 'Services',
                items: ['Sur Mesure', 'Location', 'Essayage Privé', 'Conseil Stylisme']
              },
              {
                title: 'Information',
                items: ['Contact', 'Livraison', 'Retours', 'CGV']
              }
            ].map((column, index) => (
              <div key={index}>
                <h4 className="text-sm tracking-widest uppercase mb-6">{column.title}</h4>
                <ul className="space-y-3">
                  {column.items.map((item) => (
                    <li key={item}>
                      <a
                        href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                        className="text-sm hover:text-gray-400 transition-colors"
                        style={{ color: colors.lightGray }}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t pt-8" style={{ borderColor: colors.mediumGray }}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm mb-4 md:mb-0" style={{ color: colors.lightGray }}>
                © {new Date().getFullYear()} CAPRICE. Tous droits réservés.
              </p>
              <div className="text-sm" style={{ color: colors.lightGray }}>
                <p>Dakar • Paris • Abidjan</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
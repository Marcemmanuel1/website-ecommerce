import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
  discountPercentage: number;
}

interface Category {
  id: number;
  name: string;
  count: number;
  image: string;
  discountPercentage: number;
}

const Home = () => {
  // État pour le slider hero
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // État pour la section signature (scrolling sur desktop)
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(true);

  // État pour le slider des réductions (nouvelle section)
  const [currentDiscountSlide, setCurrentDiscountSlide] = useState(0);
  const [isDiscountTransitioning, setIsDiscountTransitioning] = useState(false);

  // État pour le slider des catégories
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0);
  const [isCategoryTransitioning, setIsCategoryTransitioning] = useState(false);

  // État pour le slider des collections
  const [currentCollectionSlide, setCurrentCollectionSlide] = useState(0);
  const [isCollectionTransitioning, setIsCollectionTransitioning] = useState(false);

  // État pour le panier
  const [cartItems, setCartItems] = useState<number[]>([]);

  // État pour la newsletter
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Références pour les intervalles - CORRIGÉ
  const sliderIntervalRef = useRef<number | null>(null);
  const discountSliderIntervalRef = useRef<number | null>(null);
  const categorySliderIntervalRef = useRef<number | null>(null);
  const collectionSliderIntervalRef = useRef<number | null>(null);

  // Références pour le scrolling horizontal
  const signatureContainerRef = useRef<HTMLDivElement>(null);

  // Références pour le swipe mobile
  const discountTouchStartX = useRef<number>(0);
  const discountTouchEndX = useRef<number>(0);
  const categoryTouchStartX = useRef<number>(0);
  const categoryTouchEndX = useRef<number>(0);
  const collectionTouchStartX = useRef<number>(0);
  const collectionTouchEndX = useRef<number>(0);

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
      image: "/hero-section-trois.png",
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
      price: 26600,
      originalPrice: 38000,
      image: "/robe-noir.jpg",
      isNew: true,
      isSale: true,
      discountPercentage: 30
    },
    {
      id: 2,
      name: "BLOUSE SOIE",
      category: "SIGNATURE",
      price: 22000,
      originalPrice: 22000,
      image: "/blouse-soie.jpg",
      isNew: true,
      isSale: false,
      discountPercentage: 0
    },
    {
      id: 3,
      name: "JUPE",
      category: "AVANT-GARDE",
      price: 15500,
      originalPrice: 21000,
      image: "/jupe.jpg",
      isNew: false,
      isSale: true,
      discountPercentage: 26
    },
    {
      id: 4,
      name: "SAC A MAIN",
      category: "EXCLUSIVITÉ",
      price: 35000,
      originalPrice: 35000,
      image: "/sac-a-main.jpg",
      isNew: false,
      isSale: false,
      discountPercentage: 0
    },
    {
      id: 5,
      name: "SAC SCULPTÉ CUIR",
      category: "ACCESSOIRES",
      price: 28000,
      originalPrice: 35000,
      image: "/sac-en-cuir.jpg",
      isNew: true,
      isSale: true,
      discountPercentage: 20
    },
    {
      id: 6,
      name: "CHAINE EN OR",
      category: "BIJOUX",
      price: 8500,
      originalPrice: 12000,
      image: "/parure-en-or.jpg",
      isNew: false,
      isSale: true,
      discountPercentage: 29
    },
    {
      id: 7,
      name: "ESCARPINS À TALONS",
      category: "CHAUSSURES",
      price: 32000,
      originalPrice: 40000,
      image: "/escarpins.jpg",
      isNew: true,
      isSale: false,
      discountPercentage: 20
    },
    {
      id: 8,
      name: "VESTE STRUCTURÉE",
      category: "OUTERWEAR",
      price: 27500,
      originalPrice: 34000,
      image: "/veste.jpg",
      isNew: false,
      isSale: true,
      discountPercentage: 19
    }
  ];

  // Données des slides de réduction (comme hero section)
  const discountSlides: HeroSlide[] = [
    {
      id: 1,
      title: "SOLDES EXCEPTIONNELS",
      subtitle: "Jusqu'à -70%",
      description: "Profitez de réductions exclusives sur nos collections signature",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: "VOIR LES OFFRES",
      buttonLink: "/sales"
    },
    {
      id: 2,
      title: "FIN DE COLLECTION",
      subtitle: "Jusqu'à -50%",
      description: "Pièces uniques à prix réduits, stocks limités",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonText: "DÉCOUVRIR",
      buttonLink: "/end-of-season"
    },
    {
      id: 3,
      title: "VENTE PRIVÉE",
      subtitle: "Membres exclusifs",
      description: "Accès anticipé aux réductions pour nos abonnés",
      image: "/vente-privee.jpg",
      buttonText: "DEVENIR MEMBRE",
      buttonLink: "/membership"
    }
  ];

  // Catégories avec pourcentages de réduction
  const categories: Category[] = [
    { id: 1, name: "HAUTE COUTURE", count: 24, image: "/haute-couture.jpg", discountPercentage: 30 },
    { id: 2, name: "PRÊT-À-PORTER", count: 32, image: "/pret-a-porter.jpg", discountPercentage: 25 },
    { id: 3, name: "ACCESSOIRES", count: 18, image: "/sac-accessoire.jpg", discountPercentage: 40 },
    { id: 4, name: "BIJOUX", count: 45, image: "/bijoux.jpg", discountPercentage: 35 },
  ];

  // Configuration des sliders mobiles
  const categoriesPerSlide = 2;
  const totalCategorySlides = Math.ceil(categories.length / categoriesPerSlide);

  // Configuration du slider collections pour mobile
  const totalCollectionSlides = categories.length;

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

  // Fonction pour passer au slide suivant des réductions
  const nextDiscountSlide = useCallback(() => {
    if (isDiscountTransitioning) return;
    setIsDiscountTransitioning(true);
    setCurrentDiscountSlide((prev) => (prev + 1) % discountSlides.length);
    setTimeout(() => setIsDiscountTransitioning(false), 700);
  }, [isDiscountTransitioning]);

  // Fonction pour passer au slide précédent des réductions
  const prevDiscountSlide = useCallback(() => {
    if (isDiscountTransitioning) return;
    setIsDiscountTransitioning(true);
    setCurrentDiscountSlide((prev) => (prev - 1 + discountSlides.length) % discountSlides.length);
    setTimeout(() => setIsDiscountTransitioning(false), 700);
  }, [isDiscountTransitioning]);

  // Fonction pour passer au slide suivant des collections
  const nextCollectionSlide = useCallback(() => {
    if (isCollectionTransitioning) return;
    setIsCollectionTransitioning(true);
    setCurrentCollectionSlide((prev) => (prev + 1) % totalCollectionSlides);
    setTimeout(() => setIsCollectionTransitioning(false), 700);
  }, [isCollectionTransitioning, totalCollectionSlides]);

  // Fonction pour passer au slide précédent des collections
  const prevCollectionSlide = useCallback(() => {
    if (isCollectionTransitioning) return;
    setIsCollectionTransitioning(true);
    setCurrentCollectionSlide((prev) => (prev - 1 + totalCollectionSlides) % totalCollectionSlides);
    setTimeout(() => setIsCollectionTransitioning(false), 700);
  }, [isCollectionTransitioning, totalCollectionSlides]);

  // Fonction pour aller à un slide spécifique du hero
  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  // Fonction pour aller à un slide spécifique des réductions
  const goToDiscountSlide = (index: number) => {
    if (isDiscountTransitioning || index === currentDiscountSlide) return;
    setIsDiscountTransitioning(true);
    setCurrentDiscountSlide(index);
    setTimeout(() => setIsDiscountTransitioning(false), 700);
  };

  // Fonction pour aller à un slide spécifique des collections
  const goToCollectionSlide = (index: number) => {
    if (isCollectionTransitioning || index === currentCollectionSlide) return;
    setIsCollectionTransitioning(true);
    setCurrentCollectionSlide(index);
    setTimeout(() => setIsCollectionTransitioning(false), 700);
  };

  // Fonctions pour le slider des catégories
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const nextCategorySlide = () => {
    if (isCategoryTransitioning) return;
    setIsCategoryTransitioning(true);
    setCurrentCategorySlide((prev) => (prev + 1) % totalCategorySlides);
    setTimeout(() => setIsCategoryTransitioning(false), 500);
  };

  const prevCategorySlide = () => {
    if (isCategoryTransitioning) return;
    setIsCategoryTransitioning(true);
    setCurrentCategorySlide((prev) => (prev - 1 + totalCategorySlides) % totalCategorySlides);
    setTimeout(() => setIsCategoryTransitioning(false), 500);
  };

  const goToCategorySlide = (index: number) => {
    if (isCategoryTransitioning || index === currentCategorySlide) return;
    setIsCategoryTransitioning(true);
    setCurrentCategorySlide(index);
    setTimeout(() => setIsCategoryTransitioning(false), 500);
  };

  // Fonctions pour le scrolling horizontal des produits signature
  const scrollSignatureLeft = () => {
    if (signatureContainerRef.current) {
      const container = signatureContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollSignatureRight = () => {
    if (signatureContainerRef.current) {
      const container = signatureContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Fonction pour mettre à jour l'état des boutons de scroll
  const updateScrollButtons = useCallback(() => {
    if (signatureContainerRef.current) {
      const container = signatureContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;

      setShowScrollLeft(scrollLeft > 10);
      setShowScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  }, []);

  // Gestion du slider automatique du hero
  const startHeroSlider = useCallback(() => {
    if (sliderIntervalRef.current) {
      clearInterval(sliderIntervalRef.current);
    }
    sliderIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, 5000) as unknown as number;
  }, [nextSlide, isPaused]);

  // Gestion du slider automatique des réductions
  const startDiscountSlider = useCallback(() => {
    if (discountSliderIntervalRef.current) {
      clearInterval(discountSliderIntervalRef.current);
    }
    discountSliderIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        nextDiscountSlide();
      }
    }, 5000) as unknown as number;
  }, [nextDiscountSlide, isPaused]);

  // Gestion du slider automatique des catégories (mobile seulement)
  const startCategorySlider = useCallback(() => {
    if (categorySliderIntervalRef.current) {
      clearInterval(categorySliderIntervalRef.current);
    }
    categorySliderIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        nextCategorySlide();
      }
    }, 5000) as unknown as number;
  }, [nextCategorySlide, isPaused]);

  // Gestion du slider automatique des collections (mobile seulement)
  const startCollectionSlider = useCallback(() => {
    if (collectionSliderIntervalRef.current) {
      clearInterval(collectionSliderIntervalRef.current);
    }
    collectionSliderIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        nextCollectionSlide();
      }
    }, 5000) as unknown as number;
  }, [nextCollectionSlide, isPaused]);

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

  // Gestion du swipe pour réductions (mobile)
  const handleDiscountTouchStart = (e: React.TouchEvent) => {
    discountTouchStartX.current = e.touches[0].clientX;
  };

  const handleDiscountTouchEnd = (e: React.TouchEvent) => {
    discountTouchEndX.current = e.changedTouches[0].clientX;
    handleDiscountSwipe();
  };

  const handleDiscountSwipe = () => {
    if (!discountTouchStartX.current || !discountTouchEndX.current) return;

    const distance = discountTouchStartX.current - discountTouchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextDiscountSlide();
    } else if (distance < -minSwipeDistance) {
      prevDiscountSlide();
    }
  };

  // Gestion du swipe pour catégories (mobile)
  const handleCategoryTouchStart = (e: React.TouchEvent) => {
    categoryTouchStartX.current = e.touches[0].clientX;
  };

  const handleCategoryTouchEnd = (e: React.TouchEvent) => {
    categoryTouchEndX.current = e.changedTouches[0].clientX;
    handleCategorySwipe();
  };

  const handleCategorySwipe = () => {
    if (!categoryTouchStartX.current || !categoryTouchEndX.current) return;

    const distance = categoryTouchStartX.current - categoryTouchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextCategorySlide();
    } else if (distance < -minSwipeDistance) {
      prevCategorySlide();
    }
  };

  // Gestion du swipe pour collections (mobile)
  const handleCollectionTouchStart = (e: React.TouchEvent) => {
    collectionTouchStartX.current = e.touches[0].clientX;
  };

  const handleCollectionTouchEnd = (e: React.TouchEvent) => {
    collectionTouchEndX.current = e.changedTouches[0].clientX;
    handleCollectionSwipe();
  };

  const handleCollectionSwipe = () => {
    if (!collectionTouchStartX.current || !collectionTouchEndX.current) return;

    const distance = collectionTouchStartX.current - collectionTouchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextCollectionSlide();
    } else if (distance < -minSwipeDistance) {
      prevCollectionSlide();
    }
  };

  // Auto-slide du hero
  useEffect(() => {
    startHeroSlider();
    return () => {
      if (sliderIntervalRef.current) {
        clearInterval(sliderIntervalRef.current);
      }
    };
  }, [startHeroSlider]);

  // Auto-slide des réductions
  useEffect(() => {
    startDiscountSlider();
    return () => {
      if (discountSliderIntervalRef.current) {
        clearInterval(discountSliderIntervalRef.current);
      }
    };
  }, [startDiscountSlider]);

  // Auto-slide des catégories (mobile seulement)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      startCategorySlider();
    }
    return () => {
      if (categorySliderIntervalRef.current) {
        clearInterval(categorySliderIntervalRef.current);
      }
    };
  }, [startCategorySlider]);

  // Auto-slide des collections (mobile seulement)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      startCollectionSlider();
    }
    return () => {
      if (collectionSliderIntervalRef.current) {
        clearInterval(collectionSliderIntervalRef.current);
      }
    };
  }, [startCollectionSlider]);

  // Mise à jour des boutons de scroll lors du défilement
  useEffect(() => {
    const container = signatureContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [updateScrollButtons]);

  // Mise à jour initiale des boutons de scroll
  useEffect(() => {
    updateScrollButtons();
  }, [updateScrollButtons]);

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price);
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

  // Fonction pour gérer le clic sur le panier
  const handleCartClick = () => {
    alert(`Vous avez ${cartItems.length} articles dans votre panier`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar cartItemsCount={cartItems.length} onCartClick={handleCartClick} />

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
                    className="inline-flex items-center border rounded-[50px] border-white px-12 py-4 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 group"
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

      {/* Section Collections - SLIDER SUR MOBILE */}
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

          {/* Version desktop - Grid de 4 colonnes */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/collections/${category.id}`}
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

          {/* Version mobile - Slider */}
          <div
            className="md:hidden relative overflow-hidden"
            onTouchStart={handleCollectionTouchStart}
            onTouchEnd={handleCollectionTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`flex transition-transform duration-700 ease-in-out`}
              style={{ transform: `translateX(-${currentCollectionSlide * 100}%)` }}
            >
              {categories.map((category) => (
                <div key={category.id} className="w-full flex-shrink-0 px-4">
                  <a
                    href={`/categories/${category.name.toLowerCase()}`}
                    className="group relative block overflow-hidden rounded-lg"
                  >
                    <div className="h-[400px] overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="text-2xl font-light text-white mb-2">{category.name}</h3>
                      <p className="text-sm text-white/80 mb-4">{category.count} pièces</p>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="inline-flex items-center text-white text-sm tracking-widest bg-black/50 px-4 py-2 rounded-full">
                          Explorer la collection
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Navigation Collections Mobile */}
            <button
              onClick={prevCollectionSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white transition-colors duration-300 shadow-lg"
              aria-label="Collection précédente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextCollectionSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white transition-colors duration-300 shadow-lg"
              aria-label="Collection suivante"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicateurs Collections Mobile */}
            <div className="flex justify-center space-x-3 mt-8">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToCollectionSlide(index)}
                  className={`h-1.5 w-8 transition-all duration-300 rounded-full ${index === currentCollectionSlide ? 'bg-black' : 'bg-gray-300'
                    }`}
                  aria-label={`Aller à la collection ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Pièces Signature - SCROLLING HORIZONTAL SUR DESKTOP, SLIDER SUR MOBILE */}
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
            <a
              href="/products"
              className="text-sm tracking-widest uppercase hover:text-gray-600 transition-colors hidden md:block"
              style={{ color: colors.lightGray }}
            >
              Voir tous les articles →
            </a>
          </div>

          {/* Version desktop - Conteneur de scrolling horizontal */}
          <div className="hidden md:block relative">
            {/* Boutons de navigation desktop */}
            {showScrollLeft && (
              <button
                onClick={scrollSignatureLeft}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-300"
                aria-label="Défiler vers la gauche"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {showScrollRight && (
              <button
                onClick={scrollSignatureRight}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-300"
                aria-label="Défiler vers la droite"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Conteneur de scrolling horizontal */}
            <div
              ref={signatureContainerRef}
              className="flex overflow-x-auto pb-8 gap-8 scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                cursor: 'grab'
              }}
              onScroll={updateScrollButtons}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-80 bg-white group relative cursor-pointer"
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
                      {product.isSale && product.discountPercentage > 0 && (
                        <span className="inline-block px-3 py-1 bg-black text-white text-xs tracking-widest uppercase ml-2">
                          -{product.discountPercentage}%
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

            {/* Style pour cacher la scrollbar mais garder le scroll */}
            <style>{`
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>

          {/* Version mobile - Slider (1 par slide) */}
          <div className="md:hidden">
            <div className="relative overflow-hidden">
              <div className={`flex transition-transform duration-500 ease-in-out`}
                style={{ transform: `translateX(-${currentCollectionSlide * 100}%)` }}>
                {products.map((product) => (
                  <div key={product.id} className="w-full flex-shrink-0 px-2">
                    <div
                      className="bg-white group relative cursor-pointer"
                      onClick={() => goToProductDetail(product.id)}
                    >
                      {/* Image Container */}
                      <div className="relative overflow-hidden mb-3">
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
                            <span className="inline-block px-3 py-1 bg-white text-black text-xs tracking-widest">
                              Nouveau
                            </span>
                          )}
                          {product.isSale && product.discountPercentage > 0 && (
                            <span className="inline-block px-3 py-1 bg-black text-white text-xs tracking-widest ml-2">
                              -{product.discountPercentage}%
                            </span>
                          )}
                        </div>

                        {/* Bouton ajouter au panier */}
                        <button
                          onClick={(e) => addToCart(product.id, e)}
                          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white transition-colors duration-300"
                          aria-label="Ajouter au panier"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: colors.lightGray }}>
                          {product.category}
                        </p>
                        <h3 className="text-lg font-light mb-2 group-hover:text-gray-600 transition-colors" style={{ color: colors.darkGray }}>
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
                  </div>
                ))}
              </div>

              {/* Navigation Mobile */}
              <button
                onClick={prevCollectionSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors duration-300"
                aria-label="Produits précédents"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextCollectionSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors duration-300"
                aria-label="Produits suivants"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Indicateurs Mobile */}
              <div className="flex justify-center space-x-2 mt-6">
                {products.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToCollectionSlide(index)}
                    className={`h-1 w-8 transition-all duration-300 ${index === currentCollectionSlide ? 'bg-black' : 'bg-gray-300'}`}
                    aria-label={`Aller au produit ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <a
              href="/products"
              className="inline-block border rounded-[50px] border-black px-12 py-4 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
            >
              Voir tous nos articles
            </a>
          </div>
        </div>
      </section>

      {/* Section Réductions - Slider comme hero section */}
      <section
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative h-[70vh] overflow-hidden"
          onTouchStart={handleDiscountTouchStart}
          onTouchEnd={handleDiscountTouchEnd}>
          {discountSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentDiscountSlide ? 'opacity-100' : 'opacity-0'}`}
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="container mx-auto px-8 h-full flex items-center">
                <div className="max-w-2xl">
                  <div className="mb-8">
                    <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6 text-white leading-none">
                      {slide.title}
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                      {slide.subtitle}
                    </h3>
                    <p className="text-xl mb-8 text-white/80 font-light tracking-wide">
                      {slide.description}
                    </p>
                  </div>
                  <a
                    href={slide.buttonLink}
                    className="inline-flex items-center border rounded-[50px] border-white px-12 py-4 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 group"
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

        {/* Navigation Réductions */}
        <button
          onClick={prevDiscountSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300"
          aria-label="Slide précédent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextDiscountSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300"
          aria-label="Slide suivant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicateurs Réductions */}
        <div className="absolute bottom-12 left-8 flex flex-col space-y-2">
          {discountSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToDiscountSlide(index)}
              className={`h-px w-8 transition-all duration-300 ${index === currentDiscountSlide ? 'bg-white' : 'bg-white/30'}`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Section Catégories avec pourcentages - Slider sur mobile */}
      <section className="py-10">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="md:text-3xl text-2xl font-light tracking-tight mb-2" style={{ color: colors.darkGray }}>
                Catégories en Promotions
              </h2>
              <p className="md:text-sm text-[10px] tracking-widest uppercase" style={{ color: colors.lightGray }}>
                Jusqu'à -40% de réduction
              </p>
            </div>
            <a
              href="/categories"
              className="md:text-sm text-[10px] tracking-widest uppercase hover:text-gray-600 transition-colors"
              style={{ color: colors.lightGray }}
            >
              Tout voir →
            </a>
          </div>

          {/* Version desktop */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

                  {/* Badge pourcentage */}
                  {category.discountPercentage > 0 && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-block px-4 py-2 bg-red-600 text-white text-sm tracking-widest uppercase">
                        -{category.discountPercentage}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-light text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-white/80">{category.count} pièces</p>
                  {category.discountPercentage > 0 && (
                    <p className="text-sm text-red-300 font-medium mt-1">
                      Jusqu'à -{category.discountPercentage}% de réduction
                    </p>
                  )}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center text-white text-sm tracking-widest">
                      Voir les promotions
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Version mobile */}
          <div className="md:hidden relative overflow-hidden"
            onTouchStart={handleCategoryTouchStart}
            onTouchEnd={handleCategoryTouchEnd}>
            <div className={`transition-transform duration-500 ease-in-out flex`}
              style={{ transform: `translateX(-${currentCategorySlide * 100}%)` }}>
              {Array.from({ length: totalCategorySlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-2 gap-4">
                    {categories.slice(slideIndex * categoriesPerSlide, slideIndex * categoriesPerSlide + categoriesPerSlide).map((category) => (
                      <a
                        key={category.id}
                        href={`/categories/${category.name.toLowerCase()}`}
                        className="group relative overflow-hidden"
                      >
                        <div className="h-[400px] overflow-hidden">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Badge pourcentage */}
                          {category.discountPercentage > 0 && (
                            <div className="absolute top-3 right-3 z-10">
                              <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs tracking-widest">
                                -{category.discountPercentage}%
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-light text-white mb-1">{category.name}</h3>
                          <p className="text-xs text-white/80">{category.count} pièces</p>
                          {category.discountPercentage > 0 && (
                            <p className="text-xs text-red-300 font-medium mt-1">
                              Jusqu'à -{category.discountPercentage}%
                            </p>
                          )}
                          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="inline-flex items-center text-white text-xs tracking-widest">
                              Voir
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Catégories Mobile */}
            <button
              onClick={prevCategorySlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors duration-300"
              aria-label="Catégories précédentes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextCategorySlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors duration-300"
              aria-label="Catégories suivantes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicateurs Catégories Mobile */}
            <div className="flex justify-center space-x-2 mt-6">
              {Array.from({ length: totalCategorySlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToCategorySlide(index)}
                  className={`h-1 w-8 transition-all duration-300 ${index === currentCategorySlide ? 'bg-black' : 'bg-gray-300'}`}
                  aria-label={`Aller aux catégories ${index + 1}`}
                />
              ))}
            </div>
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
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
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
                  S'inscrire
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
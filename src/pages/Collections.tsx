import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Types
interface Collection {
  id: number;
  name: string;
  description: string;
  items: number;
  image: string;
  season: string;
  year: number;
  isNew: boolean;
}

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface SortOption {
  id: string;
  label: string;
}

const Collections = () => {
  // État pour le slider hero des collections
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isHeroTransitioning, setIsHeroTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // État pour les filtres et tri
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Références
  const sliderIntervalRef = useRef<number | null>(null);

  // Données des slides hero
  const heroSlides = [
    {
      id: 1,
      title: "ARCHIVES COLLECTIONS",
      subtitle: "De 2020 à aujourd'hui",
      description: "Revivez l'évolution de notre maison à travers nos collections phares",
      image: "/hero-collection-un.png",
      buttonText: "EXPLORER LES ARCHIVES",
      buttonLink: "/collections/archives"
    },
    {
      id: 2,
      title: "COLLECTION PRINTEMPS-ÉTÉ 2026",
      subtitle: "En prévision",
      description: "Un avant-goût des créations à venir",
      image: "/hero-section-deux.png",
      buttonText: "DÉCOUVRIR",
      buttonLink: "/collections/preview"
    },
    {
      id: 3,
      title: "PIÈCES ICONIQUES",
      subtitle: "L'éternel réinventé",
      description: "Les modèles qui ont marqué l'histoire de la maison",
      image: "/hero-collection-trois.png",
      buttonText: "EXPLORER",
      buttonLink: "/collections/iconic"
    }
  ];

  // Données des collections
  const collections: Collection[] = [
    {
      id: 1,
      name: "NÉBULEUSE URBAINE",
      description: "Architecture et mouvement dans la cité contemporaine",
      items: 42,
      image: "/haute-couture.jpg",
      season: "Automne-Hiver",
      year: 2025,
      isNew: true
    },
    {
      id: 2,
      name: "ÉCHO SILENCIEUX",
      description: "Dialogue entre matières et silence",
      items: 36,
      image: "/bijoux.jpg",
      season: "Printemps-Été",
      year: 2025,
      isNew: true
    },
    {
      id: 3,
      name: "RÉMINISCENCE",
      description: "Hommage aux archives réinterprétées",
      items: 28,
      image: "/collection-huit.jpg",
      season: "Automne-Hiver",
      year: 2024,
      isNew: false
    },
    {
      id: 4,
      name: "ORIGINES",
      description: "Retour aux sources, pureté des lignes",
      items: 31,
      image: "/sac-accessoire.jpg",
      season: "Printemps-Été",
      year: 2024,
      isNew: false
    },
    {
      id: 5,
      name: "METAMORPHOSE",
      description: "Transformation et renouveau",
      items: 39,
      image: "/collection-un.jpg",
      season: "Automne-Hiver",
      year: 2023,
      isNew: false
    },
    {
      id: 6,
      name: "ÉQUINOXE",
      description: "Équilibre entre ombre et lumière",
      items: 33,
      image: "/collection-deux.jpg",
      season: "Printemps-Été",
      year: 2023,
      isNew: false
    },
    {
      id: 7,
      name: "NOCTURNE",
      description: "Élégance des heures sombres",
      items: 27,
      image: "/collection-trois.jpg",
      season: "Automne-Hiver",
      year: 2022,
      isNew: false
    },
    {
      id: 8,
      name: "SOLSTICE",
      description: "Apogée de la lumière estivale",
      items: 35,
      image: "/collection-quatre.jpg",
      season: "Printemps-Été",
      year: 2022,
      isNew: false
    },
    {
      id: 9,
      name: "RÉSONANCE",
      description: "Harmonie des textures et des volumes",
      items: 30,
      image: "/collection-cinq.jpg",
      season: "Automne-Hiver",
      year: 2021,
      isNew: false
    },
    {
      id: 10,
      name: "ÉMERAUDE",
      description: "Vitalité et renouveau printanier",
      items: 32,
      image: "/collection-sept.jpg",
      season: "Printemps-Été",
      year: 2021,
      isNew: false
    },
    {
      id: 11,
      name: "MONOLITHE",
      description: "Force et minimalisme architectural",
      items: 26,
      image: "/collection-quatre.jpg",
      season: "Automne-Hiver",
      year: 2020,
      isNew: false
    },
    {
      id: 12,
      name: "AURORE",
      description: "Première lumière, nouvelles perspectives",
      items: 29,
      image: "/collection-six.jpg",
      season: "Printemps-Été",
      year: 2020,
      isNew: false
    }
  ];

  // Options de filtrage
  const seasonFilters: FilterOption[] = [
    { id: 'all', label: 'Toutes les saisons', count: collections.length },
    { id: 'printemps-ete', label: 'Printemps-Été', count: collections.filter(c => c.season === 'Printemps-Été').length },
    { id: 'automne-hiver', label: 'Automne-Hiver', count: collections.filter(c => c.season === 'Automne-Hiver').length }
  ];


  const sortOptions: SortOption[] = [
    { id: 'newest', label: 'Plus récentes' },
    { id: 'oldest', label: 'Plus anciennes' },
    { id: 'name-asc', label: 'Nom (A-Z)' },
    { id: 'name-desc', label: 'Nom (Z-A)' },
    { id: 'items-desc', label: 'Nombre de pièces' }
  ];

  // Fonctions pour le slider hero
  const nextHeroSlide = useCallback(() => {
    if (isHeroTransitioning) return;
    setIsHeroTransitioning(true);
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsHeroTransitioning(false), 700);
  }, [isHeroTransitioning]);

  const prevHeroSlide = useCallback(() => {
    if (isHeroTransitioning) return;
    setIsHeroTransitioning(true);
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsHeroTransitioning(false), 700);
  }, [isHeroTransitioning]);

  const goToHeroSlide = (index: number) => {
    if (isHeroTransitioning || index === currentHeroSlide) return;
    setIsHeroTransitioning(true);
    setCurrentHeroSlide(index);
    setTimeout(() => setIsHeroTransitioning(false), 700);
  };

  // Gestion du slider automatique
  const startSlider = useCallback(() => {
    if (sliderIntervalRef.current) {
      clearInterval(sliderIntervalRef.current);
    }
    sliderIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        nextHeroSlide();
      }
    }, 5000) as unknown as number;
  }, [nextHeroSlide, isPaused]);

  // Gestion des pauses
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Filtrage et tri des collections
  const filteredAndSortedCollections = collections
    .filter(collection => {
      if (selectedSeason === 'all') return true;
      if (selectedSeason === 'printemps-ete') return collection.season === 'Printemps-Été';
      if (selectedSeason === 'automne-hiver') return collection.season === 'Automne-Hiver';
      return true;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'newest':
          return b.year - a.year || (b.isNew ? 1 : -1);
        case 'oldest':
          return a.year - b.year;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'items-desc':
          return b.items - a.items;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCollections.length / itemsPerPage);
  const paginatedCollections = filteredAndSortedCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [selectedSeason, selectedSort]);

  // Auto-slide
  useEffect(() => {
    startSlider();
    return () => {
      if (sliderIntervalRef.current) {
        clearInterval(sliderIntervalRef.current);
      }
    };
  }, [startSlider]);

  // Gestion des événements clavier pour l'accessibilité
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevHeroSlide();
      if (e.key === 'ArrowRight') nextHeroSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevHeroSlide, nextHeroSlide]);

  // Palette de couleurs
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
      {/* Navbar */}
      <Navbar cartItemsCount={0} onCartClick={() => { }} />

      {/* Hero Section */}
      <section
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative h-[92vh] overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHeroSlide ? 'opacity-100' : 'opacity-0'}`}
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
                    <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 text-white leading-none">
                      {slide.title}
                    </h1>
                    <h2 className="text-3xl md:text-5xl font-light mb-6 text-white/90">
                      {slide.subtitle}
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
          onClick={prevHeroSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300"
          aria-label="Slide précédent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextHeroSlide}
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
              onClick={() => goToHeroSlide(index)}
              className={`h-px w-8 transition-all duration-300 ${index === currentHeroSlide ? 'bg-white' : 'bg-white/30'}`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Filtres et Tri */}
      <section className="py-12 border-b" style={{ borderColor: colors.border }}>
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Titre et nombre de collections */}
            <div>
              <h2 className="text-2xl font-light tracking-tight" style={{ color: colors.darkGray }}>
                Nos Collections
              </h2>
              <p className="text-sm tracking-widest uppercase mt-2" style={{ color: colors.lightGray }}>
                {filteredAndSortedCollections.length} collections
              </p>
            </div>

            {/* Bouton filtres mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-between w-full px-4 py-3 border"
              style={{ borderColor: colors.border }}
            >
              <span className="text-sm tracking-widest uppercase" style={{ color: colors.darkGray }}>
                Filtres & Tri
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Filtres desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Filtre par saison */}
              <div className="relative group">
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="appearance-none border-0 bg-transparent pl-0 pr-8 py-2 text-sm tracking-widest uppercase cursor-pointer focus:outline-none"
                  style={{ color: colors.darkGray }}
                >
                  {seasonFilters.map(filter => (
                    <option key={filter.id} value={filter.id}>
                      {filter.label} ({filter.count})
                    </option>
                  ))}
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Tri */}
              <div className="relative group">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="appearance-none border-0 bg-transparent pl-0 pr-8 py-2 text-sm tracking-widest uppercase cursor-pointer focus:outline-none"
                  style={{ color: colors.darkGray }}
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filtres mobile déroulants */}
          {showFilters && (
            <div className="md:hidden mt-6 space-y-6">
              {/* Filtre par saison mobile */}
              <div>
                <h3 className="text-sm tracking-widest uppercase mb-4" style={{ color: colors.darkGray }}>
                  Saison
                </h3>
                <div className="flex flex-col space-y-3">
                  {seasonFilters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedSeason(filter.id)}
                      className={`flex items-center justify-between py-3 px-4 text-left transition-colors ${selectedSeason === filter.id ? 'bg-gray-50' : ''}`}
                    >
                      <span className="text-sm" style={{ color: colors.darkGray }}>
                        {filter.label}
                      </span>
                      <span className="text-xs" style={{ color: colors.lightGray }}>
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tri mobile */}
              <div>
                <h3 className="text-sm tracking-widest uppercase mb-4" style={{ color: colors.darkGray }}>
                  Trier par
                </h3>
                <div className="flex flex-col space-y-3">
                  {sortOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedSort(option.id)}
                      className={`flex items-center justify-between py-3 px-4 text-left transition-colors ${selectedSort === option.id ? 'bg-gray-50' : ''}`}
                    >
                      <span className="text-sm" style={{ color: colors.darkGray }}>
                        {option.label}
                      </span>
                      {selectedSort === option.id && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Grille des Collections */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          {paginatedCollections.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-lg tracking-widest uppercase" style={{ color: colors.lightGray }}>
                Aucune collection trouvée
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedCollections.map(collection => (
                  <a
                    key={collection.id}
                    href={`/collections/${collection.id}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden mb-6">
                      <div className="h-[500px] overflow-hidden">
                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 z-10">
                        {collection.isNew && (
                          <span className="inline-block px-3 py-1 bg-white text-black text-xs tracking-widest uppercase">
                            Nouvelle
                          </span>
                        )}
                      </div>

                      {/* Informations */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div >
                          <h3 className="text-2xl font-light text-white">{collection.name}</h3>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs tracking-widest uppercase text-white/60">
                              {collection.season} {collection.year}
                            </p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="inline-flex items-center text-white text-sm tracking-widest">
                              Explorer
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-16">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Page précédente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-8 h-8 text-sm tracking-widest uppercase transition-colors ${currentPage === pageNumber ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Page suivante"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Section Chronologie */}
      <section className="py-24" style={{ backgroundColor: colors.lightBg }}>
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light tracking-tight mb-6" style={{ color: colors.darkGray }}>
              Chronologie des Collections
            </h2>
            <p className="text-sm tracking-widest uppercase" style={{ color: colors.lightGray }}>
              2020 - 2026
            </p>
          </div>

          <div className="relative">
            {/* Ligne de chronologie */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px" style={{ backgroundColor: colors.border }} />

            {/* Éléments de chronologie */}
            <div className="space-y-24">
              {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((year, index) => {
                const yearCollections = collections.filter(c => c.year === year);
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={year}
                    className={`flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Côté gauche/texte */}
                    <div className={`md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16'} mb-8 md:mb-0`}>
                      <div className={`text-center md:text-left ${isEven ? 'md:text-right' : ''}`}>
                        <h3 className="text-3xl font-light mb-4" style={{ color: colors.darkGray }}>
                          {year}
                        </h3>
                        <div className="space-y-4">
                          {yearCollections.map(collection => (
                            <div key={collection.id} className="group">
                              <a
                                href={`/collections/${collection.id}`}
                                className="inline-flex items-center hover:text-gray-600 transition-colors"
                                style={{ color: colors.darkGray }}
                              >
                                <span className="text-lg font-light">{collection.name}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                              <p className="text-sm" style={{ color: colors.lightGray }}>
                                {collection.season}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Point central */}
                    <div className="relative z-10 flex-shrink-0 w-4 h-4 rounded-full border-4 border-white" style={{ backgroundColor: colors.black }} />

                    {/* Côté droit/image */}
                    <div className={`md:w-1/2 ${isEven ? 'md:pr-16' : 'md:pl-16'} mt-8 md:mt-0`}>
                      {yearCollections[0] && (
                        <a
                          href={`/collections/${yearCollections[0].id}`}
                          className="block group"
                        >
                          <div className="h-[450px] overflow-hidden">
                            <img
                              src={yearCollections[0].image}
                              alt={yearCollections[0].name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                          <p className="text-sm tracking-widest uppercase mt-4 text-center md:text-left" style={{ color: colors.lightGray }}>
                            Collection phare {year}
                          </p>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section Newsletter */}
      <section className="py-24 border-t" style={{ borderColor: colors.border }}>
        <div className="container mx-auto px-8 max-w-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-light tracking-tight mb-6" style={{ color: colors.darkGray }}>
              Prochaines Collections
            </h2>
            <p className="mb-8" style={{ color: colors.lightGray }}>
              Soyez les premiers informés des lancements à venir et recevez un accès anticipé.
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
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Collections;
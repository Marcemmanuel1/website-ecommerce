import { useState, useEffect } from 'react';

// Définition du type Product
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
  description: string;
  sizes: string[];
  colors: string[];
  colorVariants?: number;
}

// Props du composant
interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// SearchOverlay Component with Full Height
const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fonction pour formater le prix en FCFA
  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR') + ' FCFA';
  };

  // Filtrage des produits basé sur la recherche
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Afficher tous les produits si la recherche est vide
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilteredProducts(allProductsData);
    } else {
      const filtered = allProductsData.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery]);

  const popularSearches = ['robe', 'sac', 'pull', 'baskets', 'jupe', 'blouse'];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Search Overlay - Full Height */}
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 bg-white z-50 transition-transform duration-500 ease-out overflow-y-auto ${isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="min-h-full flex flex-col">
          {/* Top Section - Search Area */}
          <div className="flex-shrink-0">
            <div className="container mx-auto px-6 py-8">
              {/* Header with close button */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl tracking-widest font-light uppercase">
                  CAPRICE
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Fermer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Search Input */}
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher vos vêtements préférés..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:border-gray-400 transition-colors"
                    autoFocus
                  />
                  <button
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Rechercher"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Popular Searches */}
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
                    Recherches populaires
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-5 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Product Grid */}
          <div className="flex-grow bg-gray-50 mt-8">
            <div className="container mx-auto px-6 py-12">
              <h3 className="text-sm mb-8 font-light tracking-wide">
                {searchQuery ? `Résultats pour "${searchQuery}" (${filteredProducts.length})` : 'Nos Article'}
              </h3>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="group cursor-pointer">
                      <div className="relative mb-3">
                        <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              {product.name}
                            </div>
                          )}
                        </div>
                        {product.isNew && (
                          <span className="absolute top-3 left-3 bg-white px-2 py-1 text-xs shadow-sm">Nouveau</span>
                        )}
                      </div>
                      <div className="text-xs mb-1 text-gray-500 uppercase">{product.category}</div>
                      <h4 className="text-sm mb-2 font-normal line-clamp-2">{product.name}</h4>
                      <div className="flex items-center gap-2">
                        {product.isSale ? (
                          <>
                            <p className="text-sm font-medium text-red-600">{formatPrice(product.price)}</p>
                            <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                          </>
                        ) : (
                          <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Aucun produit trouvé pour "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    Voir tous les produits
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Données des produits (à placer dans le même fichier ou à importer)
const allProductsData: Product[] = [
  {
    id: 1,
    name: "SWEAT COL ZIPPÉ BASIQUE",
    category: "VÊTEMENTS",
    price: 26264,
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
    price: 19672,
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
    price: 15078,
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
    price: 19672,
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
    price: 59114,
    originalPrice: 85395,
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
    price: 45962,
    originalPrice: 45962,
    image: "/article-cinq.jpg",
    isNew: true,
    isSale: false,
    discountPercentage: 0,
    description: "Blouse en soie pure avec col chemisier",
    sizes: ["S", "M", "L"],
    colors: ["Blanc", "Ecru", "Noir"]
  }
];

export default SearchOverlay;
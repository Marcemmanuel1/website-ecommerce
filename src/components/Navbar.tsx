import { useState } from 'react';
import SearchOverlay from './SearchOverlay';

// Types pour la navbar
interface NavbarProps {
  cartItemsCount: number;
  onCartClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartItemsCount, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Palette de couleurs
  const colors = {
    lightGray: '#666666',
    darkGray: '#1a1a1a',
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      alert(`Vous avez ${cartItemsCount} articles dans votre panier`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setIsMenuOpen(false); // Ferme le menu si ouvert
  };

  const menuItems = ['Collections', 'Couture', 'Accessoires', 'Éditions', 'Studio'];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Menu Burger - À gauche */}
            <button
              onClick={toggleMenu}
              className="hover:text-gray-600 transition-colors"
              aria-label="Menu"
              style={{ color: colors.lightGray }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Logo - Au centre */}
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl tracking-widest font-light uppercase">
              <a href="/">CAPRICE</a>
            </h1>

            {/* Icônes - À droite */}
            <div className="flex items-center md:space-x-6 space-x-2">
              <button
                onClick={handleSearchClick}
                className="hover:text-gray-600 transition-colors"
                aria-label="Rechercher"
                style={{ color: colors.lightGray }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <a
                href='/login'
                className="hover:text-gray-600 transition-colors"
                aria-label="Compte"
                style={{ color: colors.lightGray }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </a>
              <button
                className="relative hover:text-gray-600 transition-colors"
                onClick={handleCartClick}
                aria-label="Panier"
                style={{ color: colors.lightGray }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu déroulant */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <nav className="container mx-auto px-6 py-6 border-t border-gray-100">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="block text-base tracking-widest uppercase hover:text-gray-600 transition-colors duration-300 py-2"
                    style={{ color: colors.lightGray }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;
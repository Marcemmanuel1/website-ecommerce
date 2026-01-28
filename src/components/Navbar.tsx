
// Types pour la navbar
interface NavbarProps {
  cartItemsCount: number;
  onCartClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartItemsCount, onCartClick }) => {
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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl tracking-widest font-light uppercase">
            <a href="/">CAPRICE</a>
          </h1>

          {/* Navigation desktop */}
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
              onClick={handleCartClick}
              aria-label="Panier"
              style={{ color: colors.lightGray }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs h-5 w-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
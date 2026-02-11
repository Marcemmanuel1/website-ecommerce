import React, { type ReactNode } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

interface CartLayoutProps {
  children: ReactNode;
  cartItemsCount: number;
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

const CartLayout: React.FC<CartLayoutProps> = ({
  children,
  cartItemsCount,
  title = "Votre Panier",
  subtitle = "Vérifiez vos sélections",
  backgroundImage = '/card-hero.jpg',
}) => {
  const handleCartClick = () => {
    // Rediriger vers la page panier
    window.location.href = '/cart';
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartItemsCount={cartItemsCount} onCartClick={handleCartClick} />

      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-3 md:mb-4">
            {title}
          </h1>
          <p className="text-sm tracking-widest uppercase text-white/70">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 md:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartLayout;
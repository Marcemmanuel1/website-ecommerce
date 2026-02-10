import React, { type ReactNode } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useCart } from '../../hooks';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { cartCount } = useCart();

  const handleCartClick = () => {
    alert(`Vous avez ${cartCount} articles dans votre panier`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartItemsCount={cartCount} onCartClick={handleCartClick} />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
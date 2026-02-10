import React, { type ReactNode } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  backgroundImage = '/hero-section-register.jpg',
}) => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar cartItemsCount={0} onCartClick={() => { }} />

      <section
        className="relative min-h-[90vh] flex items-center justify-center text-white py-12"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-md px-4 sm:px-8">
          {title && (
            <div className="mb-8 md:mb-10 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-3 md:mb-4">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm tracking-widest uppercase text-white/70">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AuthLayout;
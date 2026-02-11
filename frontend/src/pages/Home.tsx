import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { HeroSection } from '../components/sections/HeroSection';
import { CollectionsSection } from '../components/sections/CollectionsSection';
import { SignatureSection } from '../components/sections/SignatureSection';
import { DiscountsSection } from '../components/sections/DiscountsSection';
import { CategoriesSection } from '../components/sections/CategoriesSection';
import { NewsletterSection } from '../components/sections/NewsletterSection';
import { heroSlides, discountSlides, products, categories } from '../constants/data';

const Home: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection slides={heroSlides} />
      <CollectionsSection categories={categories} />
      <SignatureSection products={products} />
      <DiscountsSection slides={discountSlides} />
      <CategoriesSection categories={categories} />
      <NewsletterSection />
    </MainLayout>
  );
};

export default Home;
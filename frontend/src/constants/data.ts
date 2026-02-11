import type { HeroSlide, Product, Category, Colors } from "../types";

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "COLLECTION PRINTEMPS-ÉTÉ 2026",
    subtitle: "L'élégance renaît",
    description:
      "Des pièces exclusives dessinées pour sublimer votre silhouette",
    image: "/hero-section-un.jpg",
    buttonText: "EXPLORER",
    buttonLink: "/collection",
  },
  {
    id: 2,
    title: "ÉDITION LIMITÉE",
    subtitle: "Pièces uniques",
    description: "Chaque création est une œuvre d'art à porter",
    image: "/hero-section-deux.jpeg",
    buttonText: "DÉCOUVRIR",
    buttonLink: "/sales",
  },
  {
    id: 3,
    title: "L'ART DE L'ACCESSOIRE",
    subtitle: "Sculptez votre style",
    description: "Bijoux et accessoires qui racontent votre histoire",
    image: "/hero-section-trois.png",
    buttonText: "EXPLORER",
    buttonLink: "/new-arrivals",
  },
];

export const discountSlides: HeroSlide[] = [
  {
    id: 1,
    title: "SOLDES EXCEPTIONNELS",
    subtitle: "Jusqu'à -70%",
    description:
      "Profitez de réductions exclusives sur nos collections signature",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    buttonText: "VOIR LES OFFRES",
    buttonLink: "/sales",
  },
  {
    id: 2,
    title: "FIN DE COLLECTION",
    subtitle: "Jusqu'à -50%",
    description: "Pièces uniques à prix réduits, stocks limités",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    buttonText: "DÉCOUVRIR",
    buttonLink: "/end-of-season",
  },
  {
    id: 3,
    title: "VENTE PRIVÉE",
    subtitle: "Membres exclusifs",
    description: "Accès anticipé aux réductions pour nos abonnés",
    image: "/vente-privee.jpg",
    buttonText: "DEVENIR MEMBRE",
    buttonLink: "/membership",
  },
];

export const products: Product[] = [
  {
    id: 1,
    name: "ROBE SCULPTURALE NOIR",
    category: "HAUTE COUTURE",
    price: 26600,
    originalPrice: 38000,
    image: "/robe-noir.jpg",
    isNew: true,
    isSale: true,
    discountPercentage: 30,
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
    discountPercentage: 0,
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
    discountPercentage: 26,
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
    discountPercentage: 0,
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
    discountPercentage: 20,
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
    discountPercentage: 29,
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
    discountPercentage: 20,
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
    discountPercentage: 19,
  },
];

export const categories: Category[] = [
  {
    id: 1,
    name: "HAUTE COUTURE",
    count: 24,
    image: "/haute-couture.jpg",
    discountPercentage: 30,
  },
  {
    id: 2,
    name: "PRÊT-À-PORTER",
    count: 32,
    image: "/pret-a-porter.jpg",
    discountPercentage: 25,
  },
  {
    id: 3,
    name: "ACCESSOIRES",
    count: 18,
    image: "/sac-accessoire.jpg",
    discountPercentage: 40,
  },
  {
    id: 4,
    name: "BIJOUX",
    count: 45,
    image: "/bijoux.jpg",
    discountPercentage: 35,
  },
];

export const colors: Colors = {
  black: "#000000",
  darkGray: "#1a1a1a",
  mediumGray: "#333333",
  lightGray: "#666666",
  white: "#ffffff",
  accent: "#000000",
  lightBg: "#f5f5f5",
  border: "#e0e0e0",
};

export const categoriesPerSlide = 2;
export const totalCategorySlides = Math.ceil(
  categories.length / categoriesPerSlide,
);
export const totalCollectionSlides = categories.length;

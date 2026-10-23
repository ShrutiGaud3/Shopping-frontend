import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface BestsellerCategoryItem {
  id: string;
  tag: string;
  title: string;
  link: string;
  image: string;
  description: string;
}

const BESTSELLER_CATEGORIES: BestsellerCategoryItem[] = [
  {
    id: 'lehengas',
    tag: 'WEIGHTLESS',
    title: 'LEHENGAS',
    link: '/products?category=Lehengas',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
    description: 'Swirling silhouettes with artisanal zardozi & can-can flair'
  },
  {
    id: 'salwar-suits',
    tag: 'CLASSIC',
    title: 'SALWAR SUITS',
    link: '/products?category=Salwar%20Suits',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
    description: 'Breezy anarkalis, festive shararas & straight cut elegance'
  },
  {
    id: 'sarees',
    tag: 'STELLAR',
    title: 'SAREES',
    link: '/products?category=Sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    description: 'Royal Banarasi, Kanjivaram & Organza zari masterpieces'
  }
];

export const BestsellingCategories: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (House of Indya Signature Style) */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-slate-900">
            SHOP BESTSELLING CATEGORIES
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 tracking-wide max-w-lg mx-auto">
            Iconic ethnic silhouettes loved by thousands of brides, festive revelers & connoisseurs
          </p>
        </div>

        {/* 3-Card Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {BESTSELLER_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group relative block aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] rounded-lg overflow-hidden bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Category Visual Image */}
              <img
                src={cat.image}
                alt={`${cat.tag} ${cat.title}`}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
              />

              {/* Multi-layer Aesthetic Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
              <div className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none group-hover:border-white/30 transition-colors" />

              {/* Bottom Centered Luxury Typography */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col items-center justify-end text-center text-white z-10">
                <span className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-rose-200/90 mb-1 drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                  {cat.tag}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-white mb-2 drop-shadow-md">
                  {cat.title}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-200/90 font-normal line-clamp-1 max-w-[280px] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {cat.description}
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider border-b border-white/60 pb-0.5 opacity-90 group-hover:opacity-100 group-hover:border-rose-300 group-hover:text-rose-200 transition-all">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

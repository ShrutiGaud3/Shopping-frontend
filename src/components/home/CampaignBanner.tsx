import React from 'react';
import { Link } from 'react-router-dom';

export const CampaignBanner: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gray-900 py-20 md:py-28 text-white">
      {/* Background Image with Overlay (Matching Reference Image 1) */}
      <img
        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80"
        alt="Big Fashion Festival"
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />

      {/* Content Container */}
      <div className="relative max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
        <span className="font-serif text-2xl md:text-3xl tracking-[0.4em] font-bold text-white uppercase mb-4">
          VELORA
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
          BIG FASHION FESTIVAL
        </h2>
        <p className="font-serif text-2xl sm:text-3xl md:text-4xl italic text-amber-300 font-medium mb-8">
          70% - 80% OFF
        </p>
        <Link
          to="/products?discount=70"
          className="inline-block border border-white bg-white/10 backdrop-blur-xs text-white px-10 py-3.5 text-xs md:text-sm font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
        >
          EXPLORE NOW
        </Link>
      </div>
    </section>
  );
};

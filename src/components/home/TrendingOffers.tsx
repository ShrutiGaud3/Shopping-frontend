import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const TrendingOffers: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header with Navigation Controls */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Trending Offers
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Handpicked promotional deals on top fashion lineups
            </p>
          </div>

          {/* Navigation Arrows (Matching Reference Image 1) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all bg-white shadow-xs"
              aria-label="Previous offers"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all bg-white shadow-xs"
              aria-label="Next offers"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Offers Track (Matching Reference Image 1 Layout) */}
        <div
          ref={scrollRef}
          className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto no-scrollbar scroll-smooth w-full pb-2"
        >
          
          {/* Card 1: Left Model Image Card */}
          <div className="w-[280px] sm:w-[320px] md:w-auto shrink-0 h-[340px] sm:h-[360px] md:h-[380px] relative rounded-sm overflow-hidden group border border-gray-200 shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
              alt="Bridal Lehenga Offer"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-left">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-1 text-rose-200">
                BRIDAL HERITAGE
              </span>
              <h3 className="font-serif text-2xl font-bold mb-2">
                Min 50% Off
              </h3>
              <Link
                to="/products?category=Lehengas"
                className="inline-block self-start border border-white text-white px-5 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-colors mt-2"
              >
                Shop Lehengas
              </Link>
            </div>
          </div>

          {/* Card 2: Center Split Banner */}
          <div className="w-[320px] sm:w-[420px] md:w-auto shrink-0 h-[340px] sm:h-[360px] md:h-[380px] grid grid-cols-2 bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
            {/* Left Content Box */}
            <div className="p-5 sm:p-6 flex flex-col items-center justify-center text-center bg-white border-r border-gray-100">
              <div className="bg-[#C41E3A] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 mb-3 rounded-xs">
                WEAVERA
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                Min 60% off
              </h3>
              <Link
                to="/products?discount=60"
                className="mt-3 border border-gray-800 text-gray-900 px-5 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-colors"
              >
                Explore Deals
              </Link>
            </div>

            {/* Right Fashion Model Image */}
            <div className="h-full overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Pure Silk Sarees"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Card 3: Right Editorial Card */}
          <div className="w-[280px] sm:w-[320px] md:w-auto shrink-0 h-[340px] sm:h-[360px] md:h-[380px] rounded-sm overflow-hidden group border border-gray-200 bg-white flex flex-col items-center justify-center p-6 text-center shadow-xs">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-gray-900 uppercase block mb-3 font-bold">
              WEAVERA SILK
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Min 40% Off
            </h3>
            <Link
              to="/products?category=Sarees"
              className="inline-block border border-gray-900 text-gray-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-colors"
            >
              Shop Sarees
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

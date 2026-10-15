import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-900 text-white relative overflow-hidden border-b border-gray-800">
      
      {/* Subtle Background Accent */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Split Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Atelier & Brand Imagery */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-sm overflow-hidden border border-gray-800">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"
                alt="VELORA Craftsmanship"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] rounded-sm overflow-hidden border border-gray-800 mt-8">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
                alt="VELORA Editorial Fashion"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right Column: Editorial Brand Story Content */}
          <div className="lg:col-span-6 text-left">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-400 block mb-3">
              THE VELORA HERITAGE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Redefining Modern Fashion with Timeless Luxury
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
              Founded on the principles of refined tailoring and sustainable elegance, <strong>VELORA</strong> merges contemporary urban silhouettes with centuries-old textile artistry. Every garment in our collection is precision-cut using organic cottons, mulberry silks, and premium denims.
            </p>

            {/* Key Value Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" /> 100+
                </div>
                <p className="text-gray-400 font-medium">Curated Drops</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" /> 100%
                </div>
                <p className="text-gray-400 font-medium">Sustainable Fabrics</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <HeartHandshake className="w-4 h-4" /> 50K+
                </div>
                <p className="text-gray-400 font-medium">Global Community</p>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-block border border-white bg-white text-gray-900 px-8 py-3 text-xs md:text-sm font-semibold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-xs shadow-md"
            >
              LEARN MORE ABOUT US
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

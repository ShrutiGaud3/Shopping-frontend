import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

export const WholesaleCampaignBanner: React.FC = () => {
  return (
    <section className="w-full relative overflow-hidden bg-slate-950 my-6 sm:my-10">
      {/* Full-Width Background Image with Cinematic Edge-to-Edge Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=80"
          alt="Weavera Global Wholesale & Bridal Program"
          className="w-full h-full object-cover object-top scale-100 hover:scale-102 transition-transform duration-1000 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 sm:bg-gradient-to-r sm:from-black/25 sm:via-black/65 sm:to-black/95" />
      </div>

      {/* Inner Content Grid aligned with max-w-7xl */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[440px] sm:min-h-[500px] md:min-h-[560px] flex items-center justify-end py-12 sm:py-16">
        <div className="w-full sm:max-w-xl md:max-w-2xl text-white text-center sm:text-right flex flex-col items-center sm:items-end">
          {/* Weavera Logo */}
          <div className="inline-flex items-center gap-2 mb-3 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
            <img
              src="/logo.png"
              alt="Weavera Logo"
              className="w-5 h-5 object-contain rounded-full shrink-0"
              onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
            />
            <span className="font-serif text-xs font-bold tracking-[0.25em] text-white uppercase">
              WEAVERA WHOLESALE
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-amber-200 mb-2">
            BUILD A BOOMING FASHION BUSINESS WITH
          </p>

          {/* Main Headline */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3 md:mb-4 leading-tight">
            Our Global Wholesale Program!
          </h2>

          {/* Description & USPs */}
          <p className="text-xs sm:text-sm text-slate-200 font-normal mb-6 max-w-lg leading-relaxed text-center sm:text-right drop-shadow-sm">
            Source authentic handcrafted sarees, bridal lehengas &amp; designer salwar suits direct from master looms with wholesale pricing, worldwide express shipping &amp; custom tailor finishing.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 mb-6 text-[11px] text-slate-300 font-medium">
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
              <Globe className="w-3.5 h-3.5 text-rose-400" /> Worldwide Express Dispatch
            </span>
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Genuine Silk &amp; Zari
            </span>
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Master Tailoring
            </span>
          </div>

          {/* Actions: Sign Up Now Button */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            <Link
              to="/contact?type=wholesale"
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-3.5 text-xs uppercase tracking-widest transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 rounded-xs"
            >
              SIGN UP NOW
            </Link>
            <Link
              to="/products?category=Lehengas"
              className="border border-white/80 hover:bg-white/10 text-white font-bold px-7 py-3.5 text-xs uppercase tracking-widest transition-all duration-300 backdrop-blur-xs rounded-xs flex items-center gap-1.5"
            >
              <span>EXPLORE BRIDAL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

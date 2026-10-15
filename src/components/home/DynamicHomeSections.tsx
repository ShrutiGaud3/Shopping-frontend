import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { homeSectionService } from '../../services/homeSectionService';
import { adaptBackendProduct } from '../../services/productService';
import { useShop } from '../../context/ShopContext';
import { useSettings } from '../../context/SettingsContext';
import { ProductCard } from '../product/ProductCard';
import { StoryCircles } from './StoryCircles';
import { TrendingNow } from './TrendingNow';
import { NewArrivals } from './NewArrivals';
import { DealsOfTheDay } from './DealsOfTheDay';
import { CategoryGrid } from './CategoryGrid';
import type { HomeSectionItem, Product } from '../../types';

export const DynamicHomeSections: React.FC = () => {
  const [sections, setSections] = useState<HomeSectionItem[]>([]);
  const { products } = useShop();
  const { openWhatsAppSupport } = useSettings();

  useEffect(() => {
    let isMounted = true;
    const fetchSections = async () => {
      try {
        const res = await homeSectionService.getHomeSections();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setSections(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch dynamic home sections:', err);
      }
    };
    fetchSections();
    return () => {
      isMounted = false;
    };
  }, []);

  const getFilteredProducts = (sec: HomeSectionItem): Product[] => {
    if (sec.products && sec.products.length > 0) {
      return (sec.products as any[]).map(adaptBackendProduct);
    }
    const filterBy = sec.config?.filterBy || 'trending';
    const limit = sec.config?.limit || 8;

    let filtered = products;
    if (filterBy === 'trending') {
      filtered = products.filter((p) => p.isTrending);
    } else if (filterBy === 'deal') {
      filtered = products.filter((p) => p.isDeal);
    } else if (filterBy === 'new') {
      filtered = products.filter((p) => p.isNew);
    } else if (filterBy === 'category' && sec.config?.category) {
      filtered = products.filter(
        (p) => p.category?.toLowerCase() === sec.config.category?.toLowerCase()
      );
    }

    if (filtered.length === 0) {
      filtered = products;
    }
    return filtered.slice(0, limit);
  };

  if (!sections || sections.length === 0) {
    return (
      <div className="space-y-12 md:space-y-16 py-4">
        <StoryCircles />
        <TrendingNow />
        <CategoryGrid />
        <NewArrivals />
        <DealsOfTheDay />
      </div>
    );
  }

  return (
    <div className="space-y-12 md:space-y-16 py-4">
      {sections.map((sec) => {
        // 1. Story Circles Block
        if (sec.type === 'story_circles') {
          return (
            <div key={sec._id || sec.id}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
                <div className="text-center md:text-left">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {sec.title}
                  </h2>
                  {sec.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      {sec.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <StoryCircles />
            </div>
          );
        }

        // 2. Product Grid Block
        if (sec.type === 'product_grid') {
          const displayProducts = getFilteredProducts(sec);
          if (displayProducts.length === 0) return null;

          return (
            <section
              key={sec._id || sec.id}
              className="py-10 md:py-14 bg-white border-b border-slate-100"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        {sec.title}
                      </h2>
                    </div>
                    {sec.subtitle && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {sec.subtitle}
                      </p>
                    )}
                  </div>

                  <Link
                    to={sec.config?.ctaLink || '/products'}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider group transition"
                  >
                    <span>{sec.config?.ctaText || 'View All'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                  {displayProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // 3. Banner Grid Block (Split Promo Cards)
        if (sec.type === 'banner_grid') {
          const banners = sec.config?.banners || [];
          if (banners.length === 0) return null;

          const gridColsClass =
            banners.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-3';

          return (
            <section
              key={sec._id || sec.id}
              className="py-10 md:py-14 bg-slate-50/60 border-b border-slate-200/80"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {sec.title}
                  </h2>
                  {sec.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
                      {sec.subtitle}
                    </p>
                  )}
                </div>

                <div className={`grid ${gridColsClass} gap-4 sm:gap-6`}>
                  {banners.map((b, idx) => (
                    <Link
                      key={idx}
                      to={b.link || '/products'}
                      className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 block"
                    >
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-all" />

                      <div className="absolute inset-0 p-6 flex flex-col justify-end text-left">
                        {b.badge && (
                          <span className="inline-block bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 w-max shadow-xs">
                            {b.badge}
                          </span>
                        )}
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                          {b.title}
                        </h3>
                        {b.subtitle && (
                          <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                            {b.subtitle}
                          </p>
                        )}
                        <span className="mt-3 text-xs font-bold text-white underline underline-offset-4 flex items-center gap-1 group-hover:text-rose-400 transition-colors">
                          Explore Collection &rarr;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // 4. Spotlight / Campaign Banner Block
        if (sec.type === 'campaign_banner') {
          const promo = sec.config?.banners?.[0];
          const bgImg =
            promo?.image ||
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80';

          return (
            <section key={sec._id || sec.id} className="py-8 md:py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 z-10 text-left">
                    <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                      <Sparkles className="w-3.5 h-3.5" />
                      {promo?.badge || 'EXCLUSIVE SERVICE'}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
                      {sec.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 max-w-lg">
                      {sec.subtitle ||
                        'Experience the touch of Surat craftsmanship. Video call our master stylists to see fabrics live, choose zari designs and get custom blouse stitching.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() =>
                          openWhatsAppSupport(
                            'Hello VELORA! 👋 I would like to book a WhatsApp Video Call consultation for bridal & ethnic wear.'
                          )
                        }
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-full transition shadow-lg shadow-emerald-600/30 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Book Video Call on WhatsApp</span>
                      </button>
                      <Link
                        to="/products?category=Lehengas"
                        className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-slate-300 px-4 py-3 underline underline-offset-4"
                      >
                        <span>View Bridal Edit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-[420px] relative">
                    <img
                      src={bgImg}
                      alt={sec.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
};

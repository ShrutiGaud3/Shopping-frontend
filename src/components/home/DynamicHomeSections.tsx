import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { homeSectionService } from '../../services/homeSectionService';
import { adaptBackendProduct } from '../../services/productService';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../product/ProductCard';
import { StoryCircles } from './StoryCircles';
import type { HomeSectionItem, Product } from '../../types';

export const DynamicHomeSections: React.FC = () => {
  const [sections, setSections] = useState<HomeSectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { products } = useShop();

  // Tab state for New Arrivals section
  const [newArrivalsTab, setNewArrivalsTab] = useState<'All' | 'Sarees' | 'Lehengas' | 'Salwar Suits'>('All');

  useEffect(() => {
    let isMounted = true;
    const fetchSections = async () => {
      try {
        setLoading(true);
        const res = await homeSectionService.getHomeSections();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setSections(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch dynamic home sections:', err);
      } finally {
        if (isMounted) setLoading(false);
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
      filtered = products.filter((p) => p.isTrending || p.rating >= 4.5);
    } else if (filterBy === 'deal') {
      filtered = products.filter((p) => p.isDeal);
    } else if (filterBy === 'new') {
      filtered = products.filter((p) => p.isNew);
    } else if (filterBy === 'category' && sec.config?.category) {
      filtered = products.filter(
        (p) => p.category?.toLowerCase() === sec.config?.category?.toLowerCase()
      );
    }

    if (filtered.length === 0) {
      filtered = products;
    }
    return filtered.slice(0, limit);
  };

  if (loading) {
    return (
      <div className="space-y-12 md:space-y-16 py-8 animate-pulse">
        {/* Shimmer Placeholder 1 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-7 w-64 bg-slate-200 rounded mx-auto mb-3" />
          <div className="h-4 w-96 bg-slate-100 rounded mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-slate-200 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Shimmer Placeholder 2 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-7 w-52 bg-slate-200 rounded mx-auto mb-3" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-[3/4] bg-slate-200 rounded-lg" />
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-1/3 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12 sm:space-y-16 md:space-y-20 py-4">
      {sections.map((sec) => {
        // ============================================================
        // 1. BESTSELLING CATEGORIES (House of Indya 3-Card Visual Grid)
        // ============================================================
        if (sec.type === 'bestselling_categories') {
          const defaultBanners = [
            {
              tag: 'WEIGHTLESS',
              title: 'LEHENGAS',
              link: '/products?category=Lehengas',
              image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
              description: 'Swirling silhouettes with artisanal zardozi & can-can flair'
            },
            {
              tag: 'CLASSIC',
              title: 'SALWAR SUITS',
              link: '/products?category=Salwar%20Suits',
              image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
              description: 'Breezy anarkalis, festive shararas & straight cut elegance'
            },
            {
              tag: 'STELLAR',
              title: 'SAREES',
              link: '/products?category=Sarees',
              image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
              description: 'Royal Banarasi, Kanjivaram & Organza zari masterpieces'
            }
          ];

          const banners =
            sec.config?.banners && sec.config.banners.length > 0
              ? sec.config.banners
              : defaultBanners;

          return (
            <section
              key={sec._id || sec.id}
              className="py-12 sm:py-16 md:py-20 bg-white"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-slate-900">
                    {sec.title}
                  </h2>
                  {sec.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-2 tracking-wide max-w-lg mx-auto">
                      {sec.subtitle}
                    </p>
                  )}
                </div>

                {/* 3-Card Visual Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                  {banners.map((cat, idx) => (
                    <Link
                      key={idx}
                      to={cat.link || '/products'}
                      className="group relative block aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] rounded-lg overflow-hidden bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                    >
                      <img
                        src={cat.image}
                        alt={`${cat.tag || ''} ${cat.title}`}
                        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                        loading="lazy"
                      />

                      {/* Multi-layer Gradients */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                      <div className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none group-hover:border-white/30 transition-colors" />

                      {/* Bottom Typography */}
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col items-center justify-end text-center text-white z-10">
                        {cat.tag && (
                          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-rose-200/90 mb-1 drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                            {cat.tag}
                          </span>
                        )}

                        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-white mb-2 drop-shadow-md">
                          {cat.title}
                        </h3>

                        {cat.description && (
                          <p className="text-[11px] sm:text-xs text-slate-200/90 font-normal line-clamp-1 max-w-[280px] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            {cat.description}
                          </p>
                        )}

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
        }

        // ============================================================
        // 2. PRODUCT GRID (New Arrivals / Trending / Deals / Category)
        // ============================================================
        if (sec.type === 'product_grid') {
          const filterBy = sec.config?.filterBy || 'trending';
          const isNewArrivals =
            filterBy === 'new' ||
            sec.title.toLowerCase().includes('new arrival');
          const isTrending =
            filterBy === 'trending' ||
            sec.title.toLowerCase().includes('trending');

          // Case A: NEW ARRIVALS with Category Tabs
          if (isNewArrivals) {
            const rawProducts = getFilteredProducts(sec);
            const filteredByTab = rawProducts.filter((p) => {
              if (newArrivalsTab === 'All') return true;
              return p.category?.toLowerCase() === newArrivalsTab.toLowerCase();
            });
            const displayProducts =
              filteredByTab.length > 0 ? filteredByTab : rawProducts;

            return (
              <section
                key={sec._id || sec.id}
                className="py-12 sm:py-16 bg-slate-50/70 border-y border-slate-200/60"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Header */}
                  <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2.5 border border-rose-200">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                      <span>Fresh Off The Looms</span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.15em] text-slate-900">
                      {sec.title}
                    </h2>
                    {sec.subtitle && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg tracking-wide">
                        {sec.subtitle}
                      </p>
                    )}

                    {/* Category Filter Tabs */}
                    <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 mt-6 p-1 bg-white border border-slate-200 rounded-full shadow-xs max-w-full overflow-x-auto no-scrollbar">
                      {(['All', 'Sarees', 'Lehengas', 'Salwar Suits'] as const).map(
                        (tab) => (
                          <button
                            key={tab}
                            onClick={() => setNewArrivalsTab(tab)}
                            className={`px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap ${
                              newArrivalsTab === tab
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'text-slate-600 hover:text-black hover:bg-slate-100'
                            }`}
                          >
                            {tab === 'All' ? 'All Collections' : tab}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Product Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                    {displayProducts.slice(0, sec.config?.limit || 8).map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>

                  {/* Bottom CTA */}
                  <div className="text-center mt-10 sm:mt-12">
                    <Link
                      to={
                        newArrivalsTab === 'All'
                          ? sec.config?.ctaLink || '/products?sort=newest'
                          : `/products?category=${encodeURIComponent(newArrivalsTab)}`
                      }
                      className="inline-flex items-center gap-2 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xs transition-all duration-300 shadow-xs hover:shadow-md"
                    >
                      <span>
                        {sec.config?.ctaText || `VIEW ALL ${newArrivalsTab.toUpperCase()} NEW ARRIVALS`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </section>
            );
          }

          // Case B: TRENDING RIGHT NOW (House of Indya Signature Style)
          if (isTrending) {
            const displayProducts = getFilteredProducts(sec);

            return (
              <section
                key={sec._id || sec.id}
                className="py-12 sm:py-16 bg-white"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4 pb-2 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
                        <Flame className="w-4 h-4 fill-rose-600 text-rose-600" />
                        <span>Trending Right Now</span>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.15em] text-slate-900">
                        {sec.title}
                      </h2>
                      {sec.subtitle && (
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                          {sec.subtitle}
                        </p>
                      )}
                    </div>

                    <Link
                      to={sec.config?.ctaLink || '/products?sort=recommended'}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 uppercase tracking-widest group shrink-0 transition"
                    >
                      <span>{sec.config?.ctaText || 'View All Trending'}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                    {displayProducts.slice(0, sec.config?.limit || 8).map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // Case C: Standard Deals / Category / Other Product Grids
          const displayProducts = getFilteredProducts(sec);
          if (displayProducts.length === 0) return null;

          return (
            <section
              key={sec._id || sec.id}
              className="py-10 md:py-14 bg-white border-b border-slate-100"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      {sec.title}
                    </h2>
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

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                  {displayProducts.slice(0, sec.config?.limit || 8).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // ============================================================
        // 3. EDITORIAL CAMPAIGN BANNER (Wholesale / Bridal Program - FULL WIDTH)
        // ============================================================
        if (sec.type === 'campaign_banner') {
          const promo = sec.config?.banners?.[0];
          const bgImg =
            promo?.image ||
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=80';

          return (
            <section
              key={sec._id || sec.id}
              className="w-full relative overflow-hidden bg-slate-950 my-6 sm:my-10"
            >
              {/* Full-Width Background Image with Cinematic Edge-to-Edge Overlay */}
              <div className="absolute inset-0">
                <img
                  src={bgImg}
                  alt={sec.title}
                  className="w-full h-full object-cover object-top scale-100 hover:scale-102 transition-transform duration-1000 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 sm:bg-gradient-to-r sm:from-black/25 sm:via-black/65 sm:to-black/95" />
              </div>

              {/* Inner Content Grid */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[440px] sm:min-h-[500px] md:min-h-[560px] flex items-center justify-end py-12 sm:py-16">
                <div className="w-full sm:max-w-xl md:max-w-2xl text-white text-center sm:text-right flex flex-col items-center sm:items-end">
                  {/* Weavera Logo & Badge */}
                  <div className="inline-flex items-center gap-2 mb-3 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                    <img
                      src="/logo.png"
                      alt="Weavera Logo"
                      className="w-5 h-5 object-contain rounded-full shrink-0"
                      onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                    />
                    <span className="font-serif text-xs font-bold tracking-[0.25em] text-white uppercase">
                      {promo?.badge || 'WEAVERA WHOLESALE'}
                    </span>
                  </div>

                  {/* Subtitle */}
                  {sec.subtitle && (
                    <p className="text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-amber-200 mb-2">
                      {sec.subtitle}
                    </p>
                  )}

                  {/* Main Headline */}
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3 md:mb-4 leading-tight">
                    {sec.title}
                  </h2>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-200 font-normal mb-6 max-w-lg leading-relaxed text-center sm:text-right drop-shadow-sm">
                    {sec.config?.description ||
                      'Source authentic handcrafted sarees, bridal lehengas & designer salwar suits direct from master looms with wholesale pricing, worldwide express shipping & custom tailor finishing.'}
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

                  {/* Actions: Primary & Secondary CTAs */}
                  <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end w-full">
                    <Link
                      to={sec.config?.ctaLink || '/contact?type=wholesale'}
                      className="w-full sm:w-auto text-center justify-center bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-3.5 text-xs uppercase tracking-widest transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 rounded-xs inline-flex items-center"
                    >
                      {sec.config?.ctaText || 'SIGN UP NOW'}
                    </Link>

                    {sec.config?.secondaryCtaText && (
                      <Link
                        to={sec.config?.secondaryCtaLink || '/products?category=Lehengas'}
                        className="w-full sm:w-auto text-center justify-center border border-white/80 hover:bg-white/10 text-white font-bold px-7 py-3.5 text-xs uppercase tracking-widest transition-all duration-300 backdrop-blur-xs rounded-xs inline-flex items-center gap-1.5"
                      >
                        <span>{sec.config.secondaryCtaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // ============================================================
        // 4. STORY CIRCLES (Ethnic Collections Stories)
        // ============================================================
        if (sec.type === 'story_circles') {
          return (
            <div key={sec._id || sec.id}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
                <div className="text-center">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {sec.title}
                  </h2>
                  {sec.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      {sec.subtitle.replace(/Surat\s*/gi, '')}
                    </p>
                  )}
                </div>
              </div>
              <StoryCircles />
            </div>
          );
        }

        // ============================================================
        // 5. BANNER GRID (Split Promotional Cards)
        // ============================================================
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

        return null;
      })}
    </div>
  );
};

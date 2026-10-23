import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { bannerService } from '../../services/bannerService';
import type { BannerItem } from '../../types';

const CACHE_KEY = 'weavera_cached_hero_banners';

// Active Weavera ethnic wear slides matching the MongoDB Atlas database catalog
const defaultSlides: Partial<BannerItem>[] = [
  {
    id: 'default-1',
    title: 'ROYAL HERITAGE SILK SAREES',
    subtitle: 'Direct from master weavers. Pure Zari Banarasi & Kanjivaram masterpieces.',
    badge: 'FESTIVE EDIT 2026',
    desktopImage: 'https://weaverstory.com/cdn/shop/articles/From_Runway_to_Realway__Sonam_Bajwa_s_Red_Banarasi_Saree_Look_by_WeaverStory_Cover.png?v=1677233233',
    mobileImage: 'https://cdn.shopify.com/s/files/1/0728/2350/5141/files/marriage_wedding_silk_sarees_collection_-_Vandana_Sarees.jpg?v=1755116749',
    ctaText: 'Shop Sarees',
    ctaLink: '/products?category=Sarees',
    textColor: 'light',
    alignment: 'left',
    order: 1
  },
  {
    id: 'default-2',
    title: 'BRIDAL & CELEBRATION LEHENGAS',
    subtitle: 'Intricate handcrafted zardozi, sequins & velvet silhouettes for your special day.',
    badge: 'WEDDING COUTURE',
    desktopImage: 'https://shoproohani.com/cdn/shop/files/emerald-green-floral-lehenga-9459708.jpg?v=1778466311&width=1946',
    mobileImage: 'https://kundansbridalcouture.com/cdn/shop/files/Full-length_front_view_of_a_model_in_a_red_bridal_lehenga.png?v=1778623209&width=1000',
    ctaText: 'Explore Lehengas',
    ctaLink: '/products?category=Lehengas',
    textColor: 'light',
    alignment: 'left',
    order: 2
  },
  {
    id: 'default-3',
    title: 'READY-TO-WEAR SUITS & ANARKALIS',
    subtitle: 'Breezy georgettes, flared anarkalis & festive shararas with designer dupatta.',
    badge: 'NEW ARRIVALS',
    desktopImage: 'https://varnikalifestyle.in/cdn/shop/files/kurti-collection-hero-banner-resize.png?v=1784366983&width=3840',
    mobileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dFyTOYm3DN9pm7eESnB_cu5oDgsM-FxlmHyaiq0_eFj8NCfWU9z5T9i-&s=10',
    ctaText: 'Discover Suits',
    ctaLink: '/products?category=Salwar%20Suits',
    textColor: 'light',
    alignment: 'center',
    order: 3
  }
];

const getInitialBanners = (): BannerItem[] => {
  if (typeof window === 'undefined') return defaultSlides as BannerItem[];
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}
  return defaultSlides as BannerItem[];
};

export const HeroCarousel: React.FC = () => {
  const [banners, setBanners] = useState<BannerItem[]>(getInitialBanners);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchBanners = async () => {
      try {
        const res = await bannerService.getBanners();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          const sorted = [...res.data].sort((a, b) => (a.order || 0) - (b.order || 0));
          setBanners(sorted);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(sorted));
          } catch (_) {}
        }
      } catch (err) {
        console.warn('Failed to fetch hero banners:', err);
      }
    };
    fetchBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  const slides = (banners && banners.length > 0 ? banners : defaultSlides) as BannerItem[];

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const slide = slides[currentSlide] || slides[0];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      aria-label="Hero Carousel"
      className="relative w-full overflow-hidden bg-slate-950 text-white select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Image with Parallax & Dark Overlay */}
      <div className="relative w-full h-[480px] sm:h-[540px] md:h-[600px] lg:h-[640px] overflow-hidden">
        {/* Mobile Device Banner Image (< 768px md) */}
        {slide.mobileImage ? (
          <img
            key={`mobile-${slide.id || (slide as any)._id || currentSlide}`}
            src={slide.mobileImage}
            alt={slide.title}
            loading="eager"
            fetchPriority="high"
            className="block md:hidden w-full h-full object-cover object-top transition-all duration-1000 ease-out transform scale-100 group-hover:scale-102"
          />
        ) : null}

        {/* Desktop / Large Screen Banner Image (>= 768px md) */}
        <img
          key={`desktop-${slide.id || (slide as any)._id || currentSlide}`}
          src={slide.desktopImage}
          alt={slide.title}
          loading="eager"
          fetchPriority="high"
          className={`${slide.mobileImage ? 'hidden md:block' : 'block'} w-full h-full object-cover object-top transition-all duration-1000 ease-out transform scale-100 group-hover:scale-102`}
        />

        {/* Dynamic Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 md:bg-gradient-to-r md:from-black/85 md:via-black/50 md:to-transparent" />

        {/* Content Container */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div
            className={`max-w-2xl py-8 ${
              slide.alignment === 'center'
                ? 'mx-auto text-center'
                : slide.alignment === 'right'
                ? 'ml-auto text-right'
                : 'text-left'
            }`}
          >
            {/* Pill Badge */}
            {slide.badge && (
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-amber-200 text-[10px] sm:text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-[0.25em] mb-4 border border-white/20 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {slide.badge}
              </span>
            )}

            {/* Main Headline (House of Indya Signature Luxury) */}
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[0.08em] sm:tracking-[0.1em] text-white mb-3 md:mb-4 leading-tight drop-shadow-xl uppercase">
              {slide.title}
            </h1>

            {/* Subtitle */}
            {slide.subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-slate-100 mb-7 leading-relaxed max-w-xl font-normal drop-shadow-md">
                {slide.subtitle}
              </p>
            )}

            {/* Action CTA Button (Clean Sharp House of Indya Boxed Button) */}
            <div className="flex items-center gap-3 pt-1">
              <Link
                to={slide.ctaLink || '/products'}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-900 text-slate-900 hover:text-white font-bold px-7 sm:px-9 py-3.5 text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-2xl hover:scale-105 rounded-xs"
              >
                <span>{slide.ctaText || 'Shop Collection'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Carousel Pagination Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? 'w-8 h-2 bg-rose-500 shadow-md shadow-rose-500/50'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

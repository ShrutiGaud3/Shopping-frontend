import React, { useRef, useEffect } from 'react';
import { Star, CheckCircle2, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Rhea Sharma',
    location: 'Mumbai, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '12 February 2026',
    comment: 'The Banarasi Katan Silk saree from Weavera exceeded my expectations! The zari weave is genuine gold finish, and the drape is pure royal perfection.',
    productName: "Pure Banarasi Katan Silk Saree"
  },
  {
    id: 'rev-2',
    name: 'Ananya Roy',
    location: 'New Delhi',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '28 January 2026',
    comment: 'I ordered the Crimson Velvet Bridal Lehenga for my wedding reception. The custom blouse stitching and heavy flare are breathtaking! Got so many compliments.',
    productName: "Velvet Bridal Heritage Lehenga"
  },
  {
    id: 'rev-3',
    name: 'Kavya Patel',
    location: 'Ahmedabad, Gujarat',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '04 February 2026',
    comment: 'Direct loom manufacturing pricing with express delivery! The Georgette Anarkali suit fabric feels luxurious and came with immaculate finishing.',
    productName: "Embroidered Georgette Anarkali Set"
  }
];

export const CustomerReviews: React.FC = () => {
  const { allReviews, fetchAllReviews } = useShop();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  // Automatic Smooth Horizontal Carousel Timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayList = allReviews.length > 0
    ? allReviews.map((r) => ({
        id: r.id || r._id || `rev-${Math.random()}`,
        name: r.userName || 'Fashion Enthusiast',
        location: r.userLocation || 'India',
        avatar: r.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: r.rating || 5,
        date: r.date || 'Recent',
        comment: r.comment,
        productName: (typeof r.product === 'object' && (r.product as any)?.name) || r.productName || 'Weavera Pure Silk / Bridal Item'
      }))
    : DEFAULT_REVIEWS;

  return (
    <section className="py-16 md:py-24 bg-gray-50/70 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Nav Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gray-400 block mb-2">
              VOICES OF WEAVERA
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              What Our Clients Say
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Real reviews and style experiences from our valued fashion community.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            {/* Aggregate Rating Badge */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 border border-gray-200 rounded-sm shadow-xs text-xs">
              <span className="font-bold text-sm text-gray-900">4.8</span>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-gray-500 font-medium">| {displayList.length}+ Reviews</span>
            </div>

            {/* Scroll Control Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 bg-white hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-xs"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 bg-white hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-xs"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Scrollbar Track with Automatic Smooth Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-2 pt-2 scroll-smooth w-full"
        >
          {displayList.map((review) => (
            <div
              key={review.id}
              className="w-[300px] sm:w-[360px] md:w-[380px] shrink-0 bg-white p-6 md:p-8 border border-gray-200/90 rounded-sm shadow-xs flex flex-col justify-between relative group hover:border-gray-300 transition-all"
            >
              <Quote className="w-8 h-8 text-gray-200 absolute top-6 right-6 opacity-60 group-hover:text-gray-300 transition-colors" />
              
              <div>
                {/* Rating Stars & Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400">{review.date}</span>
                </div>

                {/* Comment */}
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed italic mb-6">
                  "{review.comment}"
                </p>
              </div>

              {/* User Profile & Purchased Item Tag */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                      {review.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </h4>
                    <span className="text-[11px] text-gray-400 block">{review.location}</span>
                  </div>
                </div>

                <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-xs">
                  Purchased: {review.productName}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, RotateCcw, Sparkles, ShieldCheck, Tag, Heart } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const PromoStrip: React.FC = () => {
  const { marquees } = useSettings();

  const getIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'truck':
        return <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />;
      case 'rotate':
        return <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />;
      case 'sparkles':
        return <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />;
      case 'tag':
        return <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />;
      case 'heart':
        return <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 shrink-0" />;
      case 'shield':
      default:
        return <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 shrink-0" />;
    }
  };

  const defaultItems = [
    { text: 'FREE EXPRESS SHIPPING ON ORDERS ABOVE ₹999', icon: 'truck', link: '/products' },
    { text: 'GENUINE HANDLOOM DIRECT MANUFACTURING PRICES', icon: 'sparkles', link: '/products' },
    { text: 'EASY 7-DAY DOORSTEP RETURNS & REPLACEMENTS', icon: 'rotate', link: '/pages/return-policy' },
    { text: 'ORDER DIRECTLY ON WHATSAPP FOR INSTANT DISPATCH', icon: 'shield', link: '' }
  ];

  const activeItems = (
    marquees && marquees.length > 0
      ? marquees.filter((m) => m.isActive !== false)
      : defaultItems
  ).filter((m) => !/surat/i.test(m.text));

  // Duplicate items for seamless continuous looping marquee on all screens
  const marqueeList = [...activeItems, ...activeItems, ...activeItems, ...activeItems];

  return (
    <div
      aria-label="Promotional announcements"
      className="bg-[#BEDAA9] text-[#183812] py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold tracking-widest uppercase border-y border-[#A3C68C] overflow-hidden relative select-none w-full shadow-xs"
    >
      {/* Left Gradient Fade Mask */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#BEDAA9] via-[#BEDAA9]/90 to-transparent z-10" />

      {/* Infinite Seamless Scrolling Ticker Track */}
      <div className="flex animate-marquee items-center">
        {marqueeList.map((item, idx) => {
          const content = (
            <div className="inline-flex items-center gap-2 text-[#183812] hover:text-[#0E250A] transition-colors duration-200 whitespace-nowrap px-4 sm:px-6">
              {getIcon(item.icon)}
              <span className="tracking-widest font-extrabold">{item.text}</span>
              <span className="text-[#2E5424] mx-2 text-[10px] select-none">✦</span>
            </div>
          );

          return item.link ? (
            <Link key={idx} to={item.link} className="inline-flex items-center shrink-0">
              {content}
            </Link>
          ) : (
            <div key={idx} className="inline-flex items-center shrink-0">
              {content}
            </div>
          );
        })}
      </div>

      {/* Right Gradient Fade Mask */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#BEDAA9] via-[#BEDAA9]/90 to-transparent z-10" />
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, RotateCcw, Sparkles, ShieldCheck, Tag, Heart } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const PromoStrip: React.FC = () => {
  const { marquees } = useSettings();

  const getIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'truck':
        return <Truck className="w-4 h-4 text-emerald-400" />;
      case 'rotate':
        return <RotateCcw className="w-4 h-4 text-sky-400" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'tag':
        return <Tag className="w-4 h-4 text-rose-400" />;
      case 'heart':
        return <Heart className="w-4 h-4 text-red-400" />;
      case 'shield':
      default:
        return <ShieldCheck className="w-4 h-4 text-teal-400" />;
    }
  };

  const defaultItems = [
    { text: 'FREE EXPRESS SHIPPING ON ORDERS ABOVE ₹999', icon: 'truck', link: '/products' },
    { text: 'GENUINE SURAT TEXTILE DIRECT MANUFACTURING PRICES', icon: 'sparkles', link: '/products' },
    { text: 'EASY 7-DAY DOORSTEP RETURNS & REPLACEMENTS', icon: 'rotate', link: '/pages/return-policy' },
    { text: 'ORDER DIRECTLY ON WHATSAPP FOR INSTANT DISPATCH', icon: 'shield', link: '' }
  ];

  const activeItems = (marquees && marquees.length > 0)
    ? marquees.filter((m) => m.isActive !== false)
    : defaultItems;

  return (
    <div className="bg-slate-950 text-white py-3 px-2 sm:px-4 text-[11px] sm:text-xs font-semibold tracking-wider uppercase border-y border-slate-800 overflow-hidden relative group">
      
      {/* Ticker Row */}
      <div className="flex items-center justify-around gap-4 sm:gap-8 flex-wrap md:flex-nowrap max-w-7xl mx-auto">
        {activeItems.map((item, idx) => {
          const content = (
            <div
              key={idx}
              className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors duration-200 py-1"
            >
              {getIcon(item.icon)}
              <span className="tracking-widest whitespace-nowrap">{item.text}</span>
            </div>
          );

          return item.link ? (
            <Link key={idx} to={item.link} className="hover:underline flex items-center">
              {content}
            </Link>
          ) : (
            <div key={idx}>{content}</div>
          );
        })}
      </div>
    </div>
  );
};

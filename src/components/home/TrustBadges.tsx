import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  RotateCcw,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { trustBadgeService } from '../../services/trustBadgeService';
import type { TrustBadgeItem } from '../../types';

export const TrustBadges: React.FC = () => {
  const [badges, setBadges] = useState<TrustBadgeItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchBadges = async () => {
      try {
        const res = await trustBadgeService.getTrustBadges();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setBadges(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch trust badges:', err);
      }
    };
    fetchBadges();
    return () => {
      isMounted = false;
    };
  }, []);

  const defaultBadges: Partial<TrustBadgeItem>[] = [
    {
      id: 'default-1',
      title: 'Loom Direct Prices',
      subtitle: 'Wholesale factory rates with zero middlemen markups',
      icon: 'sparkles'
    },
    {
      id: 'default-2',
      title: 'Free Express Delivery',
      subtitle: 'On prepaid orders across India above ₹999',
      icon: 'truck'
    },
    {
      id: 'default-3',
      title: 'Cash on Delivery',
      subtitle: 'Pay at your doorstep across 19,000+ pin codes',
      icon: 'creditCard'
    },
    {
      id: 'default-4',
      title: '7-Day Easy Returns',
      subtitle: 'Hassle-free doorstep exchange and refund policy',
      icon: 'rotate'
    },
    {
      id: 'default-5',
      title: '100% Quality Checked',
      subtitle: 'Every saree & lehenga inspected before dispatch',
      icon: 'shield'
    }
  ];

  const items = (badges && badges.length > 0 ? badges : defaultBadges) as TrustBadgeItem[];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="w-5 h-5 text-emerald-600" />;
      case 'creditCard':
        return <CreditCard className="w-5 h-5 text-amber-600" />;
      case 'rotate':
        return <RotateCcw className="w-5 h-5 text-sky-600" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-rose-600" />;
      case 'check':
        return <CheckCircle className="w-5 h-5 text-indigo-600" />;
      case 'shield':
      default:
        return <ShieldCheck className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <section className="bg-white border-b border-slate-200/80 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {items.map((badge, idx) => (
            <div
              key={badge.id || idx}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-100 flex items-center justify-center shrink-0">
                {renderIcon(badge.icon)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 leading-snug truncate" title={badge.title}>
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 leading-tight mt-0.5">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

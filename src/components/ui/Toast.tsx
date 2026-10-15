import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useShop();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-sm shadow-2xl transition-all duration-300 animate-slide-up border border-gray-700">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="text-sm font-medium tracking-wide">{toast}</span>
    </div>
  );
};

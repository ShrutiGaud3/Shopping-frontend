import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const WhatsAppFloat: React.FC = () => {
  const { settings, openWhatsAppSupport } = useSettings();

  if (settings.whatsapp?.enabled === false) {
    return null;
  }

  const handleSupportClick = () => {
    openWhatsAppSupport();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
      {/* Tooltip Label */}
      <span className="hidden sm:inline-block bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Order on WhatsApp 💬
      </span>

      {/* Floating Action Button */}
      <button
        onClick={handleSupportClick}
        className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ring-4 ring-emerald-500/25 cursor-pointer"
        aria-label="Contact or Order on WhatsApp"
        title="Order or chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-emerald-500" />
      </button>
    </div>
  );
};

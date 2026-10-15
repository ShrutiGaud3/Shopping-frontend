import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, ChevronDown, MessageCircle, Phone, MapPin, Clock } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useShop();
  const { settings, openWhatsAppSupport } = useSettings();

  // Accordion toggle state for mobile footers
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Thank you for subscribing to VELORA Ethnic Fashion! ✨');
      setEmail('');
    }
  };

  return (
    <footer id="footer" className="bg-[#0A0E1A] text-white pt-12 md:pt-16 pb-12 border-t border-slate-800 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand & WhatsApp Quick Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12 border-b border-slate-800 pb-6 md:pb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest text-white">
                {settings.branding?.storeName || 'VELORA'}
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {settings.branding?.tagline || "India's Finest Ethnic & Festive Fashion Direct from Surat"}
            </p>
          </div>

          <button
            onClick={() => openWhatsAppSupport()}
            className="flex items-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp ({settings.whatsapp?.number || '+91 98765 43210'})</span>
          </button>
        </div>

        {/* Multi-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-12 md:mb-16 text-xs text-slate-400">
          
          {/* Column 1: Ethnic Categories */}
          <div className="border-b md:border-b-0 border-slate-800/80 pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('ethnic')}
              className="w-full flex items-center justify-between font-bold text-sm text-white uppercase tracking-wider mb-2 md:mb-4 py-1 md:py-0 text-left"
            >
              <span>Ethnic Wear</span>
              <ChevronDown className={`w-4 h-4 md:hidden text-slate-400 transition-transform duration-300 ${openSections['ethnic'] ? 'rotate-180 text-white' : ''}`} />
            </button>
            <ul className={`space-y-2.5 pt-1 md:pt-0 ${openSections['ethnic'] ? 'block' : 'hidden md:block'}`}>
              <li><Link to="/products?category=Sarees" className="hover:text-rose-400 transition-colors">Silk &amp; Designer Sarees</Link></li>
              <li><Link to="/products?category=Lehengas" className="hover:text-rose-400 transition-colors">Bridal &amp; Party Lehengas</Link></li>
              <li><Link to="/products?category=Salwar%20Suits" className="hover:text-rose-400 transition-colors">Anarkali &amp; Sharara Suits</Link></li>
              <li><Link to="/products?category=Kurtis" className="hover:text-rose-400 transition-colors">Kurtis &amp; Festive Tunics</Link></li>
              <li><Link to="/products?category=Gowns" className="hover:text-rose-400 transition-colors">Indo-Western Gowns</Link></li>
            </ul>
          </div>

          {/* Column 2: Customer Policies (Dynamic CMS Pages) */}
          <div className="border-b md:border-b-0 border-slate-800/80 pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('policies')}
              className="w-full flex items-center justify-between font-bold text-sm text-white uppercase tracking-wider mb-2 md:mb-4 py-1 md:py-0 text-left"
            >
              <span>Customer Care</span>
              <ChevronDown className={`w-4 h-4 md:hidden text-slate-400 transition-transform duration-300 ${openSections['policies'] ? 'rotate-180 text-white' : ''}`} />
            </button>
            <ul className={`space-y-2.5 pt-1 md:pt-0 ${openSections['policies'] ? 'block' : 'hidden md:block'}`}>
              <li><Link to="/pages/about-us" className="hover:text-rose-400 transition-colors">About Us</Link></li>
              <li><Link to="/pages/shipping-policy" className="hover:text-rose-400 transition-colors">Shipping &amp; Delivery</Link></li>
              <li><Link to="/pages/return-policy" className="hover:text-rose-400 transition-colors">Returns &amp; Exchange Policy</Link></li>
              <li><Link to="/pages/terms-and-conditions" className="hover:text-rose-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/pages/privacy-policy" className="hover:text-rose-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/pages/faq" className="hover:text-rose-400 transition-colors">Frequently Asked Questions (FAQ)</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation & Account */}
          <div className="border-b md:border-b-0 border-slate-800/80 pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('account')}
              className="w-full flex items-center justify-between font-bold text-sm text-white uppercase tracking-wider mb-2 md:mb-4 py-1 md:py-0 text-left"
            >
              <span>My Account</span>
              <ChevronDown className={`w-4 h-4 md:hidden text-slate-400 transition-transform duration-300 ${openSections['account'] ? 'rotate-180 text-white' : ''}`} />
            </button>
            <ul className={`space-y-2.5 pt-1 md:pt-0 ${openSections['account'] ? 'block' : 'hidden md:block'}`}>
              <li><Link to="/orders" className="hover:text-rose-400 transition-colors">Track My Order</Link></li>
              <li><Link to="/cart" className="hover:text-rose-400 transition-colors">Shopping Bag</Link></li>
              <li><Link to="/wishlist" className="hover:text-rose-400 transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-rose-400 transition-colors">My Profile</Link></li>
              <li><Link to="/contact" className="hover:text-rose-400 transition-colors">Contact Support Desk</Link></li>
            </ul>
          </div>

          {/* Column 4: Store Support & Address */}
          <div className="border-b md:border-b-0 border-slate-800/80 pb-4 md:pb-0">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3 md:mb-4">
              Store Contact
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{settings.support?.address || 'Ring Road Textile Market, Surat, Gujarat - 395002'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{settings.support?.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.support?.email || 'support@velora.in'}</span>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-slate-800/60">
                <Clock className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300">{settings.workingHours?.days || 'Mon - Sat'}</span>
                  <span>{settings.workingHours?.timing || '10:00 AM - 8:00 PM IST'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 5: Stay In Touch (Newsletter) */}
          <div className="pt-2 md:pt-0 text-left">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3 md:mb-4">
              Festive Club
            </h4>
            <p className="text-slate-400 mb-4 text-xs leading-relaxed">
              Subscribe to get exclusive Surat manufacturer prices, festival drop previews &amp; VIP discount codes.
            </p>
            <form onSubmit={handleSubscribe} className="relative max-w-sm mb-4">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-sm py-2.5 pl-3 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                aria-label="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex items-center gap-3 text-slate-400 pt-2">
              <a
                href={settings.branding?.socialLinks?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-rose-400 transition p-1.5 rounded-full hover:bg-slate-800"
                title="Instagram"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={settings.branding?.socialLinks?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 transition p-1.5 rounded-full hover:bg-slate-800"
                title="Facebook"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href={settings.branding?.socialLinks?.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-500 transition p-1.5 rounded-full hover:bg-slate-800"
                title="YouTube"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-slate-400">
            <Link to="/pages/terms-and-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <Link to="/pages/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/pages/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link>
            <Link to="/pages/faq" className="hover:text-white transition-colors">FAQs</Link>
          </div>

          <p>{settings.branding?.footerText || '© 2026 VELORA Ethnic Fashion Inc. All rights reserved.'}</p>
        </div>

      </div>
    </footer>
  );
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Setting, MarqueeItem, Product, CartItem } from '../types';
import { settingService } from '../services/settingService';
import { marqueeService } from '../services/marqueeService';

interface SettingsContextType {
  settings: Setting;
  marquees: MarqueeItem[];
  loading: boolean;
  openWhatsAppSupport: (customMsg?: string) => void;
  openWhatsAppProduct: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  openWhatsAppCart: (cartItems: CartItem[], totalAmount: number) => void;
}

const defaultSettings: Setting = {
  announcements: [
    { text: '✨ Free Express Shipping on prepaid orders above ₹999!', link: '/products', isActive: true },
    { text: '🌟 Special Festive Offer: Get 10% Extra Off on Sarees & Lehengas', link: '/products', isActive: true },
    { text: '💬 Order directly on WhatsApp with Instant Confirmation!', link: '', isActive: true }
  ],
  whatsapp: {
    number: '919876543210',
    defaultMessage: 'Hello Weavera! 👋 I am interested in placing an order or inquiring about ethnic wear.',
    enabled: true
  },
  support: {
    phone: '+91 98765 43210',
    email: 'support@weavera.in',
    address: 'Weavera Fashion Studio, India'
  },
  workingHours: {
    days: 'Monday - Saturday',
    timing: '10:00 AM - 8:00 PM IST'
  },
  cod: {
    enabled: true,
    extraFee: 49,
    thresholdForFreeCOD: 1999
  },
  shipping: {
    freeShippingThreshold: 999,
    standardFee: 99
  },
  branding: {
    storeName: 'Weavera',
    tagline: "Weaving, Tradition , Wearing Elegance",
    footerText: '© 2026 Weavera Ethnic Fashion Inc. All rights reserved.',
    socialLinks: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com',
      pinterest: 'https://pinterest.com'
    }
  },
  seo: {
    metaTitle: 'Weavera | Authentic Ethnic Wear, Sarees, Lehengas & Salwar Suits',
    metaDescription: 'Shop exquisite Indian ethnic wear - sarees, lehengas, and salwar suits.'
  }
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Setting>(defaultSettings);
  const [marquees, setMarquees] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSiteData = async () => {
      try {
        const [settingsRes, marqueeRes] = await Promise.all([
          settingService.getSettings(),
          marqueeService.getMarquees()
        ]);

        if (isMounted) {
          if (settingsRes.success && settingsRes.data) {
            setSettings(settingsRes.data);
          }
          if (marqueeRes.success && marqueeRes.data) {
            setMarquees(marqueeRes.data);
          }
        }
      } catch (err) {
        console.warn('Error loading settings or marquee items:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSiteData();
    return () => {
      isMounted = false;
    };
  }, []);

  const openWhatsAppUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openWhatsAppSupport = (customMsg?: string) => {
    const rawNumber = settings.whatsapp?.number || '919876543210';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const message = customMsg || settings.whatsapp?.defaultMessage || 'Hello Weavera Support! 👋 I need assistance.';
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    openWhatsAppUrl(url);
  };

  const openWhatsAppProduct = (product: Product, selectedSize: string = 'M', selectedColor: string = 'Default') => {
    const rawNumber = settings.whatsapp?.number || '919876543210';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const productUrl = window.location.href;
    const message = `Hello Weavera! 👋\n\nI would like to order this item directly via WhatsApp:\n\n🛍️ *Product:* ${product.name}\n🏷️ *Brand:* ${product.brand}\n💰 *Price:* ₹${product.price.toLocaleString()}\n📏 *Size:* ${selectedSize}\n🎨 *Color:* ${selectedColor}\n🔗 *Link:* ${productUrl}\n\nPlease confirm availability and payment details. Thank you!`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    openWhatsAppUrl(url);
  };

  const openWhatsAppCart = (cartItems: CartItem[], totalAmount: number) => {
    const rawNumber = settings.whatsapp?.number || '919876543210';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    let itemsList = '';
    cartItems.forEach((item, index) => {
      const pName = item.product.name;
      const pPrice = item.product.price;
      itemsList += `${index + 1}. *${pName}* (Qty: ${item.quantity}, Size: ${item.selectedSize}, Color: ${item.selectedColor}) - ₹${(pPrice * item.quantity).toLocaleString()}\n`;
    });

    const message = `Hello Weavera Express Support! 🛍️\n\nI would like to place an order for my Shopping Bag items:\n\n${itemsList}\n💳 *Total Order Amount:* ₹${totalAmount.toLocaleString()}\n\nPlease verify my cart items and share payment instructions!`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    openWhatsAppUrl(url);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        marquees,
        loading,
        openWhatsAppSupport,
        openWhatsAppProduct,
        openWhatsAppCart
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

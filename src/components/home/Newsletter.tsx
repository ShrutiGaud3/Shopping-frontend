import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useShop();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Welcome to VELORA Insiders Club! ✨');
      setEmail('');
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white border-b border-gray-100 text-center">
      <div className="max-w-2xl mx-auto px-4">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gray-400 block mb-3">
          STAY IN STYLE
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Join the VELORA Journal
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-8 leading-relaxed">
          Sign up for new seasonal drops, exclusive VIP sales, and private editorial preview access.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-300 rounded-sm px-4 py-3 text-xs md:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
          />
          <button
            type="submit"
            className="bg-gray-900 text-white font-semibold text-xs md:text-sm px-8 py-3 uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-sm"
          >
            SUBSCRIBE
          </button>
        </form>

        <p className="text-[11px] text-gray-400 mt-4">
          By signing up, you agree to VELORA Privacy Policy & Terms. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

import React from 'react';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { PromoStrip } from '../components/home/PromoStrip';
import { DynamicHomeSections } from '../components/home/DynamicHomeSections';
import { TrustBadges } from '../components/home/TrustBadges';
import { CustomerReviews } from '../components/home/CustomerReviews';
import { Newsletter } from '../components/home/Newsletter';

export const Home: React.FC = () => {
  return (
    <main className="w-full">
      {/* 1. Dynamic Hero Banners Carousel (House of Indya Signature Luxury) */}
      <HeroCarousel />

      {/* 2. Scrolling Ticker Announcement Strip */}
      <PromoStrip />

      {/* 3. Fully Dynamic Sections Managed from Admin Panel */}
      <DynamicHomeSections />

      {/* 4. Authenticity Trust Badges */}
      <TrustBadges />

      {/* 5. Verified Customer Reviews */}
      <CustomerReviews />

      {/* 6. VIP Newsletter & Exclusive Drops */}
      <Newsletter />
    </main>
  );
};

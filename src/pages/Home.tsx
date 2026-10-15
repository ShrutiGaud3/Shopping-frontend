import React from 'react';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { PromoStrip } from '../components/home/PromoStrip';
import { TrustBadges } from '../components/home/TrustBadges';
import { DynamicHomeSections } from '../components/home/DynamicHomeSections';
import { CustomerReviews } from '../components/home/CustomerReviews';
import { Newsletter } from '../components/home/Newsletter';

export const Home: React.FC = () => {
  return (
    <main className="w-full">
      {/* Dynamic Hero Banners Carousel */}
      <HeroCarousel />

      {/* Dynamic Scrolling Ticker Strip */}
      <PromoStrip />

      {/* Dynamic Trust Badges & Guarantees */}
      <TrustBadges />

      {/* Dynamic Home Layout & Visual Merchandiser Sections */}
      <DynamicHomeSections />

      {/* Customer Trust Reviews */}
      <CustomerReviews />

      {/* Newsletter VIP Club */}
      <Newsletter />
    </main>
  );
};

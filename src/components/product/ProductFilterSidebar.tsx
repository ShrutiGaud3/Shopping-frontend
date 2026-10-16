import React, { useState } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';
import type { FilterState } from '../../types';

interface ProductFilterSidebarProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const CATEGORIES = [
  'Sarees',
  'Lehengas',
  'Salwar Suits'
];
const BRANDS = ['Weavera', 'Weavera Heritage', 'Weavera Bridal', 'Weavera Silk'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'One Size', 'Unstitched', 'Semi-Stitched'];
const FABRICS = [
  'Pure Kanjivaram Silk',
  'Banarasi Silk',
  'Georgette',
  'Velvet',
  'Organza',
  'Chanderi Silk',
  'Cotton Silk',
  'Rayon'
];
const OCCASIONS = [
  'Bridal & Wedding',
  'Festive & Puja',
  'Reception & Sangeet',
  'Party & Evening',
  'Casual & Daily'
];
const COLORS = [
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Green', hex: '#10B981' }
];

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  filterState,
  setFilterState,
  resetFilters,
  isMobile = false,
  onCloseMobile
}) => {
  // Accordion toggle state for filter sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    category: filterState.categories.length > 0,
    fabric: (filterState.fabrics && filterState.fabrics.length > 0) || false,
    occasion: (filterState.occasions && filterState.occasions.length > 0) || false,
    brand: filterState.brands.length > 0,
    color: filterState.colors.length > 0,
    discount: filterState.minDiscount > 0,
    size: filterState.sizes.length > 0
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCategory = (cat: string) => {
    setFilterState((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat]
      };
    });
  };

  const toggleFabric = (fabric: string) => {
    setFilterState((prev) => {
      const current = prev.fabrics || [];
      const exists = current.includes(fabric);
      return {
        ...prev,
        fabrics: exists ? current.filter((f) => f !== fabric) : [...current, fabric]
      };
    });
  };

  const toggleOccasion = (occasion: string) => {
    setFilterState((prev) => {
      const current = prev.occasions || [];
      const exists = current.includes(occasion);
      return {
        ...prev,
        occasions: exists ? current.filter((o) => o !== occasion) : [...current, occasion]
      };
    });
  };

  const toggleBrand = (brand: string) => {
    setFilterState((prev) => {
      const exists = prev.brands.includes(brand);
      return {
        ...prev,
        brands: exists ? [] : [brand]
      };
    });
  };

  const toggleSize = (size: string) => {
    setFilterState((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size]
      };
    });
  };

  const toggleColor = (colorName: string) => {
    setFilterState((prev) => {
      const exists = prev.colors.includes(colorName);
      return {
        ...prev,
        colors: exists ? prev.colors.filter((c) => c !== colorName) : [...prev.colors, colorName]
      };
    });
  };

  const setDiscount = (min: number) => {
    setFilterState((prev) => ({
      ...prev,
      minDiscount: prev.minDiscount === min ? 0 : min
    }));
  };

  return (
    <div className={`bg-white p-5 border border-gray-200 rounded-sm text-xs text-gray-800 shadow-xs ${isMobile ? 'h-full overflow-y-auto' : 'w-64 shrink-0'}`}>
      
      {/* Sidebar Header (Matching Reference Image 4) */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
        <h3 className="font-serif font-bold text-lg text-gray-900">Filters</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            Clear all
          </button>
          {isMobile && onCloseMobile && (
            <button onClick={onCloseMobile} className="p-1 text-gray-500 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Price Range Accordion (Matching Reference Image 4) */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between font-serif text-sm font-semibold text-gray-900 py-1 text-left"
        >
          <span>Price</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openSections['price'] ? 'rotate-180 text-gray-900' : ''}`} />
        </button>

        {openSections['price'] && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-gray-500 mb-2 font-medium">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Min</span>
                <span className="text-xs text-gray-900 font-bold">Rs. {filterState.priceRange[0]}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block uppercase">Max</span>
                <span className="text-xs text-gray-900 font-bold">Rs. {filterState.priceRange[1]}</span>
              </div>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={filterState.priceRange[1]}
              onChange={(e) =>
                setFilterState((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], Number(e.target.value)]
                }))
              }
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Category Accordion */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between font-serif text-sm font-semibold text-gray-900 py-1 text-left"
        >
          <span>Category</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openSections['category'] ? 'rotate-180 text-gray-900' : ''}`} />
        </button>

        {openSections['category'] && (
          <div className="mt-3 space-y-2 max-h-44 overflow-y-auto no-scrollbar pt-1">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                <input
                  type="checkbox"
                  checked={filterState.categories.some((c) => c.toLowerCase() === cat.toLowerCase())}
                  onChange={() => toggleCategory(cat)}
                  className="w-3.5 h-3.5 text-gray-900 border-gray-300 rounded-xs focus:ring-0"
                />
                <span className="text-xs text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Fabric Filter Accordion (Surat Loom Specialization) */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('fabric')}
          className="w-full flex items-center justify-between font-serif text-sm font-semibold text-gray-900 py-1 text-left"
        >
          <span>Fabric / Weave</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openSections['fabric'] ? 'rotate-180 text-gray-900' : ''}`} />
        </button>

        {openSections['fabric'] && (
          <div className="mt-3 space-y-2 max-h-44 overflow-y-auto no-scrollbar pt-1">
            {FABRICS.map((fabric) => (
              <label key={fabric} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                <input
                  type="checkbox"
                  checked={(filterState.fabrics || []).includes(fabric)}
                  onChange={() => toggleFabric(fabric)}
                  className="w-3.5 h-3.5 text-gray-900 border-gray-300 rounded-xs focus:ring-0"
                />
                <span className="text-xs text-gray-700">{fabric}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Occasion Filter Accordion */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('occasion')}
          className="w-full flex items-center justify-between font-serif text-sm font-semibold text-gray-900 py-1 text-left"
        >
          <span>Occasion</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openSections['occasion'] ? 'rotate-180 text-gray-900' : ''}`} />
        </button>

        {openSections['occasion'] && (
          <div className="mt-3 space-y-2 max-h-44 overflow-y-auto no-scrollbar pt-1">
            {OCCASIONS.map((occasion) => (
              <label key={occasion} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                <input
                  type="checkbox"
                  checked={(filterState.occasions || []).includes(occasion)}
                  onChange={() => toggleOccasion(occasion)}
                  className="w-3.5 h-3.5 text-gray-900 border-gray-300 rounded-xs focus:ring-0"
                />
                <span className="text-xs text-gray-700">{occasion}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 2. Brand Accordion (Matching Reference Image 4) */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('brand')}
          className="w-full flex items-center justify-between font-serif text-sm font-semibold text-gray-900 py-1 text-left"
        >
          <span>Brand</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openSections['brand'] ? 'rotate-180 text-gray-900' : ''}`} />
        </button>

        {openSections['brand'] && (
          <div className="mt-3 space-y-2 max-h-44 overflow-y-auto no-scrollbar pt-1">
            {BRANDS.map((brand) => (
              <label key={brand} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                <input
                  type="radio"
                  name="brand_filter"
                  checked={filterState.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-3.5 h-3.5 text-gray-900 border-gray-300 focus:ring-0 cursor-pointer"
                />
                <span className={`text-xs ${filterState.brands.includes(brand) ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 3. Color Accordion (Matching Reference Image 4) */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between font-serif text-sm font-semibold text-gray-900 py-1 text-left"
        >
          <span>Color</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openSections['color'] ? 'rotate-180 text-gray-900' : ''}`} />
        </button>

        {openSections['color'] && (
          <div className="mt-3 flex flex-wrap gap-2.5 pt-1">
            {COLORS.map((c) => {
              const active = filterState.colors.includes(c.name);
              return (
                <button
                  key={c.name}
                  onClick={() => toggleColor(c.name)}
                  title={c.name}
                  style={{ backgroundColor: c.hex }}
                  className={`w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center transition-transform ${
                    active ? 'scale-110 ring-2 ring-gray-900 ring-offset-1' : 'hover:scale-105'
                  }`}
                >
                  {active && (
                    <Check className={`w-3.5 h-3.5 ${c.name === 'White' || c.name === 'Beige' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Discount Range Accordion (Matching Reference Image 4) */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('discount')}
          className="w-full flex items-center justify-between font-serif text-sm font-semibold text-gray-900 py-1 text-left"
        >
          <span>Discount Range</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openSections['discount'] ? 'rotate-180 text-gray-900' : ''}`} />
        </button>

        {openSections['discount'] && (
          <div className="mt-3 space-y-2 pt-1">
            {[10, 30, 40, 50, 60].map((disc) => (
              <label key={disc} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                <input
                  type="radio"
                  name="discountFilter"
                  checked={filterState.minDiscount === disc}
                  onChange={() => setDiscount(disc)}
                  className="w-3.5 h-3.5 text-gray-900 border-gray-300 focus:ring-0"
                />
                <span className="text-xs text-gray-700">{disc}% and above</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 5. Size Accordion */}
      <div className="mb-2">
        <button
          onClick={() => toggleSection('size')}
          className="w-full flex items-center justify-between font-serif text-sm font-semibold text-gray-900 py-1 text-left"
        >
          <span>Size</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openSections['size'] ? 'rotate-180 text-gray-900' : ''}`} />
        </button>

        {openSections['size'] && (
          <div className="mt-3 flex flex-wrap gap-2 pt-1">
            {SIZES.map((sz) => {
              const active = filterState.sizes.includes(sz);
              return (
                <button
                  key={sz}
                  onClick={() => toggleSize(sz)}
                  className={`px-3 py-1.5 border rounded-xs font-medium text-xs transition-colors ${
                    active
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

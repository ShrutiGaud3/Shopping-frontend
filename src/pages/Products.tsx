import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilterSidebar } from '../components/product/ProductFilterSidebar';

export const Products: React.FC = () => {
  const { products, loadingProducts, filterState, setFilterState, resetFilters } = useShop();
  const [searchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const searchParamsString = searchParams.toString();

  // Sync URL parameters when URL query parameters change via navbar navigation
  useEffect(() => {
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const discount = searchParams.get('discount');
    const sort = searchParams.get('sort');
    const fabric = searchParams.get('fabric');
    const occasion = searchParams.get('occasion');

    setFilterState({
      categories: category ? [category] : [],
      genders: gender ? [gender] : [],
      brands: [],
      colors: [],
      sizes: [],
      fabrics: fabric ? [fabric] : [],
      occasions: occasion ? [occasion] : [],
      priceRange: [0, 10000],
      minDiscount: discount ? Number(discount) : 0,
      sortBy: sort ? (sort as any) : 'recommended',
      searchQuery: search !== null ? search : ''
    });
  }, [searchParamsString, setFilterState]);

  // Apply client-side filters guard for all criteria
  const filteredProducts = products.filter((product) => {
    // 1. Search Query
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase();
      const matches =
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);
      if (!matches) return false;
    }

    // 2. Gender / Section
    if (filterState.genders.length > 0) {
      const matchesGender = filterState.genders.some(
        (g) => product.gender.toLowerCase() === g.toLowerCase() || product.gender.toLowerCase() === 'unisex'
      );
      if (!matchesGender) return false;
    }

    // 3. Category
    if (filterState.categories.length > 0) {
      const matchesCategory = filterState.categories.some((c) => {
        const catStr = c.toLowerCase().trim();
        const prodCatStr = product.category.toLowerCase().trim();
        return (
          prodCatStr.includes(catStr) ||
          catStr.includes(prodCatStr) ||
          prodCatStr.includes(catStr.split(' ')[0]) ||
          (catStr.startsWith('access') && prodCatStr.startsWith('access'))
        );
      });
      if (!matchesCategory) return false;
    }

    // 4. Brand
    if (filterState.brands.length > 0) {
      if (!filterState.brands.includes(product.brand)) return false;
    }

    // 5. Colors
    if (filterState.colors.length > 0) {
      const hasColor = product.colors.some((c) =>
        filterState.colors.some((fc) => fc.toLowerCase() === c.name.toLowerCase())
      );
      if (!hasColor) return false;
    }

    // 6. Sizes
    if (filterState.sizes.length > 0) {
      const hasSize = product.sizes.some((s) => filterState.sizes.includes(s));
      if (!hasSize) return false;
    }

    // 7. Price Range
    if (product.price < filterState.priceRange[0] || product.price > filterState.priceRange[1]) {
      return false;
    }

    // 8. Minimum Discount
    if (filterState.minDiscount > 0 && product.discountPercent < filterState.minDiscount) {
      return false;
    }

    // 9. Fabric Filter (Surat Specialization)
    if (filterState.fabrics && filterState.fabrics.length > 0) {
      const matchFabric = filterState.fabrics.some((f) => {
        const prodFabric = (product.fabric || product.specifications?.fabric || '').toLowerCase();
        return prodFabric.includes(f.toLowerCase());
      });
      if (!matchFabric) return false;
    }

    // 10. Occasion Filter (Surat Specialization)
    if (filterState.occasions && filterState.occasions.length > 0) {
      const matchOccasion = filterState.occasions.some((o) => {
        const prodOccasion = (product.occasion || product.specifications?.occasion || '').toLowerCase();
        return prodOccasion.includes(o.toLowerCase());
      });
      if (!matchOccasion) return false;
    }

    return true;
  });

  // Apply sorting on filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filterState.sortBy === 'price-low') return a.price - b.price;
    if (filterState.sortBy === 'price-high') return b.price - a.price;
    if (filterState.sortBy === 'discount') return b.discountPercent - a.discountPercent;
    if (filterState.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0;
  });

  return (
    <div className="bg-gray-50/50 min-h-screen py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation (Matching Reference Image 3) */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Collections</span>
          {filterState.categories.length > 0 && (
            <>
              <span>/</span>
              <span className="text-gray-900 font-semibold">{filterState.categories.join(', ')}</span>
            </>
          )}
        </nav>

        {/* Page Title & Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
              {filterState.categories.length === 1 ? filterState.categories[0] : 'Ethnic Collection'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Showing {sortedProducts.length} of {products.length} products
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 rounded-sm text-xs font-semibold text-gray-800"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>

            {/* Sort Dropdown (Matching Reference Image 3) */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs">
              <span className="text-gray-500 font-medium">Sort By:</span>
              <select
                value={filterState.sortBy}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any
                  }))
                }
                className="bg-transparent text-gray-900 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Product Grid (Matching Reference Image 3 & 4) */}
        <div className="flex gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <ProductFilterSidebar
              filterState={filterState}
              setFilterState={setFilterState}
              resetFilters={resetFilters}
            />
          </div>

          {/* Product Grid Area */}
          <div className="flex-1">
            
            {loadingProducts ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 py-4 text-xs font-semibold text-gray-500 uppercase tracking-widest animate-pulse">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-900 border-t-transparent animate-spin" />
                  Fetching Catalog from Database...
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-sm overflow-hidden animate-pulse">
                      <div className="aspect-[3/4] bg-gray-200" />
                      <div className="p-3 space-y-2">
                        <div className="h-3 bg-gray-200 rounded-xs w-1/3" />
                        <div className="h-4 bg-gray-200 rounded-xs w-3/4" />
                        <div className="h-4 bg-gray-200 rounded-xs w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="bg-white p-12 text-center border border-gray-200 rounded-sm">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                  No products matched your criteria
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Try clearing some filters or searching for another term.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-gray-900 text-white text-xs font-semibold px-6 py-2.5 uppercase tracking-wider rounded-sm hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl ml-auto z-10">
            <ProductFilterSidebar
              filterState={filterState}
              setFilterState={setFilterState}
              resetFilters={resetFilters}
              isMobile
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
};

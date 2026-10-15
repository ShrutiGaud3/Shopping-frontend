import React, { useState, useEffect } from 'react';
import { X, Ruler, Sparkles, CheckCircle2, Info, ShoppingBag, Eye, ShieldAlert } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productCategory?: string;
  gender?: string;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  productCategory = 'Tops',
  gender = 'Women'
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [activeTab, setActiveTab] = useState<'tops' | 'bottoms' | 'footwear' | 'accessories'>('tops');

  // Auto-switch active tab based on product category when opened
  useEffect(() => {
    if (productCategory === 'Accessories') {
      setActiveTab('accessories');
    } else if (productCategory === 'Bottoms') {
      setActiveTab('bottoms');
    } else if (productCategory === 'Footwear' || productCategory === 'Shoes') {
      setActiveTab('footwear');
    } else {
      setActiveTab('tops');
    }
  }, [productCategory, isOpen]);

  // Interactive Fit Recommender state
  const [userBust, setUserBust] = useState<number | ''>('');
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRecommendSize = () => {
    if (!userBust || userBust <= 0) return;
    const valInInches = unit === 'cm' ? userBust / 2.54 : Number(userBust);

    if (valInInches <= 33) setRecommendedSize('XS');
    else if (valInInches <= 35) setRecommendedSize('S');
    else if (valInInches <= 38) setRecommendedSize('M');
    else if (valInInches <= 41) setRecommendedSize('L');
    else if (valInInches <= 44) setRecommendedSize('XL');
    else setRecommendedSize('XXL');
  };

  // Garment & Footwear Data
  const topsData = [
    { size: 'XS', bust: '31 - 32', waist: '24 - 25', hip: '34 - 35', shoulder: '14.0', length: '24.5', uk: 'UK 6' },
    { size: 'S', bust: '33 - 34', waist: '26 - 27', hip: '36 - 37', shoulder: '14.5', length: '25.0', uk: 'UK 8' },
    { size: 'M', bust: '35 - 37', waist: '28 - 30', hip: '38 - 40', shoulder: '15.0', length: '25.5', uk: 'UK 10-12' },
    { size: 'L', bust: '38 - 40', waist: '31 - 33', hip: '41 - 43', shoulder: '15.5', length: '26.0', uk: 'UK 14' },
    { size: 'XL', bust: '41 - 43', waist: '34 - 36', hip: '44 - 46', shoulder: '16.0', length: '26.5', uk: 'UK 16' },
    { size: 'XXL', bust: '44 - 46', waist: '37 - 39', hip: '47 - 49', shoulder: '16.5', length: '27.0', uk: 'UK 18' }
  ];

  const bottomsData = [
    { size: '26 (XS)', waist: '25 - 26', hip: '34 - 35', inseam: '28.0', length: '38.0', uk: 'UK 6' },
    { size: '28 (S)', waist: '27 - 28', hip: '36 - 37', inseam: '28.5', length: '38.5', uk: 'UK 8' },
    { size: '30 (M)', waist: '29 - 30', hip: '38 - 39', inseam: '29.0', length: '39.0', uk: 'UK 10' },
    { size: '32 (L)', waist: '31 - 32', hip: '40 - 41', inseam: '29.5', length: '39.5', uk: 'UK 12' },
    { size: '34 (XL)', waist: '33 - 34', hip: '42 - 43', inseam: '30.0', length: '40.0', uk: 'UK 14' },
    { size: '36 (XXL)', waist: '35 - 36', hip: '44 - 45', inseam: '30.5', length: '40.5', uk: 'UK 16' }
  ];

  const footwearData = [
    { size: 'EU 36', uk: 'UK 3', us: 'US 5.5', footLength: '8.9" (22.5 cm)' },
    { size: 'EU 37', uk: 'UK 4', us: 'US 6.5', footLength: '9.3" (23.5 cm)' },
    { size: 'EU 38', uk: 'UK 5', us: 'US 7.5', footLength: '9.6" (24.5 cm)' },
    { size: 'EU 39', uk: 'UK 6', us: 'US 8.5', footLength: '10.0" (25.5 cm)' },
    { size: 'EU 40', uk: 'UK 7', us: 'US 9.5', footLength: '10.4" (26.5 cm)' }
  ];

  // Accessories Sizing & Dimension Data
  const bagDimensionsData = [
    { category: '👜 Tote Bag', length: '38 cm (15.0")', width: '14 cm (5.5")', height: '30 cm (11.8")', strap: '24 cm (9.5") Drop', capacity: 'Fits 15.6" Laptop + Essentials' },
    { category: '🎒 Backpack', length: '30 cm (11.8")', width: '15 cm (6.0")', height: '42 cm (16.5")', strap: 'Adjustable Shoulder Straps', capacity: 'Fits Books & 15" Laptop' },
    { category: '💼 Crossbody Bag', length: '24 cm (9.5")', width: '8 cm (3.1")', height: '18 cm (7.0")', strap: '120 cm (47") Adjustable', capacity: 'Phone, Wallet, Makeup' },
    { category: '👛 Clutch / Pouch', length: '20 cm (7.8")', width: '4 cm (1.5")', height: '12 cm (4.7")', strap: 'Wristlet Loop', capacity: 'Cards, Keys, Phone' }
  ];

  const sunglassesDimensionsData = [
    { fit: 'Narrow (Small)', lensWidth: '49 mm', bridgeWidth: '18 mm', templeLength: '140 mm', totalWidth: '132 mm', faceShape: 'Narrow / Oval Faces' },
    { fit: 'Standard (Medium)', lensWidth: '52 mm', bridgeWidth: '19 mm', templeLength: '145 mm', totalWidth: '138 mm', faceShape: 'Universal Fit (Most Faces)' },
    { fit: 'Wide (Oversized)', lensWidth: '56 mm', bridgeWidth: '20 mm', templeLength: '150 mm', totalWidth: '145 mm', faceShape: 'Round / Broad Faces' }
  ];

  const beltDimensionsData = [
    { size: 'Small (30-32")', waist: '30" - 32" (76 - 81 cm)', totalLength: '100 cm (39.5")', width: '3.5 cm (1.4")', pantsSize: 'Size 28 - 30' },
    { size: 'Medium (34-36")', waist: '34" - 36" (86 - 91 cm)', totalLength: '110 cm (43.3")', width: '3.5 cm (1.4")', pantsSize: 'Size 32 - 34' },
    { size: 'Large (38-40")', waist: '38" - 40" (96 - 101 cm)', totalLength: '120 cm (47.2")', width: '3.5 cm (1.4")', pantsSize: 'Size 36 - 38' },
    { size: 'Free Size (Adjustable)', waist: '28" - 42" (71 - 106 cm)', totalLength: '115 cm (45.2")', width: '3.5 cm (1.4")', pantsSize: 'Universal Fit' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-gray-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wide flex items-center gap-2">
                VELORA Size &amp; Dimension Guide
              </h2>
              <p className="text-[11px] text-gray-300">
                Official sizing &amp; dimension specifications for {gender} {productCategory}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Close Size Chart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Unit Controls Bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-gray-200/80 p-1 rounded-sm text-xs font-semibold">
            <button
              onClick={() => setActiveTab('accessories')}
              className={`px-3 py-1 rounded-xs transition-all cursor-pointer font-bold ${
                activeTab === 'accessories' ? 'bg-purple-900 text-white shadow-xs' : 'text-purple-900 hover:text-black'
              }`}
            >
              👜 Accessories &amp; Bags
            </button>
            <button
              onClick={() => setActiveTab('tops')}
              className={`px-3 py-1 rounded-xs transition-all cursor-pointer ${
                activeTab === 'tops' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tops &amp; Jackets
            </button>
            <button
              onClick={() => setActiveTab('bottoms')}
              className={`px-3 py-1 rounded-xs transition-all cursor-pointer ${
                activeTab === 'bottoms' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Jeans &amp; Pants
            </button>
            <button
              onClick={() => setActiveTab('footwear')}
              className={`px-3 py-1 rounded-xs transition-all cursor-pointer ${
                activeTab === 'footwear' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Footwear
            </button>
          </div>

          {/* Unit Toggle Switch */}
          {activeTab !== 'accessories' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">Units:</span>
              <div className="inline-flex bg-gray-200 p-0.5 rounded-sm text-xs font-bold">
                <button
                  onClick={() => setUnit('in')}
                  className={`px-2.5 py-0.5 rounded-xs transition-colors cursor-pointer ${
                    unit === 'in' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:text-black'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-2.5 py-0.5 rounded-xs transition-colors cursor-pointer ${
                    unit === 'cm' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:text-black'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Smart Fit Finder Widget for Garments */}
          {activeTab !== 'accessories' && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 rounded-sm border border-emerald-200">
              <div className="flex items-center gap-2 mb-2 text-emerald-900 font-serif font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Smart Size Recommender</span>
              </div>
              <p className="text-xs text-emerald-800 mb-3">
                Enter your Chest/Bust measurement to find your recommended size instantly:
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-emerald-300 rounded-sm px-2.5 py-1">
                  <input
                    type="number"
                    placeholder={`e.g. ${unit === 'in' ? '36' : '91'}`}
                    value={userBust}
                    onChange={(e) => setUserBust(e.target.value ? Number(e.target.value) : '')}
                    className="w-24 text-xs font-bold text-gray-900 focus:outline-none"
                  />
                  <span className="text-xs text-gray-500 font-semibold">{unit}</span>
                </div>
                <button
                  onClick={handleRecommendSize}
                  className="bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-sm hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
                >
                  Find My Size
                </button>

                {recommendedSize && (
                  <div className="flex items-center gap-1.5 bg-emerald-900 text-white text-xs font-bold px-3 py-1 rounded-sm animate-fade-in ml-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Recommended Size: {recommendedSize}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ACCESSORIES & BAGS SIZE / DIMENSION CHART */}
          {activeTab === 'accessories' && (
            <div className="space-y-6">
              
              {/* 👜 Bags & Handbags Section */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-purple-950 flex items-center gap-2 border-b border-purple-200 pb-2">
                  <ShoppingBag className="w-4 h-4 text-purple-700" /> Bags &amp; Handbags Dimension Specifications
                </h4>
                <div className="border border-purple-200 rounded-sm overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-purple-900 text-white uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Bag Type</th>
                        <th className="py-2.5 px-3">Length (L)</th>
                        <th className="py-2.5 px-3">Width (W)</th>
                        <th className="py-2.5 px-3">Height (H)</th>
                        <th className="py-2.5 px-3">Strap Drop / Length</th>
                        <th className="py-2.5 px-3">Storage Capacity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {bagDimensionsData.map((row) => (
                        <tr key={row.category} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-gray-900 bg-purple-50/50">{row.category}</td>
                          <td className="py-2.5 px-3 font-semibold text-gray-900">{row.length}</td>
                          <td className="py-2.5 px-3">{row.width}</td>
                          <td className="py-2.5 px-3">{row.height}</td>
                          <td className="py-2.5 px-3 text-purple-900 font-semibold">{row.strap}</td>
                          <td className="py-2.5 px-3 font-mono text-gray-700">{row.capacity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 🕶️ Sunglasses & Eyewear Frame Fit Guide */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-purple-950 flex items-center gap-2 border-b border-purple-200 pb-2">
                  <Eye className="w-4 h-4 text-purple-700" /> Sunglasses &amp; Eyewear Frame Fit Guide
                </h4>
                <div className="border border-purple-200 rounded-sm overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-purple-900 text-white uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Frame Fit</th>
                        <th className="py-2.5 px-3">Lens Width</th>
                        <th className="py-2.5 px-3">Bridge Width</th>
                        <th className="py-2.5 px-3">Temple Length</th>
                        <th className="py-2.5 px-3">Total Frame Width</th>
                        <th className="py-2.5 px-3">Recommended Face Shape</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {sunglassesDimensionsData.map((row) => (
                        <tr key={row.fit} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-gray-900 bg-purple-50/50">{row.fit}</td>
                          <td className="py-2.5 px-3 font-semibold text-gray-900">{row.lensWidth}</td>
                          <td className="py-2.5 px-3">{row.bridgeWidth}</td>
                          <td className="py-2.5 px-3">{row.templeLength}</td>
                          <td className="py-2.5 px-3 text-purple-900 font-bold">{row.totalWidth}</td>
                          <td className="py-2.5 px-3 text-gray-700">{row.faceShape}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 🥋 Belts & Waist Size Chart */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-purple-950 flex items-center gap-2 border-b border-purple-200 pb-2">
                  <ShieldAlert className="w-4 h-4 text-purple-700" /> Leather Belts &amp; Waist Sizing Chart
                </h4>
                <div className="border border-purple-200 rounded-sm overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-purple-900 text-white uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Belt Size</th>
                        <th className="py-2.5 px-3">Waist Fit Range</th>
                        <th className="py-2.5 px-3">Total Strap Length</th>
                        <th className="py-2.5 px-3">Strap Width</th>
                        <th className="py-2.5 px-3">Corresponding Pants Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {beltDimensionsData.map((row) => (
                        <tr key={row.size} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-gray-900 bg-purple-50/50">{row.size}</td>
                          <td className="py-2.5 px-3 font-semibold text-gray-900">{row.waist}</td>
                          <td className="py-2.5 px-3">{row.totalLength}</td>
                          <td className="py-2.5 px-3">{row.width}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-purple-900">{row.pantsSize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* GARMENTS SIZE CHART TABLES */}
          {activeTab !== 'accessories' && (
            <div className="border border-gray-200 rounded-sm overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-900 text-white uppercase font-bold text-[10px] tracking-wider">
                  {activeTab === 'tops' && (
                    <tr>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Bust / Chest ({unit})</th>
                      <th className="py-2.5 px-3">Waist ({unit})</th>
                      <th className="py-2.5 px-3">Hips ({unit})</th>
                      <th className="py-2.5 px-3">Shoulder ({unit})</th>
                      <th className="py-2.5 px-3">Length ({unit})</th>
                      <th className="py-2.5 px-3">UK / Ind Size</th>
                    </tr>
                  )}
                  {activeTab === 'bottoms' && (
                    <tr>
                      <th className="py-2.5 px-3">Waist Size</th>
                      <th className="py-2.5 px-3">Waist Fit ({unit})</th>
                      <th className="py-2.5 px-3">Hips ({unit})</th>
                      <th className="py-2.5 px-3">Inseam ({unit})</th>
                      <th className="py-2.5 px-3">Full Length ({unit})</th>
                      <th className="py-2.5 px-3">UK / Ind Equivalent</th>
                    </tr>
                  )}
                  {activeTab === 'footwear' && (
                    <tr>
                      <th className="py-2.5 px-3">European (EU)</th>
                      <th className="py-2.5 px-3">UK Size</th>
                      <th className="py-2.5 px-3">US Size</th>
                      <th className="py-2.5 px-3">Foot Length</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {activeTab === 'tops' &&
                    topsData.map((row) => (
                      <tr key={row.size} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-gray-900 bg-gray-50/50">{row.size}</td>
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{row.bust}</td>
                        <td className="py-2.5 px-3">{row.waist}</td>
                        <td className="py-2.5 px-3">{row.hip}</td>
                        <td className="py-2.5 px-3">{row.shoulder}</td>
                        <td className="py-2.5 px-3">{row.length}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-gray-700">{row.uk}</td>
                      </tr>
                    ))}

                  {activeTab === 'bottoms' &&
                    bottomsData.map((row) => (
                      <tr key={row.size} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-gray-900 bg-gray-50/50">{row.size}</td>
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{row.waist}</td>
                        <td className="py-2.5 px-3">{row.hip}</td>
                        <td className="py-2.5 px-3">{row.inseam}</td>
                        <td className="py-2.5 px-3">{row.length}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-gray-700">{row.uk}</td>
                      </tr>
                    ))}

                  {activeTab === 'footwear' &&
                    footwearData.map((row) => (
                      <tr key={row.size} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-gray-900 bg-gray-50/50">{row.size}</td>
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{row.uk}</td>
                        <td className="py-2.5 px-3">{row.us}</td>
                        <td className="py-2.5 px-3 font-mono text-gray-700">{row.footLength}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* How to Measure Guidelines */}
          <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
            <h4 className="font-serif font-bold text-xs text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-gray-600" /> {activeTab === 'accessories' ? 'How To Check Accessory Dimensions' : 'How To Measure Your Body Accurately'}
            </h4>
            {activeTab === 'accessories' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-gray-600">
                <div className="bg-white p-2.5 rounded-xs border border-gray-100">
                  <span className="font-bold text-gray-900 block mb-0.5">1. Bag Dimensions</span>
                  Measure Length across front base, Height from bottom seam to top zip, and Depth/Width across bottom gusset.
                </div>
                <div className="bg-white p-2.5 rounded-xs border border-gray-100">
                  <span className="font-bold text-gray-900 block mb-0.5">2. Eyewear Fit</span>
                  Lens Width is measured horizontally across widest lens point. Bridge is gap between lenses.
                </div>
                <div className="bg-white p-2.5 rounded-xs border border-gray-100">
                  <span className="font-bold text-gray-900 block mb-0.5">3. Belt Fit</span>
                  Order 1 belt size larger than your waist/pants size (e.g., if you wear 32" pants, order 34" belt).
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-gray-600">
                <div className="bg-white p-2.5 rounded-xs border border-gray-100">
                  <span className="font-bold text-gray-900 block mb-0.5">1. Chest / Bust</span>
                  Measure around the fullest part of your bust, keeping the measuring tape horizontal.
                </div>
                <div className="bg-white p-2.5 rounded-xs border border-gray-100">
                  <span className="font-bold text-gray-900 block mb-0.5">2. Natural Waist</span>
                  Measure around the narrowest part of your waist (typically where your body bends side to side).
                </div>
                <div className="bg-white p-2.5 rounded-xs border border-gray-100">
                  <span className="font-bold text-gray-900 block mb-0.5">3. Fullest Hips</span>
                  Stand with your feet together and measure around the fullest point of your hips.
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            {activeTab === 'accessories'
              ? '💡 Tip: Bag dimensions are outer bag measurements. Laptop sleeve fits standard laptops.'
              : '💡 Tip: If you are between two sizes, we recommend choosing the larger size for a relaxed fit.'}
          </span>
          <button
            onClick={onClose}
            className="bg-gray-900 text-white font-bold text-xs px-4 py-1.5 rounded-sm hover:bg-black transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};

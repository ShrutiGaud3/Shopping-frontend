import React, { useState, useEffect } from 'react';
import { X, Ruler, Sparkles, CheckCircle2, Info, Scissors, Layers } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productCategory?: string;
  gender?: string;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  productCategory = 'Sarees'
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [activeTab, setActiveTab] = useState<'sarees' | 'lehengas' | 'salwar-suits'>('sarees');

  // Auto-switch active tab based on current product category
  useEffect(() => {
    const cat = (productCategory || '').toLowerCase();
    if (cat.includes('lehenga')) {
      setActiveTab('lehengas');
    } else if (cat.includes('suit') || cat.includes('salwar') || cat.includes('anarkali') || cat.includes('sharara')) {
      setActiveTab('salwar-suits');
    } else {
      setActiveTab('sarees');
    }
  }, [productCategory, isOpen]);

  // Interactive Fit Recommender
  const [userBust, setUserBust] = useState<number | ''>('');
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRecommendSize = () => {
    if (!userBust || userBust <= 0) return;
    const valInInches = unit === 'cm' ? userBust / 2.54 : Number(userBust);

    if (valInInches <= 33) setRecommendedSize('XS (32-34")');
    else if (valInInches <= 35) setRecommendedSize('S (34-36")');
    else if (valInInches <= 37) setRecommendedSize('M (36-38")');
    else if (valInInches <= 40) setRecommendedSize('L (38-40")');
    else if (valInInches <= 43) setRecommendedSize('XL (42-44")');
    else setRecommendedSize('XXL (44-46")');
  };

  // Convert measurement helper
  const fmt = (inVal: string) => {
    if (unit === 'in') return inVal;
    // approximate conversion to cm
    const parts = inVal.split('-').map((s) => s.trim());
    if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
      return `${Math.round(Number(parts[0]) * 2.54)} - ${Math.round(Number(parts[1]) * 2.54)}`;
    }
    if (!isNaN(Number(inVal))) {
      return `${Math.round(Number(inVal) * 2.54)}`;
    }
    return inVal;
  };

  // Sarees Blouse Size Chart Data
  const sareeBlouseData = [
    { size: 'XS (32)', bust: '32 - 33', underBust: '26 - 27', waist: '24 - 25', length: '13.5', armhole: '14.0' },
    { size: 'S (34)', bust: '34 - 35', underBust: '28 - 29', waist: '26 - 27', length: '14.0', armhole: '15.0' },
    { size: 'M (36)', bust: '36 - 37', underBust: '30 - 31', waist: '28 - 29', length: '14.5', armhole: '16.0' },
    { size: 'L (38)', bust: '38 - 39', underBust: '32 - 33', waist: '30 - 31', length: '15.0', armhole: '17.0' },
    { size: 'XL (40)', bust: '40 - 41', underBust: '34 - 35', waist: '32 - 34', length: '15.5', armhole: '18.0' },
    { size: 'XXL (42)', bust: '42 - 44', underBust: '36 - 38', waist: '35 - 37', length: '16.0', armhole: '19.0' }
  ];

  // Lehengas Size Chart Data
  const lehengaData = [
    { size: 'XS', waist: '26 - 27', hip: '34 - 35', skirtLen: '41.0', choliBust: '32 - 33', flare: '3.5m' },
    { size: 'S', waist: '28 - 29', hip: '36 - 37', skirtLen: '42.0', choliBust: '34 - 35', flare: '3.8m' },
    { size: 'M', waist: '30 - 31', hip: '38 - 39', skirtLen: '42.0', choliBust: '36 - 37', flare: '4.0m' },
    { size: 'L', waist: '32 - 33', hip: '40 - 41', skirtLen: '43.0', choliBust: '38 - 39', flare: '4.2m' },
    { size: 'XL', waist: '34 - 35', hip: '42 - 43', skirtLen: '43.0', choliBust: '40 - 41', flare: '4.2m' },
    { size: 'XXL', waist: '36 - 38', hip: '44 - 46', skirtLen: '44.0', choliBust: '42 - 44', flare: '4.5m' }
  ];

  // Salwar Suits Size Chart Data
  const salwarSuitsData = [
    { size: 'XS (34)', bust: '33 - 34', waist: '28 - 29', hip: '36 - 37', kameezLen: '44.0', bottomWaist: '26 - 30', bottomLen: '38.0' },
    { size: 'S (36)', bust: '35 - 36', waist: '30 - 31', hip: '38 - 39', kameezLen: '45.0', bottomWaist: '28 - 32', bottomLen: '38.5' },
    { size: 'M (38)', bust: '37 - 38', waist: '32 - 33', hip: '40 - 41', kameezLen: '45.5', bottomWaist: '30 - 34', bottomLen: '39.0' },
    { size: 'L (40)', bust: '39 - 40', waist: '34 - 35', hip: '42 - 43', kameezLen: '46.0', bottomWaist: '32 - 36', bottomLen: '39.5' },
    { size: 'XL (42)', bust: '41 - 42', waist: '36 - 37', hip: '44 - 45', kameezLen: '46.5', bottomWaist: '34 - 38', bottomLen: '40.0' },
    { size: 'XXL (44)', bust: '43 - 44', waist: '38 - 40', hip: '46 - 48', kameezLen: '47.0', bottomWaist: '36 - 40', bottomLen: '40.0' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center">
              <Ruler className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wide flex items-center gap-2">
                WEAVERA Size &amp; Measurement Guide
              </h2>
              <p className="text-[11px] text-slate-300">
                Official tailoring &amp; draping dimensions for authentic Surat ethnic wear
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Size Chart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Unit Controls Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Ethnic Categories Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('sarees')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-bold ${
                activeTab === 'sarees'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              🥻 Sarees &amp; Blouse
            </button>
            <button
              onClick={() => setActiveTab('lehengas')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-bold ${
                activeTab === 'lehengas'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              ✨ Lehengas
            </button>
            <button
              onClick={() => setActiveTab('salwar-suits')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-bold ${
                activeTab === 'salwar-suits'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              🌸 Salwar Suits
            </button>
          </div>

          {/* Unit Toggle Switch */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Units:</span>
            <div className="inline-flex bg-slate-200 p-0.5 rounded-md text-xs font-bold">
              <button
                onClick={() => setUnit('in')}
                className={`px-2.5 py-0.5 rounded-sm transition-colors cursor-pointer ${
                  unit === 'in' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-black'
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-0.5 rounded-sm transition-colors cursor-pointer ${
                  unit === 'cm' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-black'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Smart Fit Finder Widget */}
          <div className="bg-gradient-to-r from-rose-50 via-amber-50/50 to-rose-50 p-4 rounded-xl border border-rose-200/80">
            <div className="flex items-center gap-2 mb-1.5 text-rose-950 font-serif font-bold text-sm">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>Smart Ethnic Fit Recommender</span>
            </div>
            <p className="text-xs text-rose-900/80 mb-3">
              Enter your Chest/Bust measurement to determine your recommended blouse or kurti size:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-rose-300 rounded-lg px-3 py-1.5 shadow-inner">
                <input
                  type="number"
                  placeholder={`e.g. ${unit === 'in' ? '36' : '91'}`}
                  value={userBust}
                  onChange={(e) => setUserBust(e.target.value ? Number(e.target.value) : '')}
                  className="w-24 text-xs font-bold text-slate-900 focus:outline-none"
                />
                <span className="text-xs text-slate-500 font-semibold">{unit}</span>
              </div>
              <button
                onClick={handleRecommendSize}
                className="bg-rose-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-rose-800 transition-colors shadow-xs cursor-pointer"
              >
                Recommend Size
              </button>

              {recommendedSize && (
                <div className="flex items-center gap-1.5 bg-rose-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg animate-fade-in sm:ml-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Recommended: {recommendedSize}</span>
                </div>
              )}
            </div>
          </div>

          {/* TAB 1: SAREES */}
          {activeTab === 'sarees' && (
            <div className="space-y-5">
              {/* Saree Standard Dimensions Spec Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60 text-center">
                <div className="p-2 bg-white rounded-lg border border-amber-100 shadow-xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Saree Length</span>
                  <span className="text-xs font-bold text-slate-900">5.50 Meters</span>
                  <span className="block text-[9px] text-slate-400">Universal drape</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-amber-100 shadow-xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Saree Width</span>
                  <span className="text-xs font-bold text-slate-900">{fmt('44-47')} {unit}</span>
                  <span className="block text-[9px] text-slate-400">Standard breadth</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-amber-100 shadow-xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Blouse Piece</span>
                  <span className="text-xs font-bold text-slate-900">0.80 - 1.0 M</span>
                  <span className="block text-[9px] text-slate-400">Unstitched attached</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-amber-100 shadow-xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Petticoat Waist</span>
                  <span className="text-xs font-bold text-slate-900">{fmt('26-42')} {unit}</span>
                  <span className="block text-[9px] text-slate-400">Drawstring adjust</span>
                </div>
              </div>

              {/* Blouse Tailoring Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-rose-600" /> Saree Blouse Tailoring Specifications
                  </h4>
                  <span className="text-[10px] text-slate-500">Includes 2" internal expansion margin</span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-900 text-white uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Blouse Size</th>
                        <th className="py-2.5 px-3">Bust / Chest ({unit})</th>
                        <th className="py-2.5 px-3">Under-Bust ({unit})</th>
                        <th className="py-2.5 px-3">Waist ({unit})</th>
                        <th className="py-2.5 px-3">Length ({unit})</th>
                        <th className="py-2.5 px-3">Armhole ({unit})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {sareeBlouseData.map((row) => (
                        <tr key={row.size} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50/70">{row.size}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{fmt(row.bust)}</td>
                          <td className="py-2.5 px-3">{fmt(row.underBust)}</td>
                          <td className="py-2.5 px-3">{fmt(row.waist)}</td>
                          <td className="py-2.5 px-3">{fmt(row.length)}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{fmt(row.armhole)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEHENGAS */}
          {activeTab === 'lehengas' && (
            <div className="space-y-5">
              {/* Lehenga Specs Spec Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-rose-50/60 p-3.5 rounded-xl border border-rose-200/60 text-center">
                <div className="p-2 bg-white rounded-lg border border-rose-100 shadow-xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Lehenga Flare</span>
                  <span className="text-xs font-bold text-rose-900">3.5 - 4.5 Meters</span>
                  <span className="block text-[9px] text-slate-400">Full circular gher</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-rose-100 shadow-xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Skirt Length</span>
                  <span className="text-xs font-bold text-rose-900">{fmt('41-44')} {unit}</span>
                  <span className="block text-[9px] text-slate-400">Waist to floor</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-rose-100 shadow-xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Dupatta Size</span>
                  <span className="text-xs font-bold text-rose-900">2.50 Meters</span>
                  <span className="block text-[9px] text-slate-400">Full width drape</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-rose-100 shadow-xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Inner Lining</span>
                  <span className="text-xs font-bold text-rose-900">Double Can-Can</span>
                  <span className="block text-[9px] text-slate-400">Structured volume</span>
                </div>
              </div>

              {/* Lehenga Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-rose-600" /> Semi-Stitched &amp; Ready Lehenga Sizing
                  </h4>
                  <span className="text-[10px] text-slate-500">Tailorable up to 4" expansion</span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-900 text-white uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Lehenga Waist ({unit})</th>
                        <th className="py-2.5 px-3">Hip Circumference ({unit})</th>
                        <th className="py-2.5 px-3">Length (Waist-Floor) ({unit})</th>
                        <th className="py-2.5 px-3">Choli / Bust ({unit})</th>
                        <th className="py-2.5 px-3">Gher / Flare</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {lehengaData.map((row) => (
                        <tr key={row.size} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50/70">{row.size}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{fmt(row.waist)}</td>
                          <td className="py-2.5 px-3">{fmt(row.hip)}</td>
                          <td className="py-2.5 px-3">{fmt(row.skirtLen)}</td>
                          <td className="py-2.5 px-3 font-semibold text-rose-700">{fmt(row.choliBust)}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{row.flare}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SALWAR SUITS */}
          {activeTab === 'salwar-suits' && (
            <div className="space-y-5">
              {/* Salwar Suits Specs Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/60 text-center">
                <div className="p-2 bg-white rounded-lg border border-emerald-100 shadow-xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Kameez Length</span>
                  <span className="text-xs font-bold text-emerald-950">{fmt('44-47')} {unit}</span>
                  <span className="block text-[9px] text-slate-400">Calf / Ankle length</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-100 shadow-xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Bottom Style</span>
                  <span className="text-xs font-bold text-emerald-950">Pant / Sharara</span>
                  <span className="block text-[9px] text-slate-400">Elasticated waist</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-100 shadow-xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Dupatta Length</span>
                  <span className="text-xs font-bold text-emerald-950">2.25 - 2.50 M</span>
                  <span className="block text-[9px] text-slate-400">Coordinated fabric</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-100 shadow-xs">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Margin</span>
                  <span className="text-xs font-bold text-emerald-950">2.5 Inches</span>
                  <span className="block text-[9px] text-slate-400">Inside side seams</span>
                </div>
              </div>

              {/* Salwar Suits Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-rose-600" /> Kurti / Anarkali &amp; Bottom Dimension Chart
                  </h4>
                  <span className="text-[10px] text-slate-500">Ready garment measurements</span>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-900 text-white uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Bust / Chest ({unit})</th>
                        <th className="py-2.5 px-3">Kurti Waist ({unit})</th>
                        <th className="py-2.5 px-3">Kurti Hips ({unit})</th>
                        <th className="py-2.5 px-3">Kameez Length ({unit})</th>
                        <th className="py-2.5 px-3">Bottom Waist ({unit})</th>
                        <th className="py-2.5 px-3">Bottom Length ({unit})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {salwarSuitsData.map((row) => (
                        <tr key={row.size} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50/70">{row.size}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{fmt(row.bust)}</td>
                          <td className="py-2.5 px-3">{fmt(row.waist)}</td>
                          <td className="py-2.5 px-3">{fmt(row.hip)}</td>
                          <td className="py-2.5 px-3">{fmt(row.kameezLen)}</td>
                          <td className="py-2.5 px-3">{fmt(row.bottomWaist)}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{fmt(row.bottomLen)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* How to Measure Guidelines */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-serif font-bold text-xs text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-600" /> How To Measure For Ethnic Wear Accurately
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-600">
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-xs">
                <span className="font-bold text-slate-900 block mb-1">1. Chest / Bust</span>
                Measure around the fullest part of your bust while wearing a well-fitting bra, keeping the measuring tape horizontal.
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-xs">
                <span className="font-bold text-slate-900 block mb-1">2. Natural Waist &amp; Navel</span>
                For blouses, measure above the navel at the narrowest point. For Lehengas, measure where you tie your lehenga skirt (around navel).
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-xs">
                <span className="font-bold text-slate-900 block mb-1">3. Lehenga / Skirt Length</span>
                Measure from your waistline down to the floor, preferably wearing your intended heels or footwear for an ideal drape.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            💡 Tip: All Weavera stitched and semi-stitched sets include 2 to 4 inches of interior fabric margins for easy local alteration.
          </span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

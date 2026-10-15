import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Tag, Check, Ruler, MessageCircle, Maximize2, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/product/ProductCard';
import { SizeChartModal } from '../components/product/SizeChartModal';
import { productService } from '../services/productService';
import { getWhatsAppProductUrl, openWhatsApp } from '../utils/whatsapp';
import type { Product } from '../types';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist, reviews, fetchReviews, addReview } = useShop();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Default');
  const [activeTab, setActiveTab] = useState<'details' | 'specifications' | 'reviews'>('specifications');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);

  // Review Form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [imageFitMode, setImageFitMode] = useState<'cover' | 'contain'>('cover');

  // Fetch product & reviews from backend API on mount or ID change
  useEffect(() => {
    if (id) {
      fetchReviews(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      if (id) {
        setLoading(true);
        try {
          const res = await productService.getProductById(id);
          if (res.success && res.data) {
            setProduct(res.data);
            setSelectedImage(res.data.image);
            setSelectedSize(res.data.sizes[0] || 'M');
            setSelectedColor(res.data.colors[0]?.name || 'Default');
          } else {
            setProduct(null);
          }
        } catch (err) {
          setProduct(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSingleProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent shadow-sm"></div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest animate-pulse">Loading Product Details from Database...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-md">The product you are looking for does not exist in our catalog or may have been removed.</p>
        <Link to="/products" className="bg-gray-900 text-white text-xs font-bold px-6 py-3 uppercase tracking-wider rounded-sm hover:bg-black transition-colors">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);

  // Similar & Recommended Products
  const similarProducts = products.filter((p) => p.id !== product.id && p.gender === product.gender).slice(0, 4);
  const alsoLikeProducts = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !product) return;
    setSubmittingReview(true);
    await addReview(product.id, newRating, newComment);
    setNewComment('');
    setSubmittingReview(false);
  };

  const currentReviews = reviews || [];
  const dynamicCount = currentReviews.length;
  const dynamicRating = currentReviews.length > 0
    ? currentReviews.reduce((acc, r) => acc + r.rating, 0) / currentReviews.length
    : 0;

  return (
    <div className="bg-white min-h-screen py-4 sm:py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-gray-500 mb-4 sm:mb-8">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-black">Collections</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-12 sm:mb-16">
          
          {/* Gallery Column */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
            
            {/* Thumbnails list */}
            <div className="flex md:flex-col gap-2.5 sm:gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar max-h-[550px] py-1 md:py-0">
              {(product.images || [product.image]).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-20 md:w-20 md:h-24 shrink-0 rounded-xs overflow-hidden border-2 transition-all cursor-pointer bg-gray-50 flex items-center justify-center ${
                    selectedImage === img ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>

            {/* Large Active Preview Image */}
            <div 
              className="flex-1 aspect-[3/4] max-h-[620px] bg-gray-100 rounded-sm overflow-hidden border border-gray-200 relative group shadow-xs cursor-zoom-in"
              onClick={() => setIsZoomOpen(true)}
            >
              {/* Soft blurred ambient backdrop in contain mode */}
              {imageFitMode === 'contain' && (
                <img
                  src={selectedImage || product.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110 select-none pointer-events-none"
                />
              )}

              {/* Main Product Image */}
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className={`relative z-10 w-full h-full transition-all duration-300 group-hover:scale-105 ${
                  imageFitMode === 'cover' ? 'object-cover object-top' : 'object-contain p-2 sm:p-4'
                }`}
              />
              
              {/* Top Controls Overlay */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setImageFitMode(imageFitMode === 'cover' ? 'contain' : 'cover')}
                  className="bg-white/90 hover:bg-white text-gray-900 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md backdrop-blur-xs transition-all cursor-pointer flex items-center gap-1"
                  title={imageFitMode === 'cover' ? "Switch to Uncropped Fit View" : "Switch to Full Frame Cover"}
                >
                  {imageFitMode === 'cover' ? 'Fit View' : 'Fill Frame'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-md backdrop-blur-xs transition-all cursor-pointer flex items-center justify-center"
                  title="Open High-Res Lightbox Zoom"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Hover Zoom Hint */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-black/75 text-white text-[10px] font-medium px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md whitespace-nowrap">
                Click photo to view fullscreen 🔍
              </div>
            </div>

          </div>

          {/* Product Information Column */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left">
            <div>
              
              {/* Product Header */}
              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Brand: <span className="text-gray-900">{product.brand}</span>
                </span>
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-xs text-xs font-semibold">
                  <span>{dynamicRating.toFixed(1)}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-gray-500 font-normal">| {dynamicCount} {dynamicCount === 1 ? 'Review' : 'Reviews'}</span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 mb-4">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                    <span className="badge-discount text-xs">
                      ({product.discountPercent}% off)
                    </span>
                  </>
                )}
              </div>

              {/* Product Overview / Description Box */}
              {product.description && (
                <div className="mb-6 bg-gray-50/90 p-3.5 rounded-sm border border-gray-200/90">
                  <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider block mb-1">
                    Product Description
                  </span>
                  <p className="text-xs text-gray-700 leading-relaxed font-sans">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Select Size Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Select Size
                  </span>
                  <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-xs text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" /> Size Chart &amp; Fit Guide &gt;
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {(product.sizes || ['S', 'M', 'L']).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[40px] h-10 px-2 rounded-full border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-gray-900 text-white border-gray-900 ring-2 ring-gray-900 ring-offset-1'
                          : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Color Section */}
              <div className="mb-6">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2">
                  Select Color: <span className="font-medium text-gray-600">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  {(product.colors || [{ name: 'Default', hex: '#111827' }]).map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-transform cursor-pointer ${
                        selectedColor === color.name ? 'ring-2 ring-gray-900 ring-offset-2 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check className={`w-4 h-4 ${color.name.toLowerCase().includes('white') ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Best Offers Banner Box */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-sm p-3.5 sm:p-4 mb-6 text-xs text-gray-800 space-y-1.5 sm:space-y-2">
                <div className="font-bold text-gray-900 flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-blue-600" /> Best Offers
                </div>
                <p>• Special offer: get ₹50 off <button className="text-blue-600 underline font-semibold">T&amp;C</button></p>
                <p>• Bank offer: get 10% off on Axis Bank Credit Card <button className="text-blue-600 underline font-semibold">T&amp;C</button></p>
                <p>• Wallet offer: get 10% cashback via Paytm Wallet <button className="text-blue-600 underline font-semibold">T&amp;C</button></p>
              </div>

              {/* Out of Stock Alert Banner */}
              {product.stock === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-sm p-3.5 mb-6 text-xs text-red-800 font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
                  <span>Out of Stock: This item is currently unavailable for order.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                {product.stock === 0 ? (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 font-semibold text-sm py-4 px-6 uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed rounded-sm"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <>
                    {/* Row 1: Add to Cart & Buy Now + Wishlist */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3 flex-1">
                        <button
                          onClick={() => addToCart(product, selectedSize, selectedColor, 1)}
                          className="flex-1 bg-gray-900 text-white font-bold text-xs sm:text-sm py-3.5 px-3 sm:px-4 uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md rounded-sm cursor-pointer whitespace-nowrap"
                        >
                          <ShoppingBag className="w-4 h-4 shrink-0" /> Add to Cart
                        </button>

                        <button
                          onClick={handleBuyNow}
                          className="flex-1 bg-amber-500 text-gray-950 font-bold text-xs sm:text-sm py-3.5 px-3 sm:px-4 uppercase tracking-wider hover:bg-amber-400 transition-all shadow-xs rounded-sm cursor-pointer whitespace-nowrap text-center"
                        >
                          Buy Now
                        </button>
                      </div>

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-3.5 border border-gray-300 rounded-sm hover:border-gray-900 text-gray-700 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                        title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    {/* Row 2: WhatsApp Express Order */}
                    <button
                      onClick={() => openWhatsApp(getWhatsAppProductUrl(product, selectedSize, selectedColor))}
                      className="w-full bg-emerald-600 text-white font-bold text-xs sm:text-sm py-3.5 px-4 uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-md rounded-sm cursor-pointer whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4 fill-white text-emerald-600 shrink-0" /> Order Express via WhatsApp
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Tabbed Product Info Section */}
        <div className="border-t border-gray-200 pt-6 sm:pt-8 mb-12 sm:mb-16">
          
          {/* Tab Controls Header */}
          <div className="flex border-b border-gray-200 mb-6 gap-4 sm:gap-8 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar whitespace-nowrap pb-1">
            <button
              onClick={() => setActiveTab('specifications')}
              className={`pb-3 transition-colors uppercase tracking-wider text-xs md:text-sm cursor-pointer ${
                activeTab === 'specifications'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 transition-colors uppercase tracking-wider text-xs md:text-sm cursor-pointer ${
                activeTab === 'details'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors uppercase tracking-wider text-xs md:text-sm cursor-pointer ${
                activeTab === 'reviews'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Ratings &amp; Reviews ({dynamicCount})
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'specifications' && (
            <div className="max-w-3xl">
              <h3 className="font-serif font-bold text-base sm:text-lg text-gray-900 mb-4">
                Specifications
              </h3>
              {product.category === 'Accessories' ? (
                (product.name.toLowerCase().includes('sunglasses') || product.name.toLowerCase().includes('glasses') || (product.specifications?.lensMaterial && !product.specifications?.bagStyle && !product.specifications?.beltWidth)) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs text-gray-700 bg-purple-50/40 p-4 sm:p-6 rounded-sm border border-purple-100">
                    <div>
                      <span className="text-gray-400 block font-medium">Lens Material</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.lensMaterial || 'TAC Polarized UV400'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Frame Shape</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.frameShape || 'Wayfarer / Aviator'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Frame Material</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.material || 'Italian Acetate / Titanium'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">UV Protection</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.uvProtection || '100% UV400 Protection (Cat 3)'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Frame Dimensions</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.dimensions || '52-18-145 mm (Medium)'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Packaging &amp; Case</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.closure || 'Includes Hard Leather Case'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Warranty</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.warranty || '1 Year Brand Warranty'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Style / Use</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.occasion || 'Outdoor / Travel'}</span>
                    </div>
                  </div>
                ) : (product.name.toLowerCase().includes('belt') || product.name.toLowerCase().includes('wallet') || !!product.specifications?.beltWidth || !!product.specifications?.buckleType) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs text-gray-700 bg-purple-50/40 p-4 sm:p-6 rounded-sm border border-purple-100">
                    <div>
                      <span className="text-gray-400 block font-medium">Material / Leather</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.material || product.specifications?.fabric || 'Full-Grain Genuine Leather'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Buckle / Clasp Type</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.buckleType || 'Reversible Pin Buckle'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Belt Width</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.beltWidth || '3.5 cm (Standard Width)'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Waist Length / Size</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.dimensions || '32" - 42" Free Size'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Finish &amp; Texture</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.pattern || 'Smooth Grain Finish'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Reversible Feature</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.closure || 'Reversible Dual Side (Black/Tan)'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Warranty</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.warranty || '1 Year Brand Warranty'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Occasion</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.occasion || 'Formal / Business Casual'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs text-gray-700 bg-purple-50/40 p-4 sm:p-6 rounded-sm border border-purple-100">
                    <div>
                      <span className="text-gray-400 block font-medium">Bag Material</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.material || product.specifications?.fabric || 'Italian Leather / Canvas'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Bag Style / Type</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.bagStyle || 'Tote / Handbag / Crossbody'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Compartments</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.compartments || '2 Main Zip + Inner Slots'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Laptop / Tablet Fit</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.laptopFit || 'Fits up to 14" Laptop'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Hardware Accent</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.hardware || 'Gold-Tone Brushed Metal'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Dimensions (L x W x H)</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.dimensions || '35 x 26 x 14 cm'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Closure Type</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.closure || 'Top Zip / Magnetic Clasp'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Warranty</span>
                      <span className="font-semibold text-gray-900">{product.specifications?.warranty || '1 Year Brand Warranty'}</span>
                    </div>
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs text-gray-700 bg-gray-50/70 p-4 sm:p-6 rounded-sm border border-gray-200">
                  <div>
                    <span className="text-gray-400 block font-medium">Sleeve Length</span>
                    <span className="font-semibold text-gray-900">{product.specifications?.sleeveLength || 'Long Sleeves'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Collar</span>
                    <span className="font-semibold text-gray-900">{product.specifications?.collar || 'Spread Collar'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Fit</span>
                    <span className="font-semibold text-gray-900">{product.specifications?.fit || 'Regular Fit'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Pattern</span>
                    <span className="font-semibold text-gray-900">{product.specifications?.pattern || 'Solid'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Fabric</span>
                    <span className="font-semibold text-gray-900">{product.specifications?.fabric || '100% Cotton'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Pockets</span>
                    <span className="font-semibold text-gray-900">{product.specifications?.pockets || '2 Pockets'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Occasion</span>
                    <span className="font-semibold text-gray-900">{product.specifications?.occasion || 'Casual'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Lining</span>
                    <span className="font-semibold text-gray-900">{product.specifications?.lining || 'Unlined'}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="max-w-3xl text-sm text-gray-700 leading-relaxed space-y-4">
              <h3 className="font-serif font-bold text-base sm:text-lg text-gray-900 mb-2">About the Product</h3>
              <div className="bg-gray-50/80 p-4 sm:p-6 rounded-sm border border-gray-200">
                <p className="text-gray-900 text-xs sm:text-sm font-normal leading-relaxed whitespace-pre-line">
                  {product.description || 'No detailed description available for this product.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl space-y-8">
              {/* Form to submit review */}
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 sm:p-6 text-left">
                <h4 className="font-serif font-bold text-base text-gray-900 mb-1">
                  Write a Customer Review
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  Share your experience with fit, fabric, and overall quality.
                </p>

                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Your Rating</label>
                    <div className="flex items-center gap-1 cursor-pointer">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewRating(i + 1)}
                          className="p-1 text-amber-400 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              i < newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 font-bold text-gray-700 text-xs">{newRating} / 5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Review Comment</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="What did you like or dislike about this product?"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-sm p-3 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-gray-900 text-white font-semibold text-xs py-2.5 px-5 uppercase tracking-wider rounded-sm hover:bg-black transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-gray-900 mb-4">
                  Customer Reviews ({reviews.length})
                </h3>

                {reviews.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-4">
                    No customer reviews yet. Be the first to share your thoughts on this product!
                  </p>
                ) : (
                  <div className="space-y-4 divide-y divide-gray-100">
                    {reviews.map((rev) => (
                      <div key={rev.id || rev._id} className="pt-4 first:pt-0 text-xs text-left">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{rev.userName}</span>
                            {rev.isVerifiedPurchase && (
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-xs border border-emerald-200">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-gray-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, r) => (
                            <Star
                              key={r}
                              className={`w-3.5 h-3.5 ${
                                r < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Similar Products Row */}
        {similarProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Customer Also Like Row */}
        {alsoLikeProducts.length > 0 && (
          <div>
            <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Customer Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {alsoLikeProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Interactive Size Chart Modal */}
        {product && (
          <SizeChartModal
            isOpen={isSizeChartOpen}
            onClose={() => setIsSizeChartOpen(false)}
            productCategory={product.category}
            gender={product.gender}
          />
        )}

        {/* Fullscreen High-Res Lightbox Zoom Modal */}
        {isZoomOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in cursor-pointer"
            onClick={() => setIsZoomOpen(false)}
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors cursor-pointer"
              title="Close Fullscreen View"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="max-w-4xl max-h-[92vh] overflow-hidden flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="max-w-full max-h-[88vh] object-contain rounded-xs shadow-2xl"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

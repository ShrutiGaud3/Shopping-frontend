import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Heart,
  ShoppingBag,
  Star,
  Tag,
  Check,
  Ruler,
  MessageCircle,
  Maximize2,
  X,
  ShieldCheck,
  Truck,
  RefreshCw,
  Scissors,
  Sparkles,
  MapPin,
  Play,
  Camera,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/product/ProductCard';
import { SizeChartModal } from '../components/product/SizeChartModal';
import { productService } from '../services/productService';
import { reviewService, type ReviewStats, type ReviewEligibility } from '../services/reviewService';
import { getWhatsAppProductUrl, openWhatsApp } from '../utils/whatsapp';
import type { Product, StitchOption, Review } from '../types';
import type { RootState } from '../store';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist, showToast } = useShop();
  const { settings } = useSettings();
  const { user } = useSelector((state: RootState) => state.auth);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Default');
  const [selectedStitchOption, setSelectedStitchOption] = useState<StitchOption | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'specifications' | 'reviews'>('specifications');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  // Pincode Delivery State
  const [pincode, setPincode] = useState<string>('');
  const [pincodeStatus, setPincodeStatus] = useState<{ checked: boolean; valid: boolean; message: string; date?: string } | null>(null);

  // Enhanced Review State
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [eligibility, setEligibility] = useState<ReviewEligibility | null>(null);
  const [newRating, setNewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [reviewImagesInput, setReviewImagesInput] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);
  const [photoModal, setPhotoModal] = useState<string | null>(null);
  const [imageFitMode, setImageFitMode] = useState<'cover' | 'contain'>('cover');

  // Load reviews & stats from backend
  const loadReviewsData = async (productId: string) => {
    try {
      const res = await reviewService.getProductReviews(productId);
      if (res.success && res.data) {
        setProductReviews(res.data);
        if (res.stats) {
          setReviewStats(res.stats);
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  // Check user review eligibility (Verified buyer check)
  const checkReviewEligibility = async (productId: string) => {
    if (!user) {
      setEligibility(null);
      return;
    }
    try {
      const res = await reviewService.checkEligibility(productId);
      if (res.success && res.data) {
        setEligibility(res.data);
      }
    } catch (err) {
      // Ignored
    }
  };

  useEffect(() => {
    if (id) {
      loadReviewsData(id);
      checkReviewEligibility(id);
    }
  }, [id, user]);

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
            if (res.data.stitchOptions && res.data.stitchOptions.length > 0) {
              setSelectedStitchOption(res.data.stitchOptions[0]);
            } else {
              setSelectedStitchOption(null);
            }
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

  const stitchAddon = selectedStitchOption?.price || 0;
  const effectivePrice = product.price + stitchAddon;
  const effectiveOriginalPrice = (product.originalPrice || product.price) + stitchAddon;

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, 1, selectedStitchOption || undefined);
    if (!user) {
      showToast('Please sign in to proceed with your order ✨');
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus({
        checked: true,
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      });
      return;
    }
    const days = product.deliveryInfo?.estimatedDays || 4;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    const dateStr = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    setPincodeStatus({
      checked: true,
      valid: true,
      date: dateStr,
      message: `Standard Express Delivery by ${dateStr}. Cash on Delivery (COD) available for PIN ${pincode.trim()}.`
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !product) return;
    setSubmittingReview(true);
    setReviewSuccessMsg(null);

    const imagesArray = reviewImagesInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.startsWith('http://') || s.startsWith('https://'));

    try {
      const res = await reviewService.createReview(product.id, {
        rating: newRating,
        title: reviewTitle.trim(),
        comment: newComment.trim(),
        images: imagesArray
      });

      if (res.success) {
        setReviewSuccessMsg(res.message || 'Thank you! Your review has been submitted for moderation and will appear once approved.');
        setReviewTitle('');
        setNewComment('');
        setReviewImagesInput('');
        setNewRating(5);
        if (id) {
          loadReviewsData(id);
          checkReviewEligibility(id);
        }
      } else {
        alert(res.message || 'Could not submit review');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const dynamicCount = reviewStats?.totalReviews ?? (productReviews.length || product.reviewsCount || 0);
  const dynamicRating = reviewStats?.averageRating || (productReviews.length > 0
    ? Math.round((productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length) * 10) / 10
    : (product.rating || 4.8));

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

              {/* Video Badge Overlay if videoUrl available */}
              {product.videoUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVideoModalOpen(true);
                  }}
                  className="absolute bottom-3 left-3 z-20 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-3 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                  title="Watch Loom Video"
                >
                  <Play className="w-3.5 h-3.5 fill-gray-950 text-gray-950" />
                  <span>Real Loom Video</span>
                </button>
              )}

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
              <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 mb-1.5">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  Rs. {effectivePrice.toLocaleString()}
                </span>
                {effectiveOriginalPrice > effectivePrice && (
                  <>
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      Rs. {effectiveOriginalPrice.toLocaleString()}
                    </span>
                    <span className="badge-discount text-xs">
                      ({product.discountPercent}% off)
                    </span>
                  </>
                )}
                {selectedStitchOption && selectedStitchOption.price > 0 && (
                  <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-semibold px-2 py-0.5 rounded-xs">
                    Includes ₹{selectedStitchOption.price} Stitching
                  </span>
                )}
              </div>
              <div className="text-[11px] text-gray-500 mb-4 flex items-center gap-1.5">
                <span className="text-emerald-700 font-semibold">Inclusive of all taxes</span>
                <span>•</span>
                <span>Direct Loom Pricing</span>
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

              {/* Stitching / Customization Option (Master Tailor) */}
              {product.stitchOptions && product.stitchOptions.length > 0 && (
                <div className="mb-6 bg-gradient-to-br from-amber-50/70 to-orange-50/40 p-4 rounded-sm border border-amber-200">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 uppercase tracking-wider">
                      <Scissors className="w-3.5 h-3.5 text-amber-700" />
                      <span>Select Stitching / Customization</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-xs">
                      Master Handloom Tailoring
                    </span>
                  </div>
                  <div className="space-y-2">
                    {product.stitchOptions.map((opt, i) => {
                      const isSelected = selectedStitchOption?.type === opt.type;
                      return (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setSelectedStitchOption(opt)}
                          className={`w-full p-2.5 rounded-sm border text-left flex items-start justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white border-amber-600 ring-2 ring-amber-600/30 shadow-xs'
                              : 'bg-white/80 border-gray-200 hover:border-amber-400'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 pr-2">
                            <span className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-amber-700 bg-amber-700' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                            </span>
                            <div>
                              <span className="text-xs font-bold text-gray-900 block leading-tight">{opt.type}</span>
                              {opt.description && (
                                <p className="text-[11px] text-gray-600 mt-0.5 font-normal">
                                  {opt.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`text-xs font-bold shrink-0 px-2 py-0.5 rounded-xs ${
                            opt.price === 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {opt.price === 0 ? 'Free / Included' : `+₹${opt.price}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Direct Weaver Trust Strip */}
              <div className="grid grid-cols-2 gap-2 mb-6 p-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-[10px] font-bold">🏭</span>
                  <span><strong>Loom Direct Rate:</strong> Zero retail markups</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>100% Quality Checked:</strong> Fabric certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Fast Dispatch:</strong> {product.dispatchTime || 'Within 24-48 Hours'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-purple-600 shrink-0" />
                  <span><strong>7-Day Returns:</strong> Easy pickup &amp; exchange</span>
                </div>
              </div>

              {/* Pincode Delivery Estimator */}
              <div className="mb-6 p-3.5 bg-gray-50/80 border border-gray-200 rounded-sm">
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-600" /> Check Estimated Delivery Date
                </label>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode (e.g. 395002)"
                    className="flex-1 bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-black transition-colors cursor-pointer"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <div className={`mt-2 text-xs flex items-center gap-1.5 ${pincodeStatus.valid ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {pincodeStatus.valid ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                    <span>{pincodeStatus.message}</span>
                  </div>
                )}
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
                          onClick={() => addToCart(product, selectedSize, selectedColor, 1, selectedStitchOption || undefined)}
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
                      onClick={() => openWhatsApp(getWhatsAppProductUrl(product, selectedSize, selectedColor, settings.whatsapp?.number, selectedStitchOption))}
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
              {(product.fabric || product.work || ['Sarees', 'Lehengas', 'Salwar Suits', 'Kurtis', 'Gowns'].includes(product.category)) ? (
                <div className="bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 p-4 sm:p-6 rounded-sm border border-amber-200 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-200/80">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      <span className="font-serif font-bold text-sm text-gray-900">Artisan Ethnic Craft Details</span>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-xs border border-amber-300">
                      Authentic Handloom Weave
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs text-gray-700">
                    <div>
                      <span className="text-gray-400 block font-medium">Fabric / Weave</span>
                      <span className="font-semibold text-gray-900">{product.fabric || product.specifications?.fabric || 'Pure Handloom Silk'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Work / Craftsmanship</span>
                      <span className="font-semibold text-gray-900">{product.work || 'Intricate Zari & Resham Embroidery'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Occasion</span>
                      <span className="font-semibold text-gray-900">{product.occasion || product.specifications?.occasion || 'Bridal, Wedding & Festive'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Set Contents</span>
                      <span className="font-semibold text-gray-900">{product.setContents || 'Complete Set with Fabric & Details'}</span>
                    </div>
                    {product.sareeLength && (
                      <div>
                        <span className="text-gray-400 block font-medium">Saree Length</span>
                        <span className="font-semibold text-gray-900">{product.sareeLength}</span>
                      </div>
                    )}
                    {product.lehengaFlare && (
                      <div>
                        <span className="text-gray-400 block font-medium">Lehenga Flare / Gher</span>
                        <span className="font-semibold text-gray-900">{product.lehengaFlare}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400 block font-medium">Wash &amp; Care</span>
                      <span className="font-semibold text-gray-900">{product.washCare || 'Dry Clean Recommended'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Dispatch Timeline</span>
                      <span className="font-semibold text-gray-900">{product.dispatchTime || 'Within 24-48 Hours'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Manufacturing Origin</span>
                      <span className="font-semibold text-gray-900">India (Handcrafted Heritage)</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">COD Availability</span>
                      <span className="font-semibold text-emerald-700">Available across all serviceable pin codes</span>
                    </div>
                  </div>
                </div>
              ) : product.category === 'Accessories' ? (
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
            <div className="max-w-4xl space-y-8 text-left">
              {/* Overall Ratings & Score Summary Card */}
              <div className="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 p-5 sm:p-7 rounded-sm border border-amber-200/80 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left Column: Big Score */}
                  <div className="md:col-span-5 text-center md:text-left md:border-r border-amber-200/80 md:pr-6">
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                      <span className="font-serif text-4xl sm:text-5xl font-extrabold text-gray-950">
                        {dynamicRating.toFixed(1)}
                      </span>
                      <span className="text-gray-400 text-base font-semibold">/ 5.0</span>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-1 my-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < Math.round(dynamicRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs font-medium text-gray-600">
                      Based on <strong className="text-gray-900">{dynamicCount} verified customer ratings</strong>
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Verified Buyer Reviews
                    </div>
                  </div>

                  {/* Right Column: Rating Distribution Bars */}
                  <div className="md:col-span-7 space-y-1.5 text-xs">
                    {[5, 4, 3, 2, 1].map((starNum) => {
                      const starCount = reviewStats?.distribution?.[starNum as keyof typeof reviewStats.distribution] ||
                        productReviews.filter(r => Math.round(r.rating) === starNum).length;
                      const percent = dynamicCount > 0 ? Math.round((starCount / dynamicCount) * 100) : (starNum === 5 ? 80 : starNum === 4 ? 20 : 0);

                      return (
                        <div key={starNum} className="flex items-center gap-3">
                          <span className="w-10 text-gray-700 font-semibold flex items-center justify-end gap-1">
                            {starNum} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="w-12 text-gray-500 text-[11px] text-right font-medium">
                            {percent}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Customer Photo Gallery Strip */}
              {(reviewStats?.photoGallery?.length || productReviews.some(r => r.images && r.images.length > 0)) && (
                <div className="bg-gray-50/70 p-4 sm:p-5 rounded-sm border border-gray-200">
                  <h4 className="font-serif font-bold text-sm text-gray-900 mb-2.5 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gray-700" />
                    Customer Photo Gallery
                  </h4>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {(reviewStats?.photoGallery || productReviews.flatMap(r => r.images || [])).slice(0, 10).map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPhotoModal(imgUrl)}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-sm overflow-hidden border border-gray-200 hover:border-gray-900 transition-all cursor-pointer group shadow-2xs"
                      >
                        <img src={imgUrl} alt={`Customer review photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Submission Section / Verification Notice */}
              <div className="bg-white border border-gray-200 rounded-sm p-5 sm:p-6 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-gray-100 gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-base text-gray-900">
                      Write a Customer Review
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Help fellow ethnic wear enthusiasts with fit, weave texture, and zari details.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto">
                    Verified Purchases Only
                  </span>
                </div>

                {reviewSuccessMsg && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-sm mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{reviewSuccessMsg}</span>
                  </div>
                )}

                {!user ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 text-center">
                    <p className="text-xs text-gray-600 mb-3">
                      Have you ordered this handcrafted outfit? Please sign in to submit a verified buyer review.
                    </p>
                    <Link
                      to="/login"
                      className="inline-block bg-gray-900 text-white font-semibold text-xs px-5 py-2.5 uppercase tracking-wider rounded-sm hover:bg-black transition-colors"
                    >
                      Sign In to Review
                    </Link>
                  </div>
                ) : eligibility && !eligibility.isVerifiedBuyer ? (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-sm p-4 text-xs text-amber-800 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Verified Buyer Protected</strong>
                      To maintain authentic boutique quality standards, only customers who have placed an order for this product can submit a review.
                    </div>
                  </div>
                ) : eligibility && eligibility.hasReviewed ? (
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-sm p-4 text-xs text-emerald-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>You have already submitted a review for this product. Thank you for your feedback!</span>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Overall Rating <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-1 cursor-pointer">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setNewRating(i + 1)}
                            className="p-1 text-amber-400 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                i < newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 font-bold text-gray-800 text-xs">
                          {newRating === 5 ? '5 Stars - Outstanding & Royal' :
                           newRating === 4 ? '4 Stars - Very Good' :
                           newRating === 3 ? '3 Stars - Average' :
                           newRating === 2 ? '2 Stars - Below Expectations' : '1 Star - Poor'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Review Title (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Gorgeous zari border, perfect drape for wedding"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-sm p-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Detailed Review Experience <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Describe the fabric feel, embroidery finishing, unstitched blouse allowance, or fit..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-sm p-3 text-xs text-gray-900 focus:outline-none focus:border-gray-900 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 flex items-center justify-between">
                        <span>Photo Attachment URLs (Optional)</span>
                        <span className="text-[10px] text-gray-400 font-normal">Separate multiple URLs with commas</span>
                      </label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={reviewImagesInput}
                        onChange={(e) => setReviewImagesInput(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-sm p-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-gray-900 text-white font-semibold text-xs py-2.5 px-6 uppercase tracking-wider rounded-sm hover:bg-black transition-colors disabled:opacity-50 cursor-pointer shadow-xs flex items-center gap-2"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
                    </button>
                  </form>
                )}
              </div>

              {/* Customer Reviews List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-gray-900">
                    Customer Reviews ({productReviews.length})
                  </h3>
                  <span className="text-xs text-gray-500">
                    Showing verified customer reviews
                  </span>
                </div>

                {productReviews.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-6 bg-gray-50 text-center rounded-sm border border-gray-100">
                    No approved customer reviews yet. Be the first verified buyer to share your feedback!
                  </p>
                ) : (
                  <div className="space-y-4 divide-y divide-gray-100">
                    {productReviews.map((rev) => (
                      <div key={rev.id || rev._id} className="pt-5 first:pt-0 text-xs">
                        {/* Reviewer Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 text-xs sm:text-sm">{rev.userName}</span>
                                {rev.isVerifiedBuyer && (
                                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Buyer
                                  </span>
                                )}
                              </div>
                              {rev.userLocation && (
                                <span className="text-[11px] text-gray-400 block">{rev.userLocation}</span>
                              )}
                            </div>
                          </div>
                          <span className="text-gray-400 text-[11px]">{rev.date}</span>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 my-2">
                          {Array.from({ length: 5 }).map((_, r) => (
                            <Star
                              key={r}
                              className={`w-3.5 h-3.5 ${
                                r < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                              }`}
                            />
                          ))}
                          <span className="ml-1.5 font-bold text-gray-800 text-[11px]">{rev.rating}.0</span>
                        </div>

                        {/* Title & Comment */}
                        {rev.title && (
                          <h5 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">{rev.title}</h5>
                        )}
                        <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">{rev.comment}</p>

                        {/* Customer Photos in Review */}
                        {rev.images && rev.images.length > 0 && (
                          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                            {rev.images.map((imgUrl, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setPhotoModal(imgUrl)}
                                className="w-16 h-16 rounded-sm overflow-hidden border border-gray-200 hover:border-gray-900 transition-all shrink-0 cursor-pointer"
                              >
                                <img src={imgUrl} alt="Review snapshot" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lightbox Photo Preview Modal */}
              {photoModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="relative max-w-2xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl">
                    <button
                      onClick={() => setPhotoModal(null)}
                      className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <img src={photoModal} alt="Customer review visual" className="max-h-[85vh] w-auto object-contain mx-auto" />
                  </div>
                </div>
              )}
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

        {/* Product Video Modal */}
        {isVideoModalOpen && product.videoUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in cursor-pointer"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <div
              className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-3.5 border-b border-neutral-800 bg-neutral-950">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{product.name} — Real Loom &amp; Drape Showcase</span>
                </span>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video w-full bg-black flex items-center justify-center">
                {product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={product.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                    title="Product Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={product.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export interface ProductSpecification {
  sleeveLength?: string;
  collar?: string;
  pattern?: string;
  fit?: string;
  pockets?: string;
  occasion?: string;
  fabric?: string;
  lining?: string;
  closure?: string;
  // Accessories & Bags Specifications
  material?: string;
  lensMaterial?: string;
  frameShape?: string;
  uvProtection?: string;
  dimensions?: string;
  warranty?: string;
  strapMaterial?: string;
  buckleType?: string;
  bagStyle?: string;
  compartments?: string;
  laptopFit?: string;
  hardware?: string;
  beltWidth?: string;
}

export interface StitchOption {
  _id?: string;
  type: string;
  price: number;
  description?: string;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  brand: string;
  category: string;
  gender: 'Women' | 'Men' | 'Kids' | 'Unisex';
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  colors: { name: string; hex: string; image?: string }[];
  sizes: string[];
  isTrending?: boolean;
  isDeal?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  description: string;
  specifications: ProductSpecification;
  dealTag?: string; // e.g. "Under ₹799", "Best of Styles"
  stock?: number;
  sku?: string;

  // Ethnic Wear Fields
  fabric?: string;
  work?: string;
  occasion?: string;
  washCare?: string;
  setContents?: string;
  sareeLength?: string;
  lehengaFlare?: string;
  dispatchTime?: string;
  videoUrl?: string;
  stitchOptions?: StitchOption[];
  deliveryInfo?: {
    estimatedDays?: number;
    isCodAvailable?: boolean;
    freeShipping?: boolean;
  };
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  selectedStitchOption?: StitchOption;
  quantity: number;
}

export interface Category {
  id: string;
  _id?: string;
  name: string;
  image: string;
  itemCount: number;
  slug: string;
  featured?: boolean;
  colSpan?: string;
  gender?: string;
  parent?: string | null;
  order?: number;
  showInMenu?: boolean;
  type?: 'category' | 'occasion' | 'festival' | 'collection';
  children?: Category[];
}

export interface MarqueeItem {
  id: string;
  _id?: string;
  text: string;
  link?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface PageItem {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
}

export interface FaqItem {
  id: string;
  _id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface Setting {
  announcements: { text: string; link?: string; isActive?: boolean }[];
  whatsapp: {
    number: string;
    defaultMessage: string;
    enabled: boolean;
  };
  support: {
    phone: string;
    email: string;
    address: string;
  };
  workingHours: {
    days: string;
    timing: string;
  };
  cod: {
    enabled: boolean;
    extraFee: number;
    thresholdForFreeCOD: number;
  };
  shipping: {
    freeShippingThreshold: number;
    standardFee: number;
  };
  branding: {
    storeName: string;
    tagline: string;
    footerText: string;
    socialLinks: {
      instagram?: string;
      facebook?: string;
      youtube?: string;
      pinterest?: string;
    };
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

export interface Order {
  id: string;
  _id?: string;
  orderId?: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount?: number;
  discount?: number;
  shippingFee?: number;
  shippingCharge?: number;
  subtotal?: number;
  codCharge?: number;
  couponCode?: string;
  coupon?: string;
  status: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | string;
  paymentMethod: 'COD' | 'UPI' | 'Card' | 'Online' | string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | string;
  paymentId?: string;
  shippingAddress: {
    fullName?: string;
    street: string;
    address?: string;
    city: string;
    state: string;
    pincode: string;
    phone?: string;
    country?: string;
  };
  trackingNumber?: string;
  carrierName?: string;
  trackingUrl?: string;
  deliveredAt?: string;
  exchangeStatus?: 'none' | 'requested' | 'approved' | 'rejected';
  exchangeReason?: string;
  exchangeNotes?: string;
  exchangeRequestedAt?: string;
  exchangeResolvedAt?: string;
  exchangeAdminNotes?: string;
}

export interface ShippingZone {
  _id?: string;
  id?: string;
  country: string;
  countryCode?: string;
  charge: number;
  freeAbove: number;
  estimatedDays?: string;
  isActive?: boolean;
}

export interface CouponItem {
  _id?: string;
  id?: string;
  code: string;
  type?: 'percent' | 'flat';
  discountType?: 'percentage' | 'fixed' | 'percent' | 'flat';
  value?: number;
  discountValue?: number;
  minOrder?: number;
  minimumOrderValue?: number;
  maxDiscount?: number;
  maximumDiscount?: number;
  expiry?: string;
  expiryDate?: string;
  usageLimit?: number;
  usedCount?: number;
  paymentMethod?: 'any' | 'prepaid' | 'cod';
  isActive?: boolean;
}


export interface FilterState {
  searchQuery: string;
  categories: string[];
  genders: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  minDiscount: number;
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'newest' | 'discount';
  fabrics?: string[];
  occasions?: string[];
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses?: {
    _id?: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }[];
}

export interface Review {
  id: string;
  _id?: string;
  user?: string | any;
  userName: string;
  userAvatar?: string;
  userLocation?: string;
  product: string | any;
  productName?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedBuyer?: boolean;
  isVerifiedPurchase?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  helpfulVotes?: number;
  createdAt?: string;
  date?: string;
}

export interface BlogPostItem {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  readTime: string;
  views?: number;
  isPublished: boolean;
  publishedAt?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerItem {
  id: string;
  _id?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  desktopImage: string;
  mobileImage?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
  textColor?: 'light' | 'dark';
  alignment?: 'left' | 'center' | 'right';
}

export interface TrustBadgeItem {
  id: string;
  _id?: string;
  title: string;
  subtitle?: string;
  icon: 'shield' | 'truck' | 'creditCard' | 'rotate' | 'sparkles' | 'check';
  order: number;
  isActive: boolean;
}

export interface HomeSectionItem {
  id: string;
  _id?: string;
  title: string;
  subtitle?: string;
  type: 'story_circles' | 'product_grid' | 'banner_grid' | 'campaign_banner' | 'bestselling_categories';
  order: number;
  isActive: boolean;
  config: {
    filterBy?: 'trending' | 'deal' | 'new' | 'category' | 'all';
    category?: string;
    limit?: number;
    description?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    banners?: {
      image: string;
      title: string;
      subtitle?: string;
      link: string;
      badge?: string;
      tag?: string;
      description?: string;
    }[];
    ctaText?: string;
    ctaLink?: string;
    bgColor?: string;
  };
  products?: Product[];
}

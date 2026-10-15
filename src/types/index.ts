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

export interface Product {
  id: string;
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
  description: string;
  specifications: ProductSpecification;
  dealTag?: string; // e.g. "Under ₹799", "Best of Styles"
  stock?: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
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
  discountAmount: number;
  shippingFee: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'COD' | 'UPI' | 'Card';
  shippingAddress: {
    fullName?: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone?: string;
  };
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
  user?: string;
  userName: string;
  userAvatar?: string;
  userLocation?: string;
  product: string;
  productName?: string;
  rating: number;
  comment: string;
  isVerifiedPurchase?: boolean;
  createdAt?: string;
  date?: string;
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
  type: 'story_circles' | 'product_grid' | 'banner_grid' | 'campaign_banner';
  order: number;
  isActive: boolean;
  config: {
    filterBy?: 'trending' | 'deal' | 'new' | 'category' | 'all';
    category?: string;
    limit?: number;
    banners?: {
      image: string;
      title: string;
      subtitle: string;
      link: string;
      badge: string;
    }[];
    ctaText?: string;
    ctaLink?: string;
    bgColor?: string;
  };
  products?: Product[];
}

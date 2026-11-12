export type ProductCategory = 
  | 'all'
  | 'pherans'
  | 'kurtas'
  | 'pashmina'
  | 'stoles'
  | 'cosmetics'
  | string;

export interface CategoryConfig {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt?: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  needleworkFocus?: string;
  isFeatured?: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  colorHex: string;
  size: string; // 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Custom' | 'One Size'
  stockCount: number;
  priceDelta: number;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number; // 1-5
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku?: string;
  name: string;
  subtitle: string;
  category: string;
  description: string;
  craftsmanship: string;
  careGuide: string;
  ingredients?: string; // For cosmetics
  basePrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  fabric: string; // e.g. "Pure Silk Velvet", "GI Changthangi Pashmina", "Chanderi Raw Silk"
  embroidery: string; // e.g. "Tilla Metallic Zari", "Sozni Fine Needlework", "Aari Chain Stitch"
  occasions: string[];
  primaryImage: string;
  imageAlt?: string; // SEO Image Alt tag
  galleryImages: string[];
  variants: ProductVariant[];
  reviews: Review[];
  // Per-product SEO customization
  seoTitle?: string;
  seoDescription?: string;
  focusKeywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface CartItem {
  id: string; // unique item id in cart
  productId: string;
  product: Product;
  variantId: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderDossier {
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'PAYTM_QR' | 'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'COD';
  paymentStatus: 'PAID' | 'PENDING';
  paytmUtr?: string;
  paytmVerified?: boolean;
  giftPackaging?: {
    isGift: boolean;
    recipientName?: string;
    giftMessage?: string;
  };
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  subTotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingCost: number;
  totalAmount: number;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSpend: number;
  description: string;
}

export interface PaymentGatewayConfig {
  environment: 'sandbox' | 'live';
  razorpayKeyId: string;
  razorpayKeySecret: string;
  webhookSecret: string;
  currency: string;
  cardEnabled: boolean;
  upiEnabled: boolean;
  codEnabled: boolean;
  netbankingEnabled: boolean;
  autoCapture: boolean;
  lastTestedAt?: string;
  // Paytm QR & Direct UPI Gateway Config
  paytmQrEnabled: boolean;
  paytmUpiId: string; // e.g. "humperszk@paytm"
  paytmMerchantName: string; // e.g. "Kāshida Couture Srinagar"
  paytmMerchantCode: string; // e.g. "KASHIDA001"
  paytmCustomQrUrl?: string; // Optional custom merchant QR image URL
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  ogImage: string;
  twitterHandle: string;
}

export interface ProductSEOScore {
  productId: string;
  totalScore: number; // 0 - 100
  grade: 'EXEMPLARY' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL';
  metrics: {
    keywordsScore: number; // max 35
    titleScore: number; // max 30
    descriptionScore: number; // max 35
  };
  titleLength: number;
  descriptionLength: number;
  wordCount: number;
  detectedKeywords: string[];
  missingTargetKeywords: string[];
  recommendations: {
    type: 'TITLE' | 'KEYWORDS' | 'DESCRIPTION' | 'CRAFT';
    severity: 'CRITICAL' | 'WARNING' | 'TIP';
    message: string;
    suggestedFix?: string;
  }[];
}

export interface CatalogSEOHealthSummary {
  overallHealthIndex: number; // 0 - 100
  totalProductsScanned: number;
  exemplaryCount: number;
  goodCount: number;
  needsImprovementCount: number;
  criticalCount: number;
  averageTitleLength: number;
  averageDescriptionLength: number;
  topMissingKeywords: { keyword: string; missingInCount: number }[];
}

export interface UserAddress {
  id: string;
  isDefault: boolean;
  label: 'Home Sanctuary' | 'Atelier' | 'Office' | string;
  fullName: string;
  phone: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserMeasurements {
  chestInches: string;
  shoulderInches: string;
  sleeveInches: string;
  heightFeet: string;
  waistInches?: string;
  preferredFit: 'Royal Relaxed Drape' | 'Contemporary Structured' | 'Traditional Imperial';
  monogramInitials?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  passwordHash: string;
  vipTier: 'Patron Associate' | 'Kashmir Royal Guild' | 'Mughal Court VIP Connoisseur';
  loyaltyPoints: number;
  createdAt: string;
  twoFactorEnabled: boolean;
  role?: 'ADMIN' | 'PATRON';
  addresses: UserAddress[];
  measurements: UserMeasurements;
}

export interface AdminSecurityConfig {
  adminEmail: string;
  passwordHash: string;
  securityPin?: string;
  twoFactorEnabled: boolean;
  lastLoginTimestamp?: string;
  sessionTimeoutMinutes: number;
}

export interface ProductQA {
  id: string;
  productId: string;
  question: string;
  askedBy: string;
  askedAt: string;
  answer: string;
  answeredBy: string;
  answeredAt: string;
  helpfulCount: number;
}

export interface HomepageHeroConfig {
  imageUrl: string;
  badge: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  overlayOpacity: number; // 0 - 100
}

export interface HomepageLookbookItem {
  id: string;
  title: string;
  subtitle: string;
  categoryTag: string;
  imageUrl: string;
  linkCategory: string;
}

export interface HomepageHeritageConfig {
  artisanImageUrl: string;
  artisanImageAlt: string;
  dossierTitle: string;
  dossierDescription: string;
  headline: string;
  subheadline: string;
  narrativeParagraph1: string;
  narrativeParagraph2: string;
}

export interface HomepagePromoBannerConfig {
  enabled: boolean;
  imageUrl: string;
  badge: string;
  title: string;
  subtitle: string;
  couponCode: string;
}

export interface HomepageCMSConfig {
  hero: HomepageHeroConfig;
  lookbook: HomepageLookbookItem[];
  heritage: HomepageHeritageConfig;
  promoBanner: HomepagePromoBannerConfig;
}




import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  Star,
  Ruler,
  CheckCircle,
  Share2,
  Sparkles,
  ArrowLeft,
  Send,
  Scissors,
  Award,
} from 'lucide-react';
import { Product, Review, SEOConfig } from '../../types';
import { SizeChartModal } from './SizeChartModal';
import { calculateProductSEOScore } from '../../utils/seoHealth';
import { formatPrice } from '../../utils/currency';
import { DeliveryEstimator } from './DeliveryEstimator';
import { BankOffersWidget } from './BankOffersWidget';
import { FrequentlyBoughtTogether } from './FrequentlyBoughtTogether';
import { StickyFastBuyBar } from './StickyFastBuyBar';
import { CustomerReviewsBreakdown } from './CustomerReviewsBreakdown';
import { ProductQASection } from './ProductQASection';
import { RecentlyViewed } from './RecentlyViewed';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  seoConfig?: SEOConfig;
  currency?: string;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onBuyNow: (product: Product, size: string, color: string, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onBackToCatalog: () => void;
  onOpenGIModal?: () => void;
  onOpenBespokeModal?: () => void;
  onAddReview?: (productId: string, review: Review) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  seoConfig,
  currency = 'INR',
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onBackToCatalog,
  onOpenGIModal,
  onOpenBespokeModal,
  onAddReview,
}) => {
  const seoScore = calculateProductSEOScore(product, seoConfig);
  const [selectedImage, setSelectedImage] = useState<string>(product.primaryImage);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants[0]?.color || 'Natural'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants[0]?.size || 'Standard'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<'craft' | 'care' | 'shipping' | 'reviews' | 'seo_score' | 'qa'>('craft');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const buySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (buySectionRef.current) {
        const rect = buySectionRef.current.getBoundingClientRect();
        // Show sticky bar once user scrolls past the main buy box
        setShowStickyBar(rect.bottom < 80);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track recently viewed products in localStorage for luxury patron convenience
  useEffect(() => {
    if (typeof window !== 'undefined' && product?.id) {
      try {
        const stored = localStorage.getItem('kashida_recently_viewed');
        const ids: string[] = stored ? JSON.parse(stored) : [];
        const updated = [product.id, ...ids.filter((id) => id !== product.id)].slice(0, 8);
        localStorage.setItem('kashida_recently_viewed', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  }, [product?.id]);

  // Review submission state
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  const discountedPrice = Math.round(
    product.basePrice * (1 - product.discountPercent / 100)
  );
  const savings = product.basePrice - discountedPrice;

  const currentVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  ) || product.variants[0];

  const isOutOfStock = (currentVariant?.stockCount || 0) <= 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setMousePos({ x, y });
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuy = () => {
    if (isOutOfStock) return;
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      location: 'Verified Patron',
      rating: newReviewRating,
      date: 'Today',
      title: 'Exquisite craftsmanship',
      comment: newReviewComment.trim(),
      verified: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    if (onAddReview) {
      onAddReview(product.id, newRev);
    }
    setNewReviewAuthor('');
    setNewReviewComment('');
    setReviewFormOpen(false);
  };

  const relatedItems = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 3);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#F2EDE4]">
        <button
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#525B56] hover:text-[#162B21] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Kashmiri Collections</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#525B56] hover:text-[#C5A059] cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copied Link' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main PDP Grid: Gallery Left, Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Image Gallery with Interactive Zoom Loupe (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sticky top-28">
          {/* Thumbnails */}
          {product.galleryImages.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:w-20 shrink-0">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 shrink-0 border overflow-hidden transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-[#162B21] ring-1 ring-[#162B21]'
                      : 'border-[#EBE4D8] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Zoomable Showcase */}
          <div
            className="relative flex-1 aspect-[3/4] bg-[#F2EDE4]/60 overflow-hidden cursor-crosshair border border-[#EBE4D8] rounded-xs shadow-xs"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={selectedImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-150 ease-out ${
                isZoomed ? 'scale-175' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                  : undefined
              }
              referrerPolicy="no-referrer"
            />

            {/* Authenticity Watermark Badge */}
            <div className="absolute bottom-4 left-4 bg-[#162B21]/90 backdrop-blur-md px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#DFC289] font-medium flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3 h-3 text-[#DFC289]" />
              <span>Pure Kashmiri Handloom</span>
            </div>

            <div className="absolute top-4 right-4 bg-[#FAF8F5]/80 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#525B56] hidden sm:block">
              Hover to Zoom 175%
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Subtitle */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              <span>{product.embroidery}</span>
              <span aria-hidden="true">·</span>
              <span>{product.fabric}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#162B21] leading-tight font-medium">
              {product.name}
            </h1>

            <p className="text-xs text-[#525B56] leading-relaxed italic">
              {product.subtitle}
            </p>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-2 pt-1 text-xs text-[#525B56]">
              <div className="flex text-[#C5A059]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-current stroke-none'
                        : 'stroke-current fill-none'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono tabular-nums text-xs font-semibold text-[#162B21]">
                {product.rating.toFixed(2)}
              </span>
              <span className="text-[#525B56]/70">
                ({reviewsList.length} Authenticated Reviews)
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 bg-[#F2EDE4]/40 border border-[#EBE4D8] rounded-xs space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl font-semibold text-[#162B21] tabular-nums">
                {formatPrice(discountedPrice, currency)}
              </span>
              {product.discountPercent > 0 && (
                <>
                  <span className="font-mono text-base line-through text-[#525B56]/60 tabular-nums">
                    {formatPrice(product.basePrice, currency)}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#681A24]">
                    Save {formatPrice(savings, currency)} ({product.discountPercent}% Off)
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-[#525B56]">
              Inclusive of all handcrafted duties & insured global transit insurance.
            </p>
          </div>

          {/* Amazon/Flipkart-style Bank & Privilege Offers Widget */}
          <BankOffersWidget basePrice={discountedPrice} currency={currency} />

          {/* Color Variant Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs uppercase tracking-wider text-[#1C1F1E]">
              <span className="font-semibold">Artisan Colorway</span>
              <span className="text-[#525B56] font-medium">{selectedColor}</span>
            </div>
            <div className="flex gap-2.5">
              {Array.from(new Set(product.variants.map((v) => v.color))).map(
                (col) => {
                  const sample = product.variants.find((v) => v.color === col);
                  return (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`flex items-center gap-2 px-3.5 py-2 border text-xs tracking-wider uppercase transition-all cursor-pointer ${
                        selectedColor === col
                          ? 'border-[#162B21] bg-[#162B21] text-[#FAF8F5]'
                          : 'border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] hover:border-[#C5A059]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: sample?.colorHex || '#162B21' }}
                      />
                      <span>{col}</span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Size Variant Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs uppercase tracking-wider text-[#1C1F1E]">
              <span className="font-semibold">Tailored Size</span>
              {product.category !== 'cosmetics' && (
                <button
                  onClick={() => setIsSizeChartOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] underline text-[#C5A059] hover:text-[#162B21] cursor-pointer font-medium"
                >
                  <Ruler className="w-3 h-3" />
                  <span>Size Matrix & Custom Fit</span>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(product.variants.map((v) => v.size))).map(
                (sz) => {
                  const variant = product.variants.find(
                    (v) => v.size === sz && v.color === selectedColor
                  );
                  const out = (variant?.stockCount || 0) <= 0;

                  return (
                    <button
                      key={sz}
                      disabled={out}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-12 px-3 py-2 border text-xs tracking-wider uppercase transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'border-[#162B21] bg-[#162B21] text-[#FAF8F5]'
                          : out
                          ? 'border-[#EBE4D8] bg-[#F2EDE4]/40 text-[#525B56]/40 cursor-not-allowed line-through'
                          : 'border-[#EBE4D8] hover:border-[#C5A059] text-[#1C1F1E] bg-[#FAF8F5]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                }
              )}
            </div>

            {/* Inventory Scarcity / Availability Callout */}
            {currentVariant && currentVariant.stockCount > 0 && currentVariant.stockCount <= 3 ? (
              <p className="text-xs text-[#681A24] font-medium pt-1">
                ⚠️ Limited Cut: Only {currentVariant.stockCount} piece(s) available in this artisan allocation.
              </p>
            ) : currentVariant && currentVariant.stockCount > 0 ? (
              <p className="text-xs text-[#162B21] font-medium pt-1 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#162B21]" />
                <span>Ready to dispatch from Srinagar atelier within 48 hours</span>
              </p>
            ) : (
              <p className="text-xs text-[#681A24] font-medium pt-1">
                Currently made-to-order (Lead time: 21 days).
              </p>
            )}
          </div>

          {/* Quantity & Actions (with buySectionRef for Sticky Bar detection) */}
          <div ref={buySectionRef} className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#EBE4D8] bg-[#FAF8F5]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-sm text-[#1C1F1E] hover:bg-[#F2EDE4] cursor-pointer"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-mono tabular-nums text-center min-w-8">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-sm text-[#1C1F1E] hover:bg-[#F2EDE4] cursor-pointer"
                  disabled={quantity >= (currentVariant?.stockCount || 5)}
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  addedNotice
                    ? 'bg-[#234233] text-[#DFC289]'
                    : isOutOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5]'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#DFC289]" />
                <span>{addedNotice ? 'Allocated to Silk Bag ✓' : isOutOfStock ? 'Sold Out' : 'Add to Silk Bag'}</span>
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3.5 border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-[#162B21] bg-[#162B21] text-[#DFC289]'
                    : 'border-[#EBE4D8] text-[#1C1F1E] hover:border-[#C5A059] bg-[#FAF8F5]'
                }`}
                title={isWishlisted ? 'Saved to heirlooms' : 'Save piece'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Direct Buy Now Button (High-Contrast Amazon/Flipkart style) */}
            <button
              onClick={handleBuy}
              disabled={isOutOfStock}
              className="w-full py-3.5 px-6 border border-[#C5A059] bg-[#FAF8F5] hover:bg-[#C5A059] hover:text-[#FAF8F5] text-[#162B21] text-xs uppercase tracking-[0.2em] font-bold transition-all cursor-pointer shadow-xs"
            >
              Direct Reserve & Checkout
            </button>

            {/* Bespoke Commission Consultation Button */}
            {onOpenBespokeModal && (
              <button
                type="button"
                onClick={onOpenBespokeModal}
                className="w-full py-2.5 px-4 border border-[#162B21]/20 hover:border-[#162B21] bg-[#F2EDE4]/60 text-[#162B21] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Scissors className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Request Bespoke Fit / Custom Monogram</span>
              </button>
            )}
          </div>

          {/* Amazon/Flipkart-style Instant Delivery Estimator & Pincode Checker */}
          <DeliveryEstimator basePrice={discountedPrice} currency={currency} />

          {/* Content Quality Score UI Element (User Requirement) */}
          <div className="p-4 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Content Quality Score
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-base font-bold text-[#162B21]">
                  {seoScore.totalScore}
                </span>
                <span className="text-xs text-[#525B56]">/ 100</span>
                <span
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-xs uppercase tracking-wider ${
                    seoScore.grade === 'EXEMPLARY'
                      ? 'bg-emerald-100 text-emerald-800'
                      : seoScore.grade === 'GOOD'
                      ? 'bg-[#162B21] text-[#DFC289]'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {seoScore.grade === 'EXEMPLARY'
                    ? 'Exemplary'
                    : seoScore.grade === 'GOOD'
                    ? 'Verified'
                    : 'Moderate'}
                </span>
              </div>
            </div>

            {/* Score progress bar */}
            <div className="w-full bg-[#EBE4D8] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  seoScore.totalScore >= 85
                    ? 'bg-emerald-700'
                    : seoScore.totalScore >= 70
                    ? 'bg-[#C5A059]'
                    : 'bg-[#681A24]'
                }`}
                style={{ width: `${seoScore.totalScore}%` }}
              />
            </div>

            {/* 3 Pillars Summary */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-[#525B56] border-t border-[#EBE4D8]/60">
              <div>
                <span className="block opacity-75">Keywords Match</span>
                <span className="font-mono font-semibold text-[#162B21]">
                  {seoScore.metrics.keywordsScore}/35
                </span>
              </div>
              <div>
                <span className="block opacity-75">Title Snippet</span>
                <span className="font-mono font-semibold text-[#162B21]">
                  {seoScore.metrics.titleScore}/30
                </span>
              </div>
              <div>
                <span className="block opacity-75">Description</span>
                <span className="font-mono font-semibold text-[#162B21]">
                  {seoScore.metrics.descriptionScore}/35
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('seo_score');
                setTimeout(() => {
                  document.getElementById('pdp-tabs')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full text-center text-[10px] uppercase tracking-wider text-[#C5A059] hover:underline cursor-pointer pt-0.5 font-medium"
            >
              Inspect Full SEO & Content Dossier →
            </button>
          </div>

          {/* Trust Value Props */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#F2EDE4] text-center text-[#525B56]">
            {onOpenGIModal ? (
              <button
                type="button"
                onClick={onOpenGIModal}
                className="flex flex-col items-center hover:opacity-80 cursor-pointer"
                title="Inspect GI Certificate & Lab Assay"
              >
                <ShieldCheck className="w-5 h-5 text-[#C5A059] mb-1" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#162B21] underline decoration-[#C5A059]">
                  GI Provenance
                </span>
                <span className="text-[9px] text-[#C5A059]">Verify Seal →</span>
              </button>
            ) : (
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-[#C5A059] mb-1" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#162B21]">
                  GI Provenance
                </span>
                <span className="text-[9px]">Registered Tag</span>
              </div>
            )}
            <div className="flex flex-col items-center">
              <Truck className="w-5 h-5 text-[#C5A059] mb-1" />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#162B21]">
                Insured Transit
              </span>
              <span className="text-[9px]">Global DHL Air</span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-5 h-5 text-[#C5A059] mb-1" />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#162B21]">
                7-Day Concierge
              </span>
              <span className="text-[9px]">Effortless Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amazon-style Frequently Bought Together Ensemble Module */}
      <FrequentlyBoughtTogether
        currentProduct={product}
        allProducts={allProducts}
        currency={currency}
        onAddToCart={onAddToCart}
      />

      {/* Tabs Section: Craftsmanship, Care/Ingredients, Shipping, Reviews & SEO Dossier */}
      <div id="pdp-tabs" className="mt-16 pt-8 border-t border-[#F2EDE4]">
        <div className="flex space-x-8 border-b border-[#F2EDE4] overflow-x-auto pb-3 text-xs uppercase tracking-[0.2em] font-medium">
          <button
            onClick={() => setActiveTab('craft')}
            className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'craft'
                ? 'border-b-2 border-[#162B21] text-[#162B21] font-semibold'
                : 'text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            Craftsmanship & Heritage
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'care'
                ? 'border-b-2 border-[#162B21] text-[#162B21] font-semibold'
                : 'text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            {product.category === 'cosmetics' ? 'Ingredients & Usage' : 'Care & Storage Guide'}
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-b-2 border-[#162B21] text-[#162B21] font-semibold'
                : 'text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            White-Glove Shipping & Returns
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-b-2 border-[#162B21] text-[#162B21] font-semibold'
                : 'text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            Patron Reviews ({reviewsList.length})
          </button>
          <button
            onClick={() => setActiveTab('seo_score')}
            className={`pb-3 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'seo_score'
                ? 'border-b-2 border-[#162B21] text-[#162B21] font-semibold'
                : 'text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            <span>Content Quality & SEO</span>
            <span className="bg-[#162B21] text-[#DFC289] text-[10px] font-mono px-1.5 py-0.2 rounded-xs font-semibold">
              {seoScore.totalScore}/100
            </span>
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`pb-3 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'qa'
                ? 'border-b-2 border-[#162B21] text-[#162B21] font-semibold'
                : 'text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            <span>Artisan Q&A Direct</span>
            <span className="bg-[#DFC289] text-[#162B21] text-[9px] px-1.5 py-0.2 rounded-xs font-bold uppercase tracking-wider">
              Ask Artisan
            </span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-8 max-w-4xl text-sm leading-relaxed text-[#525B56]">
          {activeTab === 'craft' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-[#162B21]">
                Master Artisans of the Kashmir Valley
              </h3>
              <p>{product.craftsmanship}</p>
              <div className="p-4 bg-[#F2EDE4]/40 border border-[#EBE4D8] rounded-xs space-y-2 mt-4">
                <p className="font-semibold text-xs uppercase tracking-wider text-[#162B21]">
                  Authenticity Verification:
                </p>
                <p className="text-xs">
                  Every Kāshida garment comes encoded with an artisanal identification seal and certificate of provenance detailing the master artisan’s name, guild atelier, and production duration.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-[#162B21]">
                Preserving Heirloom Quality
              </h3>
              <p>{product.careGuide}</p>
              {product.ingredients && (
                <div className="pt-2">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-[#162B21] mb-1">
                    Verifiable Botanical Ingredients:
                  </h4>
                  <p className="font-mono text-xs bg-[#FAF8F5] p-3 border border-[#EBE4D8]">
                    {product.ingredients}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-[#162B21]">
                Complimentary Worldwide White-Glove Dispatch
              </h3>
              <p>
                All orders are dispatched from our Srinagar atelier in reinforced cedar-scented keepsake boxes. We utilize premium air freight partners (DHL Express / FedEx Priority) with full valuation insurance.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Domestic Delivery (India): 2–4 business days</li>
                <li>International Express (US, UK, UAE, EU): 4–7 business days</li>
                <li>7-day complimentary return or exchange concierge service</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <CustomerReviewsBreakdown
              productName={product.name}
              rating={product.rating}
              reviews={reviewsList}
              onAddReview={(newRev) => {
                setReviewsList([newRev, ...reviewsList]);
                if (onAddReview) {
                  onAddReview(product.id, newRev);
                }
              }}
            />
          )}

          {activeTab === 'seo_score' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2EDE4] pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
                      Authenticity & Metadata Audit
                    </span>
                    <h3 className="font-serif text-2xl text-[#162B21]">
                      Content Quality & Search Performance Dossier
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-[#525B56] block">Overall Score</span>
                      <span className="font-mono text-2xl font-bold text-[#162B21]">
                        {seoScore.totalScore} <span className="text-xs font-normal text-[#525B56]">/ 100</span>
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-xs uppercase tracking-wider ${
                        seoScore.grade === 'EXEMPLARY'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : seoScore.grade === 'GOOD'
                          ? 'bg-[#162B21] text-[#DFC289]'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {seoScore.grade === 'EXEMPLARY' ? 'Exemplary' : seoScore.grade === 'GOOD' ? 'Verified' : 'Moderate'}
                    </span>
                  </div>
                </div>

                {/* 3 Pillars Score Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 bg-white border border-[#EBE4D8] rounded-xs space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px]">Keywords Match</span>
                      <span className="font-mono font-bold text-[#162B21]">{seoScore.metrics.keywordsScore}/35</span>
                    </div>
                    <div className="w-full bg-[#EBE4D8] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-700 h-full" style={{ width: `${(seoScore.metrics.keywordsScore / 35) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-[#525B56] block">
                      {seoScore.detectedKeywords.length} craft terms verified in content.
                    </span>
                  </div>

                  <div className="p-3.5 bg-white border border-[#EBE4D8] rounded-xs space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px]">Title Snippet</span>
                      <span className="font-mono font-bold text-[#162B21]">{seoScore.metrics.titleScore}/30</span>
                    </div>
                    <div className="w-full bg-[#EBE4D8] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#162B21] h-full" style={{ width: `${(seoScore.metrics.titleScore / 30) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-[#525B56] block">
                      {seoScore.titleLength} characters (Optimal: 32-58).
                    </span>
                  </div>

                  <div className="p-3.5 bg-white border border-[#EBE4D8] rounded-xs space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px]">Description Richness</span>
                      <span className="font-mono font-bold text-[#162B21]">{seoScore.metrics.descriptionScore}/35</span>
                    </div>
                    <div className="w-full bg-[#EBE4D8] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#C5A059] h-full" style={{ width: `${(seoScore.metrics.descriptionScore / 35) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-[#525B56] block">
                      {seoScore.descriptionLength} characters ({seoScore.wordCount} words).
                    </span>
                  </div>
                </div>

                {/* Simulated Google Search Snippet */}
                <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                    Google Search Engine Snippet Preview
                  </span>
                  <div className="text-xs text-[#202124]">
                    <span className="text-[11px] text-[#202124]">https://kashida-couture.com</span>
                    <span className="text-gray-400 mx-1">›</span>
                    <span className="text-[11px] text-gray-500">{product.category}</span>
                  </div>
                  <h4 className="text-base text-[#1a0dab] font-medium hover:underline cursor-pointer leading-snug">
                    {product.name} — Luxury Kashmiri Couture
                  </h4>
                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                    {product.subtitle ? `${product.subtitle}. ` : ''}
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono pt-0.5">
                    <span className="text-amber-500 font-bold">★★★★★</span>
                    <span>{product.rating} ({reviewsList.length} reviews)</span>
                    <span>· ₹{discountedPrice.toLocaleString('en-IN')}</span>
                    <span>· In stock · Handcrafted in Srinagar</span>
                  </div>
                </div>

                {/* Verified Kashmiri Needlework & Provenance Keywords */}
                <div className="space-y-2 pt-2">
                  <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px] block">
                    Verified Craft & Botanical Keywords ({seoScore.detectedKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {seoScore.detectedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-800 font-mono text-[11px] rounded-xs"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="animate-in fade-in">
              <ProductQASection productId={product.id} productName={product.name} />
            </div>
          )}
        </div>
      </div>

      {/* Related Curations */}
      {relatedItems.length > 0 && (
        <div className="mt-16 pt-12 border-t border-[#F2EDE4]">
          <div className="space-y-1 mb-8">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block">
              Coordinated Ensemble
            </span>
            <h3 className="font-serif text-2xl text-[#162B21]">
              Frequently Appraised Together
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProduct(item)}
                className="group cursor-pointer bg-[#FAF8F5] p-3 border border-transparent hover:border-[#EBE4D8] transition-all"
              >
                <div className="aspect-[3/4] bg-[#F2EDE4] overflow-hidden mb-3">
                  <img
                    src={item.primaryImage}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-[#525B56]">
                  {item.category}
                </p>
                <h4 className="font-serif text-sm text-[#162B21] group-hover:text-[#C5A059] transition-colors truncate">
                  {item.name}
                </h4>
                <p className="font-mono text-xs text-[#162B21] mt-1 tabular-nums">
                  ₹{item.basePrice.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Products Gallery */}
      <RecentlyViewed
        currentProductId={product.id}
        allProducts={allProducts}
        currency={currency}
        onSelectProduct={onSelectProduct}
        onQuickAdd={(p) => onAddToCart(p, p.variants[0]?.size || 'Standard', p.variants[0]?.color || 'Natural', 1)}
      />

      {/* Sizing Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        category={product.category}
      />

      {/* Amazon/Flipkart Sticky Bottom Fast Buy Bar */}
      <StickyFastBuyBar
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        currency={currency}
        isWishlisted={isWishlisted}
        onToggleWishlist={() => onToggleWishlist(product)}
        onAddToCart={handleAdd}
        onBuyNow={handleBuy}
        isVisible={showStickyBar}
      />
    </div>
  );
};

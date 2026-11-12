import React, { useState } from 'react';
import { Eye, Heart, ShoppingBag, Star, Sparkles, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  currency?: string;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  currency = 'INR',
  onToggleWishlist,
  onQuickView,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const discountedPrice = Math.round(
    product.basePrice * (1 - product.discountPercent / 100)
  );

  const totalStock = product.variants.reduce((acc, v) => acc + v.stockCount, 0);
  const secondaryImage = product.galleryImages?.[1] || product.primaryImage;

  // Extract unique colors for swatches
  const uniqueColors = Array.from(
    new Map(product.variants.map((v) => [v.colorHex || v.color, v])).values()
  );

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#FAF8F5] flex flex-col transition-all duration-300 border border-transparent hover:border-[#DFC289]/40 p-2 -m-2 rounded-xs hover:shadow-lg hover:bg-white"
    >
      {/* Lead with Imagery: 70% Card Height with Smooth Secondary Image Flip */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EDE4]/60 cursor-pointer rounded-xs"
      >
        <img
          src={product.primaryImage}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered && secondaryImage !== product.primaryImage
              ? 'opacity-0 scale-105'
              : 'opacity-100 group-hover:scale-105'
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {secondaryImage && secondaryImage !== product.primaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} detail`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        )}

        {/* Minimal Unboxed Text Tag */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none z-10">
          {product.isNewArrival && (
            <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#162B21] bg-[#FAF8F5]/95 backdrop-blur-md px-2 py-0.5 shadow-xs border border-[#C5A059]/30">
              New Edit
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-white bg-[#681A24]/90 backdrop-blur-md px-2 py-0.5 shadow-xs">
              {product.discountPercent}% Privilege
            </span>
          )}
          {totalStock > 0 && totalStock <= 3 && (
            <span className="text-[9px] tracking-wider uppercase font-bold text-[#DFC289] bg-[#162B21]/90 px-2 py-0.5">
              Only {totalStock} In Atelier
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer z-10 ${
            isWishlisted
              ? 'bg-[#162B21] text-[#DFC289] shadow-md'
              : 'bg-[#FAF8F5]/85 text-[#1C1F1E] hover:bg-[#FAF8F5] hover:text-[#C5A059] shadow-xs'
          }`}
          aria-label={isWishlisted ? 'Remove from heirlooms' : 'Save to heirlooms'}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isWishlisted ? 'fill-[#DFC289] stroke-[#DFC289]' : 'stroke-[1.5]'
            }`}
          />
        </button>

        {/* Hover Quick Action Slider Bar */}
        <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2 px-3 bg-[#FAF8F5]/95 hover:bg-[#FAF8F5] text-[#162B21] text-[10px] uppercase tracking-[0.16em] font-semibold backdrop-blur-md transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:text-[#C5A059]"
          >
            <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Quick View</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="py-2 px-3.5 bg-[#162B21]/95 hover:bg-[#234233] text-[#DFC289] text-[10px] uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#DFC289]" />
            <span className="hidden sm:inline font-semibold">Bag</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-3 pb-1 flex flex-col flex-1 space-y-1.5">
        {/* Clean Unboxed Metadata with Typographic Separator */}
        <div className="flex items-center gap-1.5 text-[10px] text-[#525B56] uppercase tracking-[0.2em] font-medium">
          <span>{product.category}</span>
          <span aria-hidden="true" className="text-[#C5A059]">·</span>
          <span className="truncate">{product.embroidery}</span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectProduct(product)}
          className="font-serif text-base text-[#162B21] hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-1 font-medium leading-snug"
        >
          {product.name}
        </h3>

        {/* Color Swatch Dots */}
        {uniqueColors.length > 1 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            {uniqueColors.map((v, i) => (
              <span
                key={v.id}
                title={v.color}
                style={{ backgroundColor: v.colorHex || '#162B21' }}
                className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-xs"
              />
            ))}
            <span className="text-[10px] text-[#525B56]/70 tracking-tight">
              ({uniqueColors.length} tones)
            </span>
          </div>
        )}

        {/* Rating & Review Counter */}
        <div className="flex items-center gap-1.5 text-xs text-[#525B56]">
          <div className="flex text-[#C5A059]">
            <Star className="w-3 h-3 fill-current stroke-none" />
          </div>
          <span className="font-mono tabular-nums text-[11px] font-semibold text-[#162B21]">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-[10.5px] text-[#525B56]/70">({product.reviewsCount})</span>
        </div>

        {/* Price Baseline */}
        <div className="pt-1 flex items-baseline gap-2">
          <span className="font-mono text-base font-semibold text-[#162B21] tabular-nums">
            {formatPrice(discountedPrice, currency)}
          </span>
          {product.discountPercent > 0 && (
            <span className="font-mono text-xs line-through text-[#525B56]/60 tabular-nums">
              {formatPrice(product.basePrice, currency)}
            </span>
          )}
        </div>

        {/* Amazon/Flipkart-style Fast Delivery & Keepsake Box Assurance */}
        <div className="pt-1 flex items-center justify-between text-[10px] text-[#525B56] border-t border-[#F2EDE4]/80">
          <span className="text-emerald-800 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            <span>Ready for dispatch</span>
          </span>
          <span className="text-[9.5px] text-[#C5A059] uppercase tracking-wider font-semibold">
            Insured DHL
          </span>
        </div>
      </div>
    </div>
  );
};

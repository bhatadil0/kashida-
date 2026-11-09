import React from 'react';
import { ShoppingBag, Zap, Heart } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';

interface StickyFastBuyBarProps {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  currency?: string;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isVisible: boolean;
}

export const StickyFastBuyBar: React.FC<StickyFastBuyBarProps> = ({
  product,
  selectedSize,
  selectedColor,
  currency = 'INR',
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  isVisible,
}) => {
  if (!isVisible) return null;

  const discountedPrice = Math.round(
    product.basePrice * (1 - product.discountPercent / 100)
  );

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#EBE4D8] shadow-2xl py-3 px-4 sm:px-8 transition-transform duration-300 animate-in slide-in-from-bottom">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Product Info */}
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src={product.primaryImage}
            alt={product.name}
            className="w-12 h-14 object-cover border border-[#EBE4D8] rounded-xs shrink-0 hidden sm:block"
          />

          <div className="min-w-0">
            <h4 className="font-serif text-sm text-[#162B21] font-semibold truncate leading-tight">
              {product.name}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-[#525B56] mt-0.5">
              <span>Size: <strong>{selectedSize}</strong></span>
              <span>·</span>
              <span>Color: <strong>{selectedColor}</strong></span>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline text-emerald-800 font-medium">⚡ In Stock</span>
            </div>
          </div>
        </div>

        {/* Right: Price & Dual Action Buttons (Amazon/Flipkart Style) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right mr-1">
            <div className="font-mono text-base sm:text-lg font-bold text-[#162B21] tabular-nums">
              {formatPrice(discountedPrice, currency)}
            </div>
            {product.discountPercent > 0 && (
              <div className="text-[10px] text-[#681A24] font-medium hidden sm:block">
                {product.discountPercent}% Off
              </div>
            )}
          </div>

          {/* Wishlist button */}
          <button
            type="button"
            onClick={onToggleWishlist}
            className={`p-2.5 border transition-colors cursor-pointer hidden md:flex items-center justify-center rounded-xs ${
              isWishlisted
                ? 'border-[#162B21] bg-[#162B21] text-[#DFC289]'
                : 'border-[#EBE4D8] text-[#1C1F1E] hover:border-[#C5A059] bg-[#FAF8F5]'
            }`}
            title="Save to Heirloom Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Add to Bag */}
          <button
            type="button"
            onClick={onAddToCart}
            className="py-2.5 sm:py-3 px-3.5 sm:px-5 border border-[#162B21] hover:bg-[#162B21] hover:text-[#FAF8F5] text-[#162B21] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden sm:inline">Add to Bag</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Buy Now (Prominent High-Contrast Amazon/Flipkart style) */}
          <button
            type="button"
            onClick={onBuyNow}
            className="py-2.5 sm:py-3 px-4 sm:px-6 bg-[#C5A059] hover:bg-[#b08b47] text-[#162B21] text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Zap className="w-3.5 h-3.5 text-[#162B21] fill-current" />
            <span>Fast Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
};

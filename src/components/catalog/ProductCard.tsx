import React from 'react';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onSelectProduct,
  onQuickAdd,
}) => {
  const discountedPrice = Math.round(
    product.basePrice * (1 - product.discountPercent / 100)
  );

  const totalStock = product.variants.reduce((acc, v) => acc + v.stockCount, 0);

  return (
    <div className="group relative bg-[#FAF8F5] flex flex-col transition-all duration-300">
      {/* Lead with Imagery: 70% Card Height */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EDE4]/60 cursor-pointer">
        <img
          src={product.primaryImage}
          alt={product.name}
          onClick={() => onSelectProduct(product)}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Minimal Unboxed Text Tag (Max 1 subtle label, never a pill sandwich) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {product.isNewArrival && (
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#162B21] bg-[#FAF8F5]/90 backdrop-blur-sm px-2 py-0.5 shadow-xs">
              New Edit
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#681A24] bg-[#FAF8F5]/90 backdrop-blur-sm px-2 py-0.5 shadow-xs">
              {product.discountPercent}% Privilege
            </span>
          )}
          {totalStock > 0 && totalStock <= 3 && (
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#C5A059] bg-[#162B21]/90 text-[#DFC289] px-2 py-0.5">
              Only {totalStock} Left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-[#162B21] text-[#DFC289]'
              : 'bg-[#FAF8F5]/80 text-[#1C1F1E] hover:bg-[#FAF8F5] hover:text-[#C5A059]'
          }`}
          aria-label={isWishlisted ? 'Remove from heirlooms' : 'Save to heirlooms'}
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-[#DFC289] stroke-[#DFC289]' : 'stroke-[1.5]'}`}
          />
        </button>

        {/* Hover Quick Action Drawer */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2.5 px-3 bg-[#FAF8F5]/95 hover:bg-[#FAF8F5] text-[#162B21] text-[11px] uppercase tracking-[0.15em] font-medium backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Quick View</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="py-2.5 px-3 bg-[#162B21]/95 hover:bg-[#162B21] text-[#FAF8F5] text-[11px] uppercase tracking-wider backdrop-blur-md transition-colors flex items-center justify-center gap-1 shadow-md cursor-pointer"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#DFC289]" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-4 pb-2 flex flex-col flex-1">
        {/* Clean Unboxed Metadata with Typographic Separator */}
        <div className="flex items-center gap-2 text-[11px] text-[#525B56] uppercase tracking-wider mb-1">
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{product.embroidery}</span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectProduct(product)}
          className="font-serif text-base text-[#162B21] hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-1 font-medium leading-snug"
        >
          {product.name}
        </h3>

        {/* Rating note */}
        <div className="flex items-center gap-1.5 mt-1 text-xs text-[#525B56]">
          <div className="flex text-[#C5A059]">
            <Star className="w-3 h-3 fill-current stroke-none" />
          </div>
          <span className="font-mono tabular-nums text-[11px]">{product.rating.toFixed(1)}</span>
          <span className="text-[11px] text-[#525B56]/70">({product.reviewsCount})</span>
        </div>

        {/* Price Baseline */}
        <div className="mt-2.5 flex items-baseline gap-2.5">
          <span className="font-mono text-base font-medium text-[#162B21] tabular-nums">
            ₹{discountedPrice.toLocaleString('en-IN')}
          </span>
          {product.discountPercent > 0 && (
            <span className="font-mono text-xs line-through text-[#525B56]/60 tabular-nums">
              ₹{product.basePrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

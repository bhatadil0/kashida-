import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';

interface QuickViewModalProps {
  product: Product | null;
  currency?: string;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onViewFullPDP: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  currency = 'INR',
  onClose,
  onAddToCart,
  onViewFullPDP,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants[0]?.size || 'Standard'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants[0]?.color || 'Natural'
  );
  const [activeImage, setActiveImage] = useState<string>(product.primaryImage);
  const [added, setAdded] = useState(false);

  const discountedPrice = Math.round(
    product.basePrice * (1 - product.discountPercent / 100)
  );

  const currentVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  ) || product.variants[0];

  const isOutOfStock = (currentVariant?.stockCount || 0) <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] text-[#1C1F1E] rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Preview Left */}
        <div className="w-full md:w-1/2 bg-[#F2EDE4]/60 p-6 flex flex-col justify-between">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xs bg-[#FAF8F5]">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnail switcher */}
          {product.galleryImages.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-16 shrink-0 border overflow-hidden cursor-pointer ${
                    activeImage === img
                      ? 'border-[#162B21] ring-1 ring-[#162B21]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Module Right */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block">
                {product.embroidery}
              </span>
              <h2 className="font-serif text-2xl text-[#162B21] font-medium leading-snug mt-1">
                {product.name}
              </h2>
              <p className="text-xs text-[#525B56] mt-1 italic">
                {product.subtitle}
              </p>
            </div>

            {/* Price line */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-mono text-2xl font-semibold text-[#162B21] tabular-nums">
                {formatPrice(discountedPrice, currency)}
              </span>
              {product.discountPercent > 0 && (
                <>
                  <span className="font-mono text-sm line-through text-[#525B56]/60 tabular-nums">
                    {formatPrice(product.basePrice, currency)}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[#681A24] font-semibold">
                    {product.discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description excerpt */}
            <p className="text-xs text-[#525B56] leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider text-[#1C1F1E]">
                <span className="font-semibold">Colorway</span>
                <span className="text-[#525B56]">{selectedColor}</span>
              </div>
              <div className="flex gap-2">
                {Array.from(new Set(product.variants.map((v) => v.color))).map(
                  (col) => {
                    const sample = product.variants.find((v) => v.color === col);
                    return (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs tracking-wider uppercase transition-all cursor-pointer ${
                          selectedColor === col
                            ? 'border-[#162B21] bg-[#162B21] text-[#FAF8F5]'
                            : 'border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] hover:border-[#C5A059]'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20"
                          style={{ backgroundColor: sample?.colorHex || '#162B21' }}
                        />
                        <span>{col}</span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Size Options */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider text-[#1C1F1E]">
                <span className="font-semibold">Tailored Size</span>
                {currentVariant && currentVariant.stockCount > 0 && currentVariant.stockCount <= 3 && (
                  <span className="text-[#681A24] font-semibold">
                    Only {currentVariant.stockCount} in Atelier
                  </span>
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
                        className={`min-w-10 px-3 py-1.5 border text-xs tracking-wider uppercase transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'border-[#162B21] bg-[#162B21] text-[#FAF8F5]'
                            : out
                            ? 'border-[#EBE4D8] bg-[#F2EDE4]/50 text-[#525B56]/40 cursor-not-allowed line-through'
                            : 'border-[#EBE4D8] hover:border-[#C5A059] text-[#1C1F1E]'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 space-y-3">
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`w-full py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                added
                  ? 'bg-[#234233] text-[#DFC289]'
                  : isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#DFC289]" />
              <span>{added ? 'Allocated to Silk Bag ✓' : isOutOfStock ? 'Sold Out' : 'Add to Silk Bag'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onViewFullPDP(product);
              }}
              className="w-full py-2.5 text-center text-xs uppercase tracking-widest text-[#525B56] hover:text-[#162B21] underline underline-offset-4 cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <span>View Full Heritage Dossier & Zoom</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#525B56] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Certified Handcraft · Insured Express Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
  allProducts: Product[];
  currency?: string;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  currentProduct,
  allProducts,
  currency = 'INR',
  onAddToCart,
}) => {
  // Pick 2 complementary items
  const complementaryItems = allProducts
    .filter((p) => p.id !== currentProduct.id)
    .slice(0, 2);

  const bundleItems = [currentProduct, ...complementaryItems];

  const [selectedIds, setSelectedIds] = useState<string[]>([
    currentProduct.id,
    ...complementaryItems.map((p) => p.id),
  ]);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const toggleItem = (id: string) => {
    if (id === currentProduct.id) return; // Main product is always selected
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeBundle = bundleItems.filter((item) => selectedIds.includes(item.id));

  const totalRawPrice = activeBundle.reduce((sum, item) => sum + item.basePrice, 0);

  // 15% Bundle Privilege discount if 2 or more items are selected
  const hasBundleDiscount = activeBundle.length >= 2;
  const bundleDiscountPercent = hasBundleDiscount ? 15 : 0;
  const bundleDiscount = Math.round((totalRawPrice * bundleDiscountPercent) / 100);
  const finalBundlePrice = totalRawPrice - bundleDiscount;

  const handleAddBundleToCart = () => {
    activeBundle.forEach((item) => {
      const defaultSize = item.variants[0]?.size || 'Standard';
      const defaultColor = item.variants[0]?.color || 'Natural';
      onAddToCart(item, defaultSize, defaultColor, 1);
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  if (complementaryItems.length === 0) return null;

  return (
    <div className="mt-12 p-6 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs shadow-xs space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C5A059]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Atelier Ensemble Styling</span>
        </div>
        <h3 className="font-serif text-2xl text-[#162B21]">
          Frequently Curated Together
        </h3>
        <p className="text-xs text-[#525B56]">
          Pair this heirloom with harmonizing Kashmiri pure weaves & botanicals for an ensemble discount.
        </p>
      </div>

      {/* Visual Bundle Flow: Items with '+' separators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Product Images with '+' and Checkboxes */}
        <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-3 overflow-x-auto pb-2">
          {bundleItems.map((item, index) => {
            const isSelected = selectedIds.includes(item.id);
            const isMain = item.id === currentProduct.id;

            return (
              <React.Fragment key={item.id}>
                <div
                  onClick={() => toggleItem(item.id)}
                  className={`flex flex-col items-center p-3 bg-white border transition-all cursor-pointer w-48 shrink-0 rounded-xs ${
                    isSelected
                      ? 'border-[#162B21] shadow-xs'
                      : 'border-[#EBE4D8] opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="relative w-full aspect-[3/4] bg-[#F2EDE4] overflow-hidden mb-2 rounded-xs">
                    <img
                      src={item.primaryImage}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute top-2 left-2 w-5 h-5 rounded-xs flex items-center justify-center border text-[10px] ${
                        isSelected
                          ? 'bg-[#162B21] border-[#162B21] text-[#FAF8F5]'
                          : 'bg-white border-[#EBE4D8]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>

                    {isMain && (
                      <span className="absolute bottom-2 left-2 bg-[#162B21]/90 text-[#DFC289] text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-bold">
                        This Piece
                      </span>
                    )}
                  </div>

                  <p className="font-serif text-xs text-[#162B21] text-center line-clamp-1 w-full font-medium">
                    {item.name}
                  </p>
                  <span className="font-mono text-xs text-[#162B21] font-semibold mt-1">
                    {formatPrice(item.basePrice, currency)}
                  </span>
                </div>

                {index < bundleItems.length - 1 && (
                  <div className="hidden sm:flex text-[#C5A059] shrink-0">
                    <Plus className="w-5 h-5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Pricing calculation & Add All CTA (Amazon style) */}
        <div className="lg:col-span-4 p-5 bg-white border border-[#EBE4D8] rounded-xs space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between items-baseline text-xs text-[#525B56]">
              <span>Selected Pieces ({activeBundle.length}):</span>
              <span className="font-mono tabular-nums line-through">
                {formatPrice(totalRawPrice, currency)}
              </span>
            </div>

            {hasBundleDiscount && (
              <div className="flex justify-between items-baseline text-xs text-[#681A24] font-medium">
                <span>Bundle Privilege (15% Off):</span>
                <span className="font-mono tabular-nums">
                  -{formatPrice(bundleDiscount, currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-2 border-t border-[#F2EDE4]">
              <span className="font-serif text-sm font-semibold text-[#162B21]">
                Total Bundle Price:
              </span>
              <span className="font-mono text-xl font-bold text-[#162B21] tabular-nums">
                {formatPrice(finalBundlePrice, currency)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddBundleToCart}
            disabled={activeBundle.length === 0}
            className={`w-full py-3.5 px-4 text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              addedSuccess
                ? 'bg-emerald-800 text-[#FAF8F5]'
                : 'bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#DFC289]" />
            <span>
              {addedSuccess
                ? `Allocated ${activeBundle.length} Pieces to Bag ✓`
                : `Add All ${activeBundle.length} to Silk Bag`}
            </span>
          </button>

          <p className="text-[10px] text-center text-[#525B56]">
            Includes complimentary walnut presentation packaging & insured air courier.
          </p>
        </div>
      </div>
    </div>
  );
};

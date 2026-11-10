import React, { useEffect, useState } from 'react';
import { Eye, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';

interface RecentlyViewedProps {
  currentProductId?: string;
  allProducts: Product[];
  currency: string;
  onSelectProduct: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  currentProductId,
  allProducts,
  currency,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('kashida_recently_viewed');
      const recentIds: string[] = stored ? JSON.parse(stored) : [];

      // Filter out current product and map to full product objects
      const matched = recentIds
        .filter((id) => id !== currentProductId)
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => !!p)
        .slice(0, 4);

      setRecentProducts(matched);
    } catch (e) {
      console.error(e);
    }
  }, [currentProductId, allProducts]);

  if (recentProducts.length === 0) return null;

  return (
    <div className="py-12 border-t border-[#F2EDE4] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
            Personalized Curation
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#162B21]">
            Recently Explored Creations
          </h3>
        </div>
        <span className="text-xs text-[#525B56] hidden sm:inline">
          Preserved for your consideration
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {recentProducts.map((prod) => {
          const discounted = Math.round(prod.basePrice * (1 - prod.discountPercent / 100));
          return (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="group bg-[#FAF8F5] border border-[#EBE4D8] hover:border-[#C5A059] rounded-xs overflow-hidden transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-3/4 overflow-hidden bg-[#F2EDE4]">
                <img
                  src={prod.primaryImage}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#162B21]/90 text-[#DFC289] rounded-xs">
                  {prod.category}
                </span>
              </div>

              <div className="p-3.5 space-y-2">
                <div>
                  <h4 className="font-serif text-xs font-semibold text-[#162B21] line-clamp-1 group-hover:text-[#C5A059] transition-colors">
                    {prod.name}
                  </h4>
                  <p className="text-[10px] text-[#525B56] line-clamp-1">{prod.embroidery}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#EBE4D8]">
                  <span className="font-mono text-xs font-bold text-[#162B21]">
                    {formatPrice(discounted, currency)}
                  </span>
                  {onQuickAdd && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(prod);
                      }}
                      className="p-1 hover:bg-[#162B21] hover:text-[#DFC289] text-[#162B21] rounded-xs transition-colors"
                      title="Quick Add to Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

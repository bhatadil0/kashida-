import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#EBE4D8] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#F2EDE4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#C5A059] fill-[#C5A059]" />
              <h2 className="font-serif text-xl text-[#162B21]">Saved Heirlooms</h2>
              <span className="font-mono text-xs text-[#525B56]">({wishlist.length})</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#525B56] hover:text-[#1C1F1E] rounded-full cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Heart className="w-10 h-10 text-[#C5A059]/30 mx-auto" />
                <p className="font-serif text-lg text-[#162B21]">No saved pieces yet</p>
                <p className="text-xs text-[#525B56] max-w-xs mx-auto">
                  Click the heart icon on any bespoke piece to curate your private wishlist.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#F2EDE4]">
                {wishlist.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <img
                      src={item.primaryImage}
                      alt={item.name}
                      className="w-18 h-24 object-cover rounded-xs border border-[#EBE4D8] shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-sm text-[#162B21] font-medium leading-snug line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => onRemoveFromWishlist(item.id)}
                            className="text-[#525B56] hover:text-[#681A24] p-1 cursor-pointer"
                            aria-label="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] text-[#C5A059] uppercase tracking-wider mt-0.5">
                          {item.embroidery}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-mono text-sm font-semibold text-[#162B21] tabular-nums">
                          ₹{item.basePrice.toLocaleString('en-IN')}
                        </span>

                        <button
                          onClick={() => {
                            onMoveToCart(item);
                            onRemoveFromWishlist(item.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-[11px] uppercase tracking-wider font-medium cursor-pointer transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#DFC289]" />
                          <span>Move to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#F2EDE4] bg-[#FAF8F5]">
            <p className="text-xs text-[#525B56] text-center">
              Pieces reserved in wishlist remain subject to atelier fabric availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

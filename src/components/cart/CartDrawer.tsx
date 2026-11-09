import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Gift, Sparkles, Bookmark, RotateCcw } from 'lucide-react';
import { CartItem, Coupon, Product } from '../../types';
import { PROMO_COUPONS } from '../../data/products';
import { formatPrice } from '../../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency?: string;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onMoveToBag?: (product: Product, size: string, color: string, quantity: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency = 'INR',
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onMoveToBag,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isGiftPackaging, setIsGiftPackaging] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  // Amazon/Flipkart style "Save for Later"
  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kashida_saved_for_later');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('kashida_saved_for_later', JSON.stringify(savedForLater));
  }, [savedForLater]);

  const handleSaveForLater = (item: CartItem) => {
    setSavedForLater((prev) => [item, ...prev.filter((i) => i.id !== item.id)]);
    onRemoveItem(item.id);
  };

  const handleMoveBackToBag = (item: CartItem) => {
    if (onMoveToBag) {
      onMoveToBag(item.product, item.size, item.color, item.quantity);
    }
    setSavedForLater((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleRemoveSavedItem = (id: string) => {
    setSavedForLater((prev) => prev.filter((i) => i.id !== id));
  };

  if (!isOpen) return null;

  const subTotal = items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  const freeShippingThreshold = 25000;
  const progressToFreeShipping = Math.min(100, (subTotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subTotal);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (subTotal >= appliedCoupon.minSpend) {
      discountAmount = Math.round((subTotal * appliedCoupon.discountPercent) / 100);
    }
  }

  // Gift packaging is complimentary if order > 40,000 INR
  const giftPackagingFee = isGiftPackaging ? (subTotal >= 40000 ? 0 : 2500) : 0;

  const finalTotal = Math.max(0, subTotal - discountAmount + giftPackagingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponInput.trim().toUpperCase();
    const found = PROMO_COUPONS.find((c) => c.code === code);

    if (!found) {
      setCouponError('Invalid privilege code. Try KASHIDA10.');
      return;
    }

    if (subTotal < found.minSpend) {
      setCouponError(`Requires minimum order of ${formatPrice(found.minSpend, currency)}`);
      return;
    }

    onApplyCoupon(found);
    setCouponSuccess(`Applied: ${found.discountPercent}% privilege!`);
    setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#EBE4D8] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#F2EDE4] bg-[#FAF8F5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
                <h2 className="font-serif text-xl text-[#162B21]">Your Silk Bag</h2>
                <span className="font-mono text-xs text-[#525B56] tabular-nums">
                  ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-[#525B56] hover:text-[#1C1F1E] rounded-full cursor-pointer"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="mt-4 pt-3 border-t border-[#F2EDE4] space-y-1.5">
              <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-[#162B21]">
                <span>
                  {progressToFreeShipping >= 100
                    ? '🎉 Complimentary Global Express Unlocked!'
                    : `Add ${formatPrice(remainingForFreeShipping, currency)} for Free Global Express`}
                </span>
                <span className="font-mono">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full bg-[#EBE4D8] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#162B21] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-[#C5A059]/40 mx-auto" />
                <p className="font-serif text-lg text-[#162B21]">Your silk bag is empty</p>
                <p className="text-xs text-[#525B56] max-w-xs mx-auto">
                  Explore our handcrafted pherans, raw silk kurtas, and pure Changthangi Pashmina.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Explore Curations
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#F2EDE4]">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <img
                      src={item.product.primaryImage}
                      alt={item.product.name}
                      className="w-18 h-24 object-cover rounded-xs border border-[#EBE4D8] shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-sm text-[#162B21] font-medium leading-snug line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#525B56] hover:text-[#681A24] p-1 cursor-pointer transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-[#525B56] mt-1">
                          <span>Size: <strong>{item.size}</strong></span>
                          <span aria-hidden="true">·</span>
                          <span>Color: <strong>{item.color}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#EBE4D8] bg-[#FAF8F5]">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-[#1C1F1E] hover:bg-[#F2EDE4] cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-mono tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-[#1C1F1E] hover:bg-[#F2EDE4] cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Subtotal & Save for Later */}
                        <div className="text-right">
                          <span className="font-mono text-sm font-semibold text-[#162B21] tabular-nums block">
                            {formatPrice(item.unitPrice * item.quantity, currency)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSaveForLater(item)}
                            className="inline-flex items-center gap-1 text-[10px] text-[#C5A059] hover:text-[#162B21] cursor-pointer mt-0.5"
                          >
                            <Bookmark className="w-2.5 h-2.5" />
                            <span>Save for later</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Gift Keepsake Packaging Option */}
                <div className="pt-4 pb-2 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={isGiftPackaging}
                      onChange={(e) => setIsGiftPackaging(e.target.checked)}
                      className="mt-0.5 accent-[#162B21]"
                    />
                    <div>
                      <span className="font-semibold text-[#162B21] flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Artisanal Walnut Keepsake Box & Saffron Card</span>
                      </span>
                      <p className="text-[11px] text-[#525B56]">
                        {subTotal >= 40000
                          ? 'Complimentary with your royal order (Valued at ₹2,500)'
                          : `Includes hand-carved Chinar wooden chest + handwritten Urdu calligraphy card (+${formatPrice(2500, currency)})`}
                      </p>
                    </div>
                  </label>

                  {isGiftPackaging && (
                    <input
                      type="text"
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Inscription: 'With deepest honor for Lady Soraya...'"
                      className="w-full text-xs p-2 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Amazon/Flipkart-style "Saved for Later" Shelf */}
            {savedForLater.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#EBE4D8] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#C5A059]" />
                    <h3 className="font-serif text-sm font-semibold text-[#162B21]">
                      Saved for Later ({savedForLater.length})
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#525B56]">
                    Ready when you wish to reserve
                  </span>
                </div>

                <div className="space-y-3">
                  {savedForLater.map((savedItem) => (
                    <div
                      key={savedItem.id}
                      className="p-3 bg-white border border-[#EBE4D8] rounded-xs flex gap-3 items-center justify-between shadow-2xs"
                    >
                      <img
                        src={savedItem.product.primaryImage}
                        alt={savedItem.product.name}
                        className="w-12 h-16 object-cover rounded-xs border border-[#EBE4D8] shrink-0"
                      />

                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="font-serif text-xs text-[#162B21] font-semibold truncate">
                          {savedItem.product.name}
                        </h4>
                        <p className="text-[10px] text-[#525B56]">
                          Size: {savedItem.size} · Color: {savedItem.color}
                        </p>
                        <p className="font-mono text-xs font-semibold text-[#162B21] mt-0.5">
                          {formatPrice(savedItem.unitPrice, currency)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveBackToBag(savedItem)}
                          className="px-2.5 py-1 bg-[#162B21] text-[#FAF8F5] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer"
                        >
                          Move to Bag
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSavedItem(savedItem.id)}
                          className="text-[10px] text-[#681A24] hover:underline text-center cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#F2EDE4] bg-[#FAF8F5] space-y-4">
              {/* Coupon Redemption Input */}
              <div className="space-y-1.5">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Privilege Code (e.g. KASHIDA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs uppercase tracking-wider text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F2EDE4] hover:bg-[#EBE4D8] text-[#162B21] text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {couponError && (
                  <p className="text-[11px] text-[#681A24]">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-[11px] text-[#162B21] font-semibold">{couponSuccess}</p>
                )}
                {appliedCoupon && !couponSuccess && (
                  <div className="flex justify-between items-center text-xs text-[#162B21] bg-[#162B21]/5 p-2 rounded-xs">
                    <span>Active: <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercent}%)</span>
                    <button
                      onClick={() => onApplyCoupon(null)}
                      className="text-[10px] text-[#681A24] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-[#525B56] pt-2 border-t border-[#F2EDE4]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#1C1F1E] tabular-nums">
                    {formatPrice(subTotal, currency)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#681A24] font-medium">
                    <span>Artisan Privilege ({appliedCoupon?.code})</span>
                    <span className="font-mono tabular-nums">
                      -{formatPrice(discountAmount, currency)}
                    </span>
                  </div>
                )}

                {isGiftPackaging && (
                  <div className="flex justify-between text-[#162B21]">
                    <span>Walnut Keepsake Packaging</span>
                    <span className="font-mono">
                      {giftPackagingFee === 0 ? 'Complimentary' : formatPrice(giftPackagingFee, currency)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Global Shipping</span>
                  <span className="text-[#162B21] font-medium">
                    {subTotal >= freeShippingThreshold ? 'Complimentary' : formatPrice(1500, currency)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold text-[#162B21] pt-2 border-t border-[#F2EDE4]">
                  <span className="font-serif">Total Payable</span>
                  <span className="font-mono tabular-nums">
                    {formatPrice(finalTotal, currency)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#DFC289]" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#525B56]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>256-bit Encrypted · Razorpay Test Verification</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

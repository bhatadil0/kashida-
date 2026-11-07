import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { CartItem, Coupon } from '../../types';
import { PROMO_COUPONS } from '../../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

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

  const finalTotal = Math.max(0, subTotal - discountAmount);

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
      setCouponError(`Requires minimum order of ₹${found.minSpend.toLocaleString('en-IN')}`);
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
                    : `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} for Free Global Express`}
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

                        {/* Line Subtotal */}
                        <span className="font-mono text-sm font-semibold text-[#162B21] tabular-nums">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                    ₹{subTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#681A24] font-medium">
                    <span>Artisan Privilege ({appliedCoupon?.code})</span>
                    <span className="font-mono tabular-nums">
                      -₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Global Shipping</span>
                  <span className="text-[#162B21] font-medium">
                    {subTotal >= freeShippingThreshold ? 'Complimentary' : '₹1,500'}
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold text-[#162B21] pt-2 border-t border-[#F2EDE4]">
                  <span className="font-serif">Total Payable</span>
                  <span className="font-mono tabular-nums">
                    ₹{finalTotal.toLocaleString('en-IN')}
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

import React, { useState } from 'react';
import { Tag, CreditCard, Gift, Percent, ChevronRight, X, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../../utils/currency';

interface BankOffersWidgetProps {
  basePrice: number;
  currency?: string;
}

export const BankOffersWidget: React.FC<BankOffersWidgetProps> = ({
  basePrice,
  currency = 'INR',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // EMI calculation: basePrice / 12 months approximate
  const emiPerMonth = Math.round(basePrice / 12);
  const cardDiscount = Math.min(4000, Math.round(basePrice * 0.1));

  return (
    <>
      <div className="p-4 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#C5A059]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#162B21]">
              Privilege & Bank Offers
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-[11px] font-semibold text-[#C5A059] hover:text-[#162B21] flex items-center gap-0.5 cursor-pointer underline"
          >
            <span>View 4 Offers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2 Primary Offer Callouts (Amazon/Flipkart style) */}
        <div className="space-y-2 text-xs">
          {/* Bank Offer */}
          <div className="p-2.5 bg-white border border-[#EBE4D8] rounded-xs flex items-start gap-2.5">
            <CreditCard className="w-4 h-4 text-[#162B21] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-[#162B21]">
                Instant 10% Discount up to {formatPrice(4000, currency)}
              </p>
              <p className="text-[11px] text-[#525B56]">
                Applicable on HDFC, ICICI & Amex Credit Cards on orders above {formatPrice(20000, currency)}.
              </p>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 shrink-0">
              Save {formatPrice(cardDiscount, currency)}
            </span>
          </div>

          {/* EMI Offer */}
          <div className="p-2.5 bg-white border border-[#EBE4D8] rounded-xs flex items-start gap-2.5">
            <Percent className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-[#162B21]">
                No Cost EMI from {formatPrice(emiPerMonth, currency)}/month
              </p>
              <p className="text-[11px] text-[#525B56]">
                3, 6, 9, or 12 months tenure with 0% interest on major credit cards.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-[10px] font-semibold text-[#162B21] hover:underline cursor-pointer shrink-0 mt-0.5"
            >
              Plans →
            </button>
          </div>
        </div>
      </div>

      {/* Modal with Full Terms & Conditions */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF8F5] border border-[#EBE4D8] w-full max-w-lg shadow-2xl rounded-xs overflow-hidden">
            <div className="p-5 border-b border-[#EBE4D8] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif text-lg text-[#162B21]">
                  Available Privileges & Bank Offers
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#525B56] hover:text-[#162B21] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 text-xs">
              {/* Offer 1 */}
              <div className="p-3 bg-white border border-[#EBE4D8] rounded-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#162B21] flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#C5A059]" />
                    Bank Card Instant Rebate
                  </span>
                  <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 font-bold">
                    10% Off
                  </span>
                </div>
                <p className="text-[#525B56]">
                  Get 10% instant rebate up to {formatPrice(4000, currency)} on HDFC Bank, ICICI Bank, and American Express credit cards at checkout.
                </p>
                <p className="text-[10px] text-[#525B56]/70">Min. cart value {formatPrice(20000, currency)}. Valid till month end.</p>
              </div>

              {/* Offer 2 */}
              <div className="p-3 bg-white border border-[#EBE4D8] rounded-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#162B21] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                    Atelier Welcome Privilege
                  </span>
                  <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 font-bold">
                    Code: KASHIDA10
                  </span>
                </div>
                <p className="text-[#525B56]">
                  Use promo code <strong>KASHIDA10</strong> during checkout to receive an automatic 10% privilege discount on all handloom orders.
                </p>
              </div>

              {/* Offer 3 */}
              <div className="p-3 bg-white border border-[#EBE4D8] rounded-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#162B21] flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-[#C5A059]" />
                    No-Cost EMI Instalments
                  </span>
                  <span className="font-mono text-[#162B21] font-bold">
                    From {formatPrice(emiPerMonth, currency)}/mo
                  </span>
                </div>
                <p className="text-[#525B56]">
                  Pay over 3, 6, 9 or 12 months with zero interest charges. Available with HDFC, ICICI, Axis, SBI, and Kotak Mahindra credit cards.
                </p>
              </div>

              {/* Offer 4 */}
              <div className="p-3 bg-white border border-[#EBE4D8] rounded-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#162B21] flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-[#C5A059]" />
                    Handcrafted Walnut Chest Gift
                  </span>
                  <span className="font-mono text-amber-800 bg-amber-50 px-2 py-0.5 font-bold">
                    Value: ₹2,500
                  </span>
                </div>
                <p className="text-[#525B56]">
                  Complimentary carved walnut keepsake presentation box and handwritten saffron calligraphy scroll with all commissions over {formatPrice(40000, currency)}.
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#162B21]/5 text-[11px] text-[#162B21] rounded-xs">
                <ShieldCheck className="w-4 h-4 text-[#162B21] shrink-0" />
                <span>All bank offers are auto-computed and deducted transparently at payment step.</span>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-[#EBE4D8] text-right">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

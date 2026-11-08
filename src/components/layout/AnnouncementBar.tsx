import React from 'react';
import { Sparkles, ShieldCheck, Globe, Truck } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../../utils/currency';

interface AnnouncementBarProps {
  onOpenPromo?: () => void;
  onOpenTrackOrder?: () => void;
  currency?: string;
  onSelectCurrency?: (code: string) => void;
  text?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  onOpenPromo,
  onOpenTrackOrder,
  currency = 'INR',
  onSelectCurrency,
  text,
}) => {
  return (
    <div className="bg-[#162B21] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#C5A059]/30 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Left: GI Provenance Assurance */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#DFC289] shrink-0" />
          <span className="tracking-wide text-[11px] sm:text-xs">
            {text || 'Authentic GI-Certified Kashmiri Cashmere & Hand-Embroidered Tilla Couture'}
          </span>
        </div>

        {/* Right: Actions, Tracking, Promo, and Currency Selector */}
        <div className="flex items-center gap-3 text-[11px] sm:text-xs tracking-wider">
          {onOpenTrackOrder && (
            <button
              onClick={onOpenTrackOrder}
              className="hidden lg:inline-flex items-center gap-1 text-[#FAF8F5]/80 hover:text-[#DFC289] transition-colors cursor-pointer"
            >
              <Truck className="w-3 h-3 text-[#DFC289]" />
              <span>Track Commission</span>
            </button>
          )}

          <span className="hidden lg:inline text-[#C5A059]/40">|</span>

          <button
            onClick={onOpenPromo}
            className="text-[#FAF8F5] hover:text-[#DFC289] underline underline-offset-4 decoration-[#C5A059]/60 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
          >
            <Sparkles className="w-3 h-3 text-[#DFC289]" />
            <span>Code KASHIDA10: 10% Privilege</span>
          </button>

          {onSelectCurrency && (
            <>
              <span className="text-[#C5A059]/40">|</span>
              <div className="inline-flex items-center gap-1 text-[11px] text-[#FAF8F5]/90">
                <Globe className="w-3 h-3 text-[#DFC289]" />
                <select
                  value={currency}
                  onChange={(e) => onSelectCurrency(e.target.value)}
                  className="bg-[#162B21] text-[#FAF8F5] text-[11px] font-medium outline-none cursor-pointer border border-[#C5A059]/30 px-1.5 py-0.5 rounded-xs"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#162B21] text-[#FAF8F5]">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

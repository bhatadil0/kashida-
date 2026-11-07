import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenPromo?: () => void;
  text?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenPromo, text }) => {
  return (
    <div className="bg-[#162B21] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#C5A059]/30 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#DFC289] shrink-0" />
          <span className="tracking-wide text-[11px] sm:text-xs">
            {text || 'Authentic GI-Certified Kashmiri Cashmere & Hand-Embroidered Tilla Couture'}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-[11px] sm:text-xs tracking-wider">
          <span className="text-[#DFC289] hidden md:inline">
            Complimentary Insured Worldwide Shipping Above ₹25,000
          </span>
          <span className="hidden md:inline text-[#C5A059]/40">|</span>
          <button
            onClick={onOpenPromo}
            className="text-[#FAF8F5] hover:text-[#DFC289] underline underline-offset-4 decoration-[#C5A059]/60 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
          >
            <Sparkles className="w-3 h-3 text-[#DFC289]" />
            Use Code KASHIDA10 For 10% Off
          </button>
        </div>
      </div>
    </div>
  );
};

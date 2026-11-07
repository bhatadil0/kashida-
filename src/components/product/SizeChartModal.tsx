import React, { useState } from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  // Measurements table for luxury traditional Kashmiri silhouettes (relaxed elegance)
  const sizeData = [
    {
      size: 'XS',
      chestInches: '36 - 38',
      chestCm: '91 - 96',
      shoulderInches: '14.5',
      shoulderCm: '37',
      lengthInches: '44',
      lengthCm: '112',
      sleeveInches: '22',
      sleeveCm: '56',
    },
    {
      size: 'S',
      chestInches: '39 - 41',
      chestCm: '99 - 104',
      shoulderInches: '15.0',
      shoulderCm: '38',
      lengthInches: '45',
      lengthCm: '114',
      sleeveInches: '22.5',
      sleeveCm: '57',
    },
    {
      size: 'M',
      chestInches: '42 - 44',
      chestCm: '107 - 112',
      shoulderInches: '15.5',
      shoulderCm: '39.5',
      lengthInches: '46',
      lengthCm: '117',
      sleeveInches: '23',
      sleeveCm: '58.5',
    },
    {
      size: 'L',
      chestInches: '45 - 47',
      chestCm: '114 - 119',
      shoulderInches: '16.0',
      shoulderCm: '41',
      lengthInches: '46.5',
      lengthCm: '118',
      sleeveInches: '23.5',
      sleeveCm: '60',
    },
    {
      size: 'XL',
      chestInches: '48 - 50',
      chestCm: '122 - 127',
      shoulderInches: '16.5',
      shoulderCm: '42',
      lengthInches: '47',
      lengthCm: '119',
      sleeveInches: '24',
      sleeveCm: '61',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl p-6 sm:p-8 overflow-hidden rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#525B56] hover:text-[#1C1F1E] cursor-pointer"
          aria-label="Close size guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              Heritage Atelier Sizing Matrix
            </span>
          </div>

          <h3 className="font-serif text-2xl text-[#162B21]">
            Fit & Dimensions for Kashmiri {category.toUpperCase()}
          </h3>

          <p className="text-xs text-[#525B56] leading-relaxed">
            Traditional Kashmiri pherans and kurtas are designed with a majestic, unconstrained drape to allow graceful layering. For a more tailored silhouette, we suggest selecting your exact chest size; for traditional royal drape, select one size up.
          </p>

          {/* Unit Toggle */}
          <div className="flex justify-end pt-2">
            <div className="inline-flex p-0.5 bg-[#F2EDE4] rounded-sm text-xs">
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 font-medium transition-colors cursor-pointer rounded-xs ${
                  unit === 'inches'
                    ? 'bg-[#162B21] text-[#FAF8F5]'
                    : 'text-[#525B56] hover:text-[#162B21]'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 font-medium transition-colors cursor-pointer rounded-xs ${
                  unit === 'cm'
                    ? 'bg-[#162B21] text-[#FAF8F5]'
                    : 'text-[#525B56] hover:text-[#162B21]'
                }`}
              >
                Centimetres
              </button>
            </div>
          </div>

          {/* Sizing Table */}
          <div className="overflow-x-auto border border-[#EBE4D8]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F2EDE4]/80 text-[#162B21] uppercase tracking-wider font-semibold border-b border-[#EBE4D8]">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Garment Chest ({unit})</th>
                  <th className="py-2.5 px-3">Shoulder ({unit})</th>
                  <th className="py-2.5 px-3">Garment Length ({unit})</th>
                  <th className="py-2.5 px-3">Sleeve ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE4D8] font-mono tabular-nums text-[#1C1F1E]">
                {sizeData.map((row) => (
                  <tr key={row.size} className="hover:bg-[#F2EDE4]/30">
                    <td className="py-2.5 px-3 font-semibold text-[#162B21]">{row.size}</td>
                    <td className="py-2.5 px-3">
                      {unit === 'inches' ? row.chestInches : row.chestCm}
                    </td>
                    <td className="py-2.5 px-3">
                      {unit === 'inches' ? row.shoulderInches : row.shoulderCm}
                    </td>
                    <td className="py-2.5 px-3">
                      {unit === 'inches' ? row.lengthInches : row.lengthCm}
                    </td>
                    <td className="py-2.5 px-3">
                      {unit === 'inches' ? row.sleeveInches : row.sleeveCm}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bespoke Tailoring Note */}
          <div className="p-3.5 bg-[#162B21]/5 border border-[#C5A059]/30 rounded-xs flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <p className="text-xs text-[#162B21]">
              <strong>Complimentary Bespoke Customization:</strong> Prefer bespoke neck drops or custom sleeve lengths? After placing your order, your dedicated atelier manager contacts you via WhatsApp/Email to verify individual measurements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

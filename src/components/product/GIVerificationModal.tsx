import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  CheckCircle2,
  Search,
  Sparkles,
  FileText,
  BadgeCheck,
  ExternalLink,
} from 'lucide-react';

interface GIVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
}

export const GIVerificationModal: React.FC<GIVerificationModalProps> = ({
  isOpen,
  onClose,
  productTitle = 'Kashmiri Handcrafted Couture',
}) => {
  const [chipInput, setChipInput] = useState('GI-JK-0492-2026');
  const [verifiedResult, setVerifiedResult] = useState<any>({
    registrationNumber: 'GI-JK-0492-2026',
    artisanGuild: 'Downtown Srinagar Master Guild #14 (Ustad Bashir Ahmad)',
    productClass: 'Class 24 (Kashmir Pashmina & Velvet Couture)',
    provenanceOrigin: 'Srinagar Valley & Changthang Plateau, Ladakh (14,000+ ft)',
    fiberPurity: '100% Raw Changthangi Goat (Capra Hircus) Under-Fleece',
    finenessMicrons: '12.8 µm (Grade A Superfine Cashmere)',
    metallicsPurity: '98.5% Silver Wire with 24K Pure Gold Wash (Authentic Tilla)',
    handloomType: 'Traditional 4-Pedal Charkha & Pitloom',
    certificationBody: 'Craft Development Institute (CDI) / Tahafuz Quality Testing Center, Srinagar',
    issuanceDate: 'October 12, 2026',
    status: 'ACTIVE & REGISTERED WITH GOVT OF INDIA GI REGISTRY',
  });

  if (!isOpen) return null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate lookup
    setVerifiedResult({
      registrationNumber: chipInput.toUpperCase(),
      artisanGuild: 'Srinagar Old City Artisan Guild #09',
      productClass: 'Class 24 & 25 (Luxury Kashmiri Handcrafts)',
      provenanceOrigin: 'Kashmir Valley & Ladakh Foothills',
      fiberPurity: '100% Genuine Certified Natural Fiber',
      finenessMicrons: '13.2 µm (Luxury Grade A)',
      metallicsPurity: 'Pure Metallic Zari with 24k Gold Wash',
      handloomType: 'Authentic Kashmiri Hand-Needle Needlepoint',
      certificationBody: 'Tahafuz GI Enforcement Cell, Srinagar',
      issuanceDate: 'Valid for Lifetime Heirloom Dossier',
      status: 'AUTHENTICATED',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-3xl bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#162B21] text-[#FAF8F5] flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#DFC289]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg tracking-wide text-[#FAF8F5]">
                Geographical Indication (GI) Provenance Registry
              </h3>
              <p className="text-xs text-[#FAF8F5]/70">
                Official Validation & Micro-chip Certificate for {productTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#FAF8F5]/70 hover:text-[#FAF8F5] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Strip */}
        <div className="p-4 bg-white border-b border-[#EBE4D8]">
          <form onSubmit={handleLookup} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#525B56] absolute left-3 top-3" />
              <input
                type="text"
                value={chipInput}
                onChange={(e) => setChipInput(e.target.value)}
                placeholder="Scan or enter GI Certificate Code (e.g. GI-JK-0492-2026)..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F5] border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21] font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer"
            >
              Verify Chip
            </button>
          </form>
        </div>

        {/* Certificate Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Certificate Dossier Card */}
          <div className="border-2 border-[#C5A059] bg-white p-6 relative space-y-6 shadow-sm">
            {/* Top Seal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE4D8] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block">
                  GOVERNMENT OF JAMMU & KASHMIR · GI REGISTRY
                </span>
                <h4 className="font-serif text-xl text-[#162B21]">
                  Certificate of Authentic Origin & Artisan Purity
                </h4>
                <p className="text-xs text-[#525B56]">
                  Registered under the Geographical Indications of Goods Act, 1999
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  AUTHENTICATED GI SEAL
                </span>
                <p className="font-mono text-[11px] text-[#525B56] mt-1">
                  Tag: {verifiedResult.registrationNumber}
                </p>
              </div>
            </div>

            {/* Scientific Parameters Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#525B56] font-semibold block">
                  Artisan Guild & Provenance
                </span>
                <p className="font-semibold text-[#162B21]">{verifiedResult.artisanGuild}</p>
                <p className="text-[#525B56] text-[11px]">{verifiedResult.provenanceOrigin}</p>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#525B56] font-semibold block">
                  Fiber Microscopy Fineness
                </span>
                <p className="font-semibold text-[#162B21]">{verifiedResult.finenessMicrons}</p>
                <p className="text-[#525B56] text-[11px]">{verifiedResult.fiberPurity}</p>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#525B56] font-semibold block">
                  Tilla Metallic Zari Assay
                </span>
                <p className="font-semibold text-[#162B21]">{verifiedResult.metallicsPurity}</p>
                <p className="text-[#525B56] text-[11px]">Non-tarnishable electroplated 24K gold foil</p>
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#525B56] font-semibold block">
                  Testing Laboratory & Seal
                </span>
                <p className="font-semibold text-[#162B21]">{verifiedResult.certificationBody}</p>
                <p className="text-[#525B56] text-[11px]">Issued: {verifiedResult.issuanceDate}</p>
              </div>
            </div>

            {/* Why GI Matters Explainer */}
            <div className="p-4 bg-[#162B21] text-[#FAF8F5] text-xs space-y-2 rounded-xs">
              <div className="flex items-center gap-2 text-[#DFC289] font-serif">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-semibold">The GI Protection Guarantee</span>
              </div>
              <p className="text-[#FAF8F5]/80 leading-relaxed text-[11px]">
                Over 70% of shawls sold globally as &ldquo;Pashmina&rdquo; are synthetic or blended with machine polyester. A true Geographical Indication (GI) tag guarantees that your piece is spun by hand on a traditional wooden charkha (yender) and hand-woven on four-pedal looms exclusively in the Kashmir Valley.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

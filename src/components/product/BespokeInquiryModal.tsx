import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Scissors,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  Send,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { Product } from '../../types';

interface BespokeInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export const BespokeInquiryModal: React.FC<BespokeInquiryModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [patronName, setPatronName] = useState('');
  const [patronEmail, setPatronEmail] = useState('');
  const [patronPhone, setPatronPhone] = useState('');
  const [silhouette, setSilhouette] = useState(product ? product.name : 'Velvet Court Pheran');
  const [fabricPreference, setFabricPreference] = useState('Pure Mulberry Silk Velvet (Emerald Forest)');
  const [needleworkStyle, setNeedleworkStyle] = useState('Antique Gold Tilla (24k Gold Wash)');
  const [monogram, setMonogram] = useState('');
  const [notes, setNotes] = useState('');
  const [consultationType, setConsultationType] = useState<'video' | 'whatsapp' | 'atelier'>('video');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#162B21] text-[#FAF8F5] flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#DFC289]">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg tracking-wide text-[#FAF8F5]">
                Commission Bespoke Kashmiri Couture
              </h3>
              <p className="text-xs text-[#FAF8F5]/70">
                Custom Tailoring, Neckline Engineering & Bridal Monogramming
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border-2 border-emerald-300">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-serif text-2xl text-[#162B21]">
                Bespoke Commission Dossier Received
              </h4>
              <p className="text-xs text-[#525B56] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{patronName}</strong>. Master Ustad Bashir Ahmad and our Srinagar atelier concierge will reach out to you within 24 hours at <strong>{patronPhone || patronEmail}</strong> to schedule your private design consultation.
              </p>
              <div className="p-4 bg-[#F2EDE4] border border-[#EBE4D8] text-xs text-[#162B21] max-w-sm mx-auto">
                <p className="font-mono font-bold">Commission Request Reference: BESPOKE-{Date.now().toString().slice(-6)}</p>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer"
              >
                Return to Collections
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    Patron Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patronName}
                    onChange={(e) => setPatronName(e.target.value)}
                    placeholder="Begum / Princess / Lady / Mr."
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={patronEmail}
                    onChange={(e) => setPatronEmail(e.target.value)}
                    placeholder="patron@royaldomain.com"
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    WhatsApp / Phone (With Country Code) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patronPhone}
                    onChange={(e) => setPatronPhone(e.target.value)}
                    placeholder="+91 98112 34567 or +44 20..."
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    Desired Silhouette
                  </label>
                  <input
                    type="text"
                    value={silhouette}
                    onChange={(e) => setSilhouette(e.target.value)}
                    placeholder="e.g. Royal Silk Velvet Pheran, Bridal Kurta"
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    Fabric & Hue Preference
                  </label>
                  <select
                    value={fabricPreference}
                    onChange={(e) => setFabricPreference(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                  >
                    <option value="Pure Mulberry Silk Velvet (Emerald Forest)">Pure Mulberry Silk Velvet (Emerald Forest)</option>
                    <option value="Pure Mulberry Silk Velvet (Midnight Black)">Pure Mulberry Silk Velvet (Midnight Black)</option>
                    <option value="Pure Mulberry Silk Velvet (Royal Ruby)">Pure Mulberry Silk Velvet (Royal Ruby)</option>
                    <option value="GI Changthangi Pashmina Twill (Warm Ivory)">GI Changthangi Pashmina Twill (Warm Ivory)</option>
                    <option value="Raw Chanderi Silk (Oatmeal Beige)">Raw Chanderi Silk (Oatmeal Beige)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    Needlework & Metallic Thread Style
                  </label>
                  <select
                    value={needleworkStyle}
                    onChange={(e) => setNeedleworkStyle(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                  >
                    <option value="Antique Gold Tilla (24k Gold Wash)">Antique Gold Tilla (24k Gold Wash)</option>
                    <option value="Pure Silver Zari (Shimmering Silver)">Pure Silver Zari (Shimmering Silver)</option>
                    <option value="Sozni Fine Needlepoint (Silk Thread Multihue)">Sozni Fine Needlepoint (Silk Thread Multihue)</option>
                    <option value="Aari Chain Stitch Floral Motif">Aari Chain Stitch Floral Motif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    Embroidered Heirloom Monogram (Optional)
                  </label>
                  <input
                    type="text"
                    value={monogram}
                    onChange={(e) => setMonogram(e.target.value)}
                    placeholder="e.g. S.B. or Urdu Nastaliq initials inside collar"
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    Consultation Medium
                  </label>
                  <select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                  >
                    <option value="video">Private Google Meet / FaceTime Video</option>
                    <option value="whatsapp">Dedicated WhatsApp Concierge</option>
                    <option value="atelier">In-Person Appointment at Srinagar Atelier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                  Specific Measurements or Occasion Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about the upcoming wedding date, desired length adjustments, or specific motifs..."
                  className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21] resize-none"
                />
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#EBE4D8] flex items-center gap-2 text-[#525B56]">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="text-[11px]">
                  All bespoke commissions are crafted one-at-a-time in Srinagar by master artisans. Lead time typically 3 to 5 weeks with insured international courier delivery.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-[#EBE4D8] text-[#525B56] hover:text-[#162B21] text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer inline-flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-[#DFC289]" />
                  <span>Transmit Commission Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

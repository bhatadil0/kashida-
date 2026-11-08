import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface ConciergeCareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBespoke?: () => void;
}

export const ConciergeCareModal: React.FC<ConciergeCareModalProps> = ({
  isOpen,
  onClose,
  onOpenBespoke,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How should I preserve and store pure 24k Gold Tilla and Silk Velvet?',
      a: 'Silk velvet and metallic Tilla should always be stored flat or gently rolled in unbleached pure cotton muslin. Never hang velvet on metal wire hangers as it marks the pile. Avoid applying direct perfume, attar, or hairsprays onto the metallic zari. When cleaning is required, entrust solely to dry cleaners specializing in heritage couture.',
    },
    {
      q: 'How can I verify the authenticity of my GI-Certified Pashmina?',
      a: 'Every Pashmina shawl from Kāshida Couture bears a certified Geographical Indication (GI) microchip code and laboratory assay certificate from the Craft Development Institute (CDI) in Srinagar. You can verify your unique chip number on our site anytime to view the 100% Capra Hircus cashmere purity test (12.5–14.5 microns).',
    },
    {
      q: 'What are your worldwide shipping and customs clearance policies?',
      a: 'We offer complimentary insured DHL Air Express shipping on all commissions worldwide above ₹25,000 (approx $295 / £230). All customs duties and white-glove transport insurance are fully covered by Kāshida Couture so your heirloom arrives with zero unexpected tariffs.',
    },
    {
      q: 'What if I need custom sleeve length or bust alterations after receiving my piece?',
      a: 'All our pherans and kurtas are constructed with traditional generous seam margins (3 inches of hidden silk inlay). If your garment requires adjustment, you can return it to our Srinagar atelier or London concierge salon for complimentary master tailoring adjustments within 30 days.',
    },
    {
      q: 'Can I commission a bridal trousseau or custom family heirloom set?',
      a: 'Yes. Our Master Ustad Bashir Ahmad personally oversees bespoke commissions for royal gala events and weddings. We prepare customized watercolor sketches, dye custom silk velvets, and hand-embroider personalized Urdu or English initials.',
    },
  ];

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
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg tracking-wide text-[#FAF8F5]">
                Atelier Concierge & Textile Care
              </h3>
              <p className="text-xs text-[#FAF8F5]/70">
                Direct White-Glove Support, Preservation Guidelines & FAQ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#FAF8F5]/70 hover:text-[#FAF8F5] cursor-pointer"
            aria-label="Close concierge"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-white border border-[#EBE4D8] space-y-2 text-xs">
              <PhoneCall className="w-4 h-4 text-[#C5A059]" />
              <h5 className="font-serif font-semibold text-[#162B21]">VIP Telephone Desk</h5>
              <p className="text-[#525B56] leading-tight">+91 194 245 8899</p>
              <p className="text-[10px] text-[#525B56]/70">Mon–Sat, 10 AM – 8 PM IST</p>
            </div>

            <div className="p-4 bg-white border border-[#EBE4D8] space-y-2 text-xs">
              <Mail className="w-4 h-4 text-[#C5A059]" />
              <h5 className="font-serif font-semibold text-[#162B21]">Curator Inquiries</h5>
              <p className="text-[#525B56] leading-tight">curator@kashida-couture.com</p>
              <p className="text-[10px] text-[#525B56]/70">Guaranteed 4-hour response</p>
            </div>

            <div className="p-4 bg-white border border-[#EBE4D8] space-y-2 text-xs">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <h5 className="font-serif font-semibold text-[#162B21]">Srinagar Atelier</h5>
              <p className="text-[#525B56] leading-tight">Downtown Heritage Enclave, Srinagar 190001</p>
              <p className="text-[10px] text-[#525B56]/70">By appointment only</p>
            </div>
          </div>

          {/* Heritage FAQ Accordion */}
          <div className="space-y-3">
            <h4 className="font-serif text-base text-[#162B21] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#C5A059]" />
              <span>Frequently Addressed Curations & Care</span>
            </h4>

            <div className="divide-y divide-[#EBE4D8] border border-[#EBE4D8] bg-white">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-[#162B21] hover:text-[#C5A059] transition-colors cursor-pointer gap-4"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#525B56] shrink-0 transition-transform ${
                        openFaq === idx ? 'rotate-180 text-[#C5A059]' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <p className="text-xs text-[#525B56] mt-2.5 leading-relaxed pt-2 border-t border-[#F2EDE4]">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bespoke Inquiry CTA Banner */}
          <div className="p-5 bg-[#162B21] text-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xs">
            <div>
              <h4 className="font-serif text-base text-[#FAF8F5]">Commission a Custom Heirloom</h4>
              <p className="text-xs text-[#FAF8F5]/80">
                Work directly with master needleworkers for tailored pherans, monogramming, and bridal shawls.
              </p>
            </div>
            {onOpenBespoke && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBespoke();
                }}
                className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#DFC289] text-[#162B21] text-xs uppercase tracking-wider font-semibold cursor-pointer shrink-0 transition-colors"
              >
                Start Bespoke Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

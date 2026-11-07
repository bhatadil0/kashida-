import React, { useState } from 'react';
import { Mail, Check, ShieldCheck } from 'lucide-react';
import { ProductCategory } from '../../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onExploreHeritage: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onExploreHeritage,
  onOpenAdmin,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#162B21] text-[#FAF8F5] border-t border-[#C5A059]/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand & Atelier Provenance (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <span className="font-serif text-2xl tracking-[0.2em] uppercase text-[#FAF8F5] block">
                Kāshida
              </span>
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#DFC289] block font-medium">
                Haute Artisanat Du Kashmir
              </span>
            </div>

            <p className="text-xs text-[#FAF8F5]/75 leading-relaxed max-w-sm">
              Honoring four centuries of Kashmiri needlecraft, pure Changthangi Pashmina weaving, and 24k gold wash Tilla embroidery. Every piece is commissioned to order, directly sustaining artisan families across the valley.
            </p>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-[#DFC289]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Certified Geographical Indication (GI) Registered Atelier</span>
            </div>
          </div>

          {/* Column 2: Curated Silhouettes (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#DFC289]">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/80">
              <li>
                <button
                  onClick={() => onSelectCategory('pherans')}
                  className="hover:text-[#DFC289] transition-colors cursor-pointer"
                >
                  Velvet Pherans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('pashmina')}
                  className="hover:text-[#DFC289] transition-colors cursor-pointer"
                >
                  GI Pashmina Shawls
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('kurtas')}
                  className="hover:text-[#DFC289] transition-colors cursor-pointer"
                >
                  Raw Silk Kurtas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('stoles')}
                  className="hover:text-[#DFC289] transition-colors cursor-pointer"
                >
                  Woven Silk Stoles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cosmetics')}
                  className="hover:text-[#DFC289] transition-colors cursor-pointer"
                >
                  Pampore Saffron Elixirs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: The Craft & Concierge (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#DFC289]">
              The Atelier
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/80">
              <li>
                <button
                  onClick={onExploreHeritage}
                  className="hover:text-[#DFC289] transition-colors cursor-pointer"
                >
                  150-Year Guild Legacy
                </button>
              </li>
              <li>
                <span className="text-[#FAF8F5]/60">Srinagar Atelier: Boulevard Road, Dal Lake</span>
              </li>
              <li>
                <span className="text-[#FAF8F5]/60">Artisan Master: Ustad Ghulam Nabi</span>
              </li>
              <li>
                <span className="text-[#FAF8F5]/60">Bespoke Concierge: atelier@kashida-couture.com</span>
              </li>
              <li>
                <span className="text-[#FAF8F5]/60">Concierge Desk: +91 194 245 8820</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Dispatch (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#DFC289]">
              Private Salon Dispatch
            </h4>
            <p className="text-xs text-[#FAF8F5]/75 leading-relaxed">
              Receive private invitations to limited seasonal loom cuts, bespoke trousseau previews, and artisan stories.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#FAF8F5]/10 border border-[#DFC289]/40 text-xs text-[#DFC289] flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>You are inscribed for private seasonal dispatches.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#DFC289] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter patron email address"
                    className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 focus:border-[#DFC289] text-xs text-[#FAF8F5] placeholder:text-[#FAF8F5]/40 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#C5A059] hover:bg-[#DFC289] text-[#162B21] text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer"
                >
                  Inscribe for Dispatch
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Respectful Modesty Note */}
        <div className="pt-8 border-t border-[#FAF8F5]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/60">
          <p>
            © {new Date().getFullYear()} Kāshida Couture. All Rights Reserved. Handcrafted in Kashmir.
          </p>

          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider text-[#DFC289]/80">
            <span>Razorpay Encrypted</span>
            <span>·</span>
            <span>Insured DHL Transit</span>
            <span>·</span>
            {onOpenAdmin && (
              <>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#FAF8F5] underline underline-offset-4 decoration-[#DFC289]/40 hover:decoration-[#DFC289] transition-colors cursor-pointer"
                >
                  Curator Backoffice
                </button>
                <span>·</span>
              </>
            )}
            <span>Ethical Artisan Direct</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

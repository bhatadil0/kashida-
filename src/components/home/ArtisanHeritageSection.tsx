import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { HomepageHeritageConfig } from '../../types';

interface ArtisanHeritageSectionProps {
  heritageConfig?: HomepageHeritageConfig;
  onExploreCouture: () => void;
}

export const ArtisanHeritageSection: React.FC<ArtisanHeritageSectionProps> = ({
  heritageConfig,
  onExploreCouture,
}) => {
  const imageUrl =
    heritageConfig?.artisanImageUrl ||
    '/src/assets/images/craft_artisan_embroidery_1794059619731.jpg';
  const imageAlt =
    heritageConfig?.artisanImageAlt ||
    'Elderly Kashmiri master artisan hand-embroidering sozni pashmina in Srinagar atelier';
  const dossierTitle =
    heritageConfig?.dossierTitle ||
    'Master Ustad Ghulam Nabi in his 1880 Srinagar wood atelier';
  const dossierDesc =
    heritageConfig?.dossierDescription ||
    'Single-needle Sozni technique with 32 stitches per linear centimetre.';
  const supertitle = heritageConfig?.subheadline || 'The Soul of the Valley';
  const headline =
    heritageConfig?.headline || 'Where Time Is Counted In Stitches, Not Hours';
  const paragraph1 =
    heritageConfig?.narrativeParagraph1 ||
    'In an era of disposable fashion and synthetic mass production, Kāshida Couture stands as a sanctuary for Kashmir’s finest living arts. Our garments are not stored in warehouses; they are individually hand-embroidered by multigenerational master craftspeople (Ustads) along the banks of the Jhelum and Dal Lake.';
  const paragraph2 =
    heritageConfig?.narrativeParagraph2 ||
    'Every motif draws from Kashmir’s natural poetry: the flaming autumnal Chinar leaves, the almond blossoms of Badamwari, and the regal Paisley (Boteh) favored by Mughal empresses.';

  return (
    <section id="heritage-story" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Atmospheric Image with Artisan Provenance Seal */}
        <div className="relative group">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#F2EDE4] shadow-xl">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#162B21]/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Heritage Floating Inscription (Strictly unboxed, clean card) */}
          <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:right-6 bg-[#FAF8F5] p-5 border border-[#EBE4D8] shadow-lg max-w-xs space-y-1">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A059] font-semibold block">
              Atelier Dossier
            </span>
            <p className="font-serif text-sm text-[#162B21] font-medium leading-snug">
              {dossierTitle}
            </p>
            <p className="text-[11px] text-[#525B56] leading-tight">
              {dossierDesc}
            </p>
          </div>
        </div>

        {/* Right: Narrative Story */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold">
              {supertitle}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#162B21] tracking-tight leading-tight">
              {headline}
            </h2>
          </div>

          <p className="text-sm text-[#525B56] leading-relaxed">
            {paragraph1}
          </p>

          <p className="text-sm text-[#525B56] leading-relaxed">
            {paragraph2}
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#162B21] text-[#DFC289] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <p className="text-xs text-[#1C1F1E]">
                <strong className="font-semibold text-[#162B21]">Authentic Tilla Embroidery:</strong> Hand-twisted metallic zari threads laid on velvet with precision needle tacking.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#162B21] text-[#DFC289] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <p className="text-xs text-[#1C1F1E]">
                <strong className="font-semibold text-[#162B21]">GI Tagged Changthangi Cashmere:</strong> Sourced ethically from high-altitude nomadic pastoralists in Ladakh.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#162B21] text-[#DFC289] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <p className="text-xs text-[#1C1F1E]">
                <strong className="font-semibold text-[#162B21]">Ethical Artisan Remuneration:</strong> Above-market compensation directly honoring master artists and their families.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onExploreCouture}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
            >
              <span>Acquire An Heirloom Piece</span>
              <ArrowRight className="w-4 h-4 text-[#DFC289]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { ArrowRight, Compass, Sparkles, Award, ShieldCheck, ChevronRight } from 'lucide-react';
import { ProductCategory, HomepageHeroConfig } from '../../types';

interface HeroBannerProps {
  heroConfig?: HomepageHeroConfig;
  onExplore: (category?: ProductCategory) => void;
  onExploreHeritage: () => void;
}

const HERO_SHOWCASE_PIECES = [
  {
    id: 'hero-piece-1',
    name: 'Zuleikha Emerald Velvet Pheran',
    technique: '24K Antique Gold Tilla Needlework',
    fabric: 'Pure Mulberry Silk Velvet',
    craftHours: '180 Hours',
    image: '/src/assets/images/product_velvet_pheran_1794059618066.jpg',
    category: 'pherans' as ProductCategory,
    price: '₹38,250',
  },
  {
    id: 'hero-piece-2',
    name: 'Noor-e-Gulmarg Pashmina Shawl',
    technique: 'GI-Certified 12-Micron Cashmere',
    fabric: 'Hand-Spun Changthangi',
    craftHours: '240,000 Stitches',
    image: '/src/assets/images/product_pashmina_shawl_1794059618001.jpg',
    category: 'pashmina' as ProductCategory,
    price: '₹68,000',
  },
  {
    id: 'hero-piece-3',
    name: 'Chinar Whisper Chanderi Kurta',
    technique: 'Pastel Hand Kashida Floral Jaal',
    fabric: 'Raw Silk Chanderi',
    craftHours: '90 Hours',
    image: '/src/assets/images/lookbook_silk_kurta_1794468433537.jpg',
    category: 'kurtas' as ProductCategory,
    price: '₹24,225',
  },
  {
    id: 'hero-piece-4',
    name: 'Shah-i-Hamadan Indigo Pheran',
    technique: 'Heirloom Aari Chain-Stitch',
    fabric: '480 GSM Pure Merino Wool',
    craftHours: '140 Hours',
    image: '/src/assets/images/product_indigo_pheran_1794468434866.jpg',
    category: 'pherans' as ProductCategory,
    price: '₹34,000',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  heroConfig,
  onExplore,
  onExploreHeritage,
}) => {
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(0);
  const activePiece = HERO_SHOWCASE_PIECES[selectedPieceIndex];

  const defaultBg = heroConfig?.imageUrl || '/src/assets/images/hero_kashida_couture_1794059616415.jpg';
  const badgeText = heroConfig?.badge || 'Haute Artisanat Du Kashmir · Bespoke Edition';
  const headline = heroConfig?.headline || 'Tradition Woven Into Every Detail';
  const subheadline =
    heroConfig?.subheadline ||
    'Pure silk velvet pherans adorned with antique gold Tilla metallic threadwork and feather-light GI-certified Changthangi Pashmina. Each creation represents over 180 hours of handcraft by fourth-generation Srinagar artisans.';
  const ctaText = heroConfig?.ctaText || 'Acquire An Heirloom Piece';

  return (
    <section className="relative w-full bg-[#0E1D16] text-[#FAF8F5] overflow-hidden border-b border-[#C5A059]/20">
      {/* Background Ambience with Subtle Texture & Atmospheric Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={defaultBg}
          alt={headline}
          className="w-full h-full object-cover object-top opacity-35 scale-105 filter blur-xs transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1D16] via-[#0E1D16]/95 to-[#162B21]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,160,89,0.12),transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Command Editorial Narrative (7 Columns) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Kicker Tag */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#162B21] border border-[#C5A059]/40 text-[#DFC289] text-[11px] uppercase tracking-[0.28em] font-semibold rounded-xs shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              <span>{badgeText}</span>
            </div>

            {/* Main Headline with High-Impact Editorial Typography */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#FAF8F5] tracking-tight leading-[1.08] text-balance font-normal">
              {headline.split(' ').map((word, idx) => (
                <span
                  key={idx}
                  className={
                    idx === 1 || idx === 3
                      ? 'italic text-[#DFC289] font-serif pr-2 font-normal'
                      : 'pr-2'
                  }
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Narrative Body */}
            <p className="text-sm sm:text-base text-[#FAF8F5]/85 font-light leading-relaxed max-w-2xl">
              {subheadline}
            </p>

            {/* Dual CTAs with Generous Touch Target */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onExplore('all')}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#C5A059] hover:bg-[#DFC289] text-[#162B21] text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreHeritage}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-[#DFC289]/40 hover:border-[#DFC289] bg-[#162B21]/60 backdrop-blur-sm hover:bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#DFC289]" />
                <span>150-Year Guild Legacy</span>
              </button>
            </div>

            {/* Editorial 3-Pillar Trust Strip */}
            <div className="pt-8 border-t border-[#FAF8F5]/15 grid grid-cols-3 gap-6 sm:gap-8">
              <div className="space-y-1">
                <p className="font-serif text-2xl sm:text-3xl text-[#DFC289] font-normal tabular-nums">
                  180+
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#FAF8F5]/70 font-medium">
                  Hours per Garment
                </p>
              </div>
              <div className="space-y-1 border-l border-[#FAF8F5]/15 pl-6 sm:pl-8">
                <p className="font-serif text-2xl sm:text-3xl text-[#DFC289] font-normal tabular-nums">
                  100%
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#FAF8F5]/70 font-medium">
                  Pure Hand Needlework
                </p>
              </div>
              <div className="space-y-1 border-l border-[#FAF8F5]/15 pl-6 sm:pl-8">
                <p className="font-serif text-2xl sm:text-3xl text-[#DFC289] font-normal tracking-wide">
                  GI Seal
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#FAF8F5]/70 font-medium">
                  Authentic Ladakhi Pashmina
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Haute Couture Showcase (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Main Showcase Frame */}
            <div className="relative group bg-[#162B21] border border-[#C5A059]/40 rounded-xs p-3 shadow-2xl overflow-hidden transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xs bg-[#0E1D16]">
                <img
                  src={activePiece.image}
                  alt={activePiece.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1D16]/90 via-transparent to-transparent pointer-events-none" />

                {/* Floating Atelier Dossier Inscription */}
                <div className="absolute top-3 left-3 bg-[#0E1D16]/85 backdrop-blur-md px-3 py-1.5 border border-[#C5A059]/30 text-[#DFC289] text-[10px] uppercase tracking-[0.2em] font-medium rounded-xs flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>Srinagar Atelier Edition</span>
                </div>

                {/* Bottom Piece Information Box */}
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#DFC289]">
                    <span className="uppercase tracking-[0.2em] font-semibold text-[10px]">
                      {activePiece.technique}
                    </span>
                    <span className="font-mono font-bold">{activePiece.price}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-medium leading-tight">
                    {activePiece.name}
                  </h3>
                  <div className="flex items-center justify-between pt-2 border-t border-[#FAF8F5]/20 text-[11px] text-[#FAF8F5]/80">
                    <span>Fabric: {activePiece.fabric}</span>
                    <button
                      onClick={() => onExplore(activePiece.category)}
                      className="inline-flex items-center gap-1 text-[#DFC289] hover:text-white font-semibold cursor-pointer group/link"
                    >
                      <span>Inspect Piece</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Thumbnail Carousel Strip */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#FAF8F5]/70 uppercase tracking-widest font-medium">
                <span>Select Haute Creation</span>
                <span className="text-[#DFC289] font-mono">0{selectedPieceIndex + 1} / 04</span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {HERO_SHOWCASE_PIECES.map((piece, idx) => (
                  <button
                    key={piece.id}
                    onClick={() => setSelectedPieceIndex(idx)}
                    className={`relative aspect-square overflow-hidden rounded-xs border-2 transition-all duration-300 cursor-pointer ${
                      selectedPieceIndex === idx
                        ? 'border-[#C5A059] shadow-md scale-105'
                        : 'border-[#FAF8F5]/20 opacity-60 hover:opacity-100 hover:border-[#FAF8F5]/50'
                    }`}
                  >
                    <img
                      src={piece.image}
                      alt={piece.name}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                    {selectedPieceIndex === idx && (
                      <div className="absolute inset-0 bg-[#C5A059]/20" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

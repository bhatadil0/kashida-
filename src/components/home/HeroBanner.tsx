import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { ProductCategory, HomepageHeroConfig } from '../../types';

interface HeroBannerProps {
  heroConfig?: HomepageHeroConfig;
  onExplore: (category?: ProductCategory) => void;
  onExploreHeritage: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  heroConfig,
  onExplore,
  onExploreHeritage,
}) => {
  const bgImage = heroConfig?.imageUrl || '/src/assets/images/hero_kashida_couture_1794059616415.jpg';
  const overlayOpacity = (heroConfig?.overlayOpacity ?? 75) / 100;
  const badgeText = heroConfig?.badge || 'Bespoke Kashmiri Haute Couture · Made To Order';
  const headline = heroConfig?.headline || 'Tradition Woven Into Every Detail';
  const subheadline =
    heroConfig?.subheadline ||
    'Pure silk velvet pherans adorned with antique gold Tilla metallic threadwork and feather-light GI-certified Changthangi Pashmina. Each creation represents over 180 hours of handcraft by fourth-generation Srinagar artisans.';
  const ctaText = heroConfig?.ctaText || 'Explore The Collection';

  return (
    <section className="relative w-full bg-[#162B21] text-[#FAF8F5] overflow-hidden">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={headline}
          className="w-full h-full object-cover object-top opacity-85 scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark scrim gradient to ensure 4.5:1 WCAG AA text contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0E1D16]/95 via-[#162B21]/75 to-transparent md:to-[#162B21]/20 transition-opacity"
          style={{ opacity: overlayOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1D16] via-transparent to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 flex flex-col justify-end min-h-[720px]">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#162B21]/60 backdrop-blur-md border border-[#C5A059]/40 text-[#DFC289] text-[11px] uppercase tracking-[0.3em] font-medium">
            <span>{badgeText}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#FAF8F5] tracking-tight leading-[1.1] text-balance">
            {headline}
          </h1>

          <p className="text-sm sm:text-base text-[#FAF8F5]/85 font-light leading-relaxed max-w-xl">
            {subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={() => onExplore('all')}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#C5A059] hover:bg-[#DFC289] text-[#162B21] text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreHeritage}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#FAF8F5]/40 hover:border-[#DFC289] bg-[#162B21]/40 backdrop-blur-sm hover:bg-[#162B21]/60 text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#DFC289]" />
              <span>Artisan Heritage Story</span>
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-8 border-t border-[#FAF8F5]/15 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <p className="font-serif text-xl sm:text-2xl text-[#DFC289] font-medium tabular-nums">150+</p>
              <p className="text-[11px] uppercase tracking-wider text-[#FAF8F5]/70 mt-0.5">Years of Guild Legacy</p>
            </div>
            <div>
              <p className="font-serif text-xl sm:text-2xl text-[#DFC289] font-medium tabular-nums">100%</p>
              <p className="text-[11px] uppercase tracking-wider text-[#FAF8F5]/70 mt-0.5">Pure Hand Needlework</p>
            </div>
            <div>
              <p className="font-serif text-xl sm:text-2xl text-[#DFC289] font-medium tabular-nums">GI</p>
              <p className="text-[11px] uppercase tracking-wider text-[#FAF8F5]/70 mt-0.5">Certified Provenance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

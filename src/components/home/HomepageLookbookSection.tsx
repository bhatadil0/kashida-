import React from 'react';
import { ArrowRight, Sparkles, Tag } from 'lucide-react';
import { HomepageLookbookItem, HomepagePromoBannerConfig, ProductCategory } from '../../types';

interface HomepageLookbookSectionProps {
  cards: HomepageLookbookItem[];
  promoBanner?: HomepagePromoBannerConfig;
  onSelectCategory: (category: ProductCategory) => void;
  onApplyPromoCode?: (code: string) => void;
}

export const HomepageLookbookSection: React.FC<HomepageLookbookSectionProps> = ({
  cards,
  promoBanner,
  onSelectCategory,
  onApplyPromoCode,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Lookbook Collection Cards Mosaic */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F2EDE4] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Haute Archives</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#162B21]">
              The Royal Wardrobe Lookbook
            </h2>
          </div>
          <span className="text-xs text-[#525B56]">
            Individually tailored by Srinagar guild ateliers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => onSelectCategory(card.linkCategory as ProductCategory)}
              className="group relative bg-[#FAF8F5] border border-[#EBE4D8] hover:border-[#C5A059] rounded-xs overflow-hidden transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F2EDE4]">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#162B21]/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <span className="absolute top-3 left-3 bg-[#162B21]/90 backdrop-blur-xs text-[#DFC289] text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-xs border border-[#C5A059]/30">
                  {card.categoryTag}
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-base font-semibold leading-snug group-hover:text-[#DFC289] transition-colors">
                    {card.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] flex items-center justify-between gap-2 border-t border-[#EBE4D8]">
                <p className="text-[11px] text-[#525B56] line-clamp-1">
                  {card.subtitle}
                </p>
                <div className="w-6 h-6 rounded-full bg-[#162B21] text-[#DFC289] flex items-center justify-center shrink-0 group-hover:bg-[#C5A059] group-hover:text-[#162B21] transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Harvest Promotional Banner (If Enabled) */}
      {promoBanner?.enabled && (
        <div className="relative rounded-xs overflow-hidden border border-[#C5A059]/40 shadow-xl bg-[#162B21] text-white">
          <div className="absolute inset-0">
            <img
              src={promoBanner.imageUrl}
              alt={promoBanner.title}
              className="w-full h-full object-cover opacity-35"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E1D16]/95 via-[#162B21]/85 to-transparent" />
          </div>

          <div className="relative p-8 sm:p-12 lg:p-16 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/20 border border-[#DFC289]/40 text-[#DFC289] text-[10px] uppercase tracking-[0.25em] font-semibold rounded-xs">
              <Tag className="w-3 h-3" />
              <span>{promoBanner.badge}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FAF8F5] leading-tight">
              {promoBanner.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#FAF8F5]/85 leading-relaxed font-light">
              {promoBanner.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="p-2.5 bg-black/40 border border-[#DFC289]/40 rounded-xs flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-wider text-[#DFC289]">Curator Code:</span>
                <span className="font-mono text-sm font-bold tracking-wider text-white bg-[#162B21] px-2.5 py-0.5 border border-[#DFC289]/30">
                  {promoBanner.couponCode}
                </span>
              </div>

              {onApplyPromoCode && (
                <button
                  type="button"
                  onClick={() => onApplyPromoCode(promoBanner.couponCode)}
                  className="px-6 py-3 bg-[#C5A059] hover:bg-[#DFC289] text-[#162B21] text-xs uppercase tracking-[0.2em] font-bold rounded-xs cursor-pointer shadow-md transition-all flex items-center gap-2"
                >
                  <span>Apply Code to Bag</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

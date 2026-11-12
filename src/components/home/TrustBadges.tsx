import React from 'react';
import { Award, Feather, Sparkles, ShieldCheck } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const guarantees = [
    {
      idx: '01',
      icon: Award,
      title: 'GI-Certified Pashmina',
      tagline: 'Authenticity Certificate',
      description: 'Registered Geographical Indication certificate guaranteeing 100% pure Ladakhi Changthangi cashmere.',
    },
    {
      idx: '02',
      icon: Feather,
      title: 'Pure Needlework Only',
      tagline: 'Zero Machine Stitches',
      description: 'Single-needle Sozni and pure metallic Tilla zari hand-applied by master artisans in Srinagar.',
    },
    {
      idx: '03',
      icon: Sparkles,
      title: 'Cut-to-Order Couture',
      tagline: 'Artisanal Integrity',
      description: 'Each piece tailored individually to preserve heirloom techniques and support heritage guild families.',
    },
    {
      idx: '04',
      icon: ShieldCheck,
      title: 'White-Glove Assurance',
      tagline: 'Insured Global Transit',
      description: 'Fully insured DHL express delivery with complimentary 7-day concierge return & exchange privileges.',
    },
  ];

  return (
    <section className="bg-white border-y border-[#EBE4D8] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y md:divide-y-0 lg:divide-x divide-[#EBE4D8]/70">
        {guarantees.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.idx}
              className="group flex flex-col justify-between pt-6 md:pt-0 lg:px-6 first:pl-0 last:pr-0 transition-transform duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xs bg-[#FAF8F5] border border-[#EBE4D8] flex items-center justify-center text-[#C5A059] group-hover:bg-[#162B21] group-hover:text-[#DFC289] group-hover:border-[#162B21] transition-all">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <span className="font-serif text-lg text-[#C5A059]/40 group-hover:text-[#C5A059] transition-colors font-light">
                    {item.idx}
                  </span>
                </div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C5A059] font-semibold block mb-0.5">
                  {item.tagline}
                </span>
                <h4 className="font-serif text-base text-[#162B21] font-semibold tracking-tight mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-[#525B56] leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

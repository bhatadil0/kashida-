import React from 'react';
import { Award, Feather, Sparkles, RefreshCw } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const guarantees = [
    {
      icon: Award,
      title: 'GI Certified Pashmina',
      description: 'Registered Geographical Indication certificate guaranteeing 100% pure Ladakhi Changthangi cashmere.',
    },
    {
      icon: Feather,
      title: 'Pure Needlework Only',
      description: 'Zero machine embroidery. Every stitch executed using heirloom Sozni and pure Tilla metallic threadwork.',
    },
    {
      icon: Sparkles,
      title: 'Cut-to-Order Couture',
      description: 'Sustainable luxury crafted specifically for you, minimizing waste while honoring master weavers.',
    },
    {
      icon: RefreshCw,
      title: 'White-Glove Assurance',
      description: 'Fully insured global DHL express transit with complimentary 7-day personal concierge return assistance.',
    },
  ];

  return (
    <section className="bg-[#F2EDE4]/60 border-y border-[#EBE4D8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {guarantees.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-sm bg-[#FAF8F5] border border-[#EBE4D8] flex items-center justify-center shrink-0 text-[#C5A059]">
                <Icon className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-sm uppercase tracking-wider text-[#162B21] font-semibold">
                  {item.title}
                </h4>
                <p className="text-xs text-[#525B56] leading-relaxed">
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

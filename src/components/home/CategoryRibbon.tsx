import React from 'react';
import { CategoryConfig, ProductCategory } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CategoryRibbonProps {
  categories: CategoryConfig[];
  activeCategory: ProductCategory;
  onSelectCategory: (categoryId: ProductCategory) => void;
}

export const CategoryRibbon: React.FC<CategoryRibbonProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#EBE4D8] pb-3 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A059] font-semibold block mb-0.5">
            Artisanal Taxonomy
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#162B21] tracking-tight">
            Curated Guild Collections
          </h2>
        </div>
        <button
          onClick={() => onSelectCategory('all')}
          className="text-xs uppercase tracking-[0.15em] text-[#C5A059] hover:text-[#162B21] font-medium flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>View All Ensembles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Horizontal Carousel / Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as ProductCategory)}
              className={`group relative text-left p-3.5 border transition-all duration-300 rounded-xs flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'border-[#C5A059] bg-[#162B21] text-[#FAF8F5] shadow-md ring-1 ring-[#C5A059]/40'
                  : 'border-[#EBE4D8] bg-[#FAF8F5] hover:border-[#C5A059] hover:bg-white text-[#162B21] shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`relative w-12 h-12 rounded-full overflow-hidden shrink-0 border ${
                    isActive ? 'border-[#DFC289]' : 'border-[#EBE4D8] group-hover:border-[#C5A059]'
                  } transition-colors`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <span
                    className={`block text-[9px] uppercase tracking-widest font-semibold truncate ${
                      isActive ? 'text-[#DFC289]' : 'text-[#C5A059]'
                    }`}
                  >
                    {cat.slug}
                  </span>
                  <h3
                    className={`font-serif text-sm font-semibold truncate ${
                      isActive ? 'text-white' : 'text-[#162B21] group-hover:text-[#C5A059]'
                    } transition-colors`}
                  >
                    {cat.name.split(' ')[0]} {cat.name.split(' ')[1] || ''}
                  </h3>
                </div>
              </div>

              <div
                className={`pt-2 border-t text-[11px] flex items-center justify-between ${
                  isActive
                    ? 'border-[#234233] text-[#FAF8F5]/80'
                    : 'border-[#F2EDE4] text-[#525B56]'
                }`}
              >
                <span className="truncate text-[10px] font-light">
                  {cat.needleworkFocus?.split('&')[0] || 'Masterwork'}
                </span>
                <span
                  className={`text-[10px] uppercase font-semibold tracking-wider ${
                    isActive ? 'text-[#DFC289]' : 'text-[#162B21] group-hover:text-[#C5A059]'
                  }`}
                >
                  Explore →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

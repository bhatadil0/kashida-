import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProductCategory, CategoryConfig } from '../../types';

export interface FilterOptions {
  category: ProductCategory;
  embroidery: string;
  fabric: string;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}

interface FilterBarProps {
  filters: FilterOptions;
  onChangeFilters: (filters: FilterOptions) => void;
  totalCount: number;
  categoryConfigs?: CategoryConfig[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  totalCount,
  categoryConfigs,
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  const categories: { label: string; value: ProductCategory }[] = categoryConfigs
    ? [
        { label: 'All Curations', value: 'all' },
        ...categoryConfigs.map((c) => ({
          label: c.name.split(' ')[0] + (c.name.split(' ')[1] ? ' ' + c.name.split(' ')[1] : ''),
          value: c.id,
        })),
      ]
    : [
        { label: 'All Curations', value: 'all' },
        { label: 'Pherans', value: 'pherans' },
        { label: 'Kurtas', value: 'kurtas' },
        { label: 'Pashmina', value: 'pashmina' },
        { label: 'Silk Stoles', value: 'stoles' },
        { label: 'Beauty Elixirs', value: 'cosmetics' },
      ];

  const embroideries = [
    'All Needlework',
    'Tilla Metallic Zari',
    'Sozni Fine Needlework',
    'Aari Fine Chain-Stitch',
    'Kashida Floral',
  ];

  const resetFilters = () => {
    onChangeFilters({
      category: 'all',
      embroidery: 'All Needlework',
      fabric: 'All Fabrics',
      maxPrice: 80000,
      inStockOnly: false,
      sortBy: 'featured',
    });
  };

  return (
    <div className="border-b border-[#F2EDE4] pb-6 mb-8">
      {/* Category Tabs (Interactive Segmented Buttons) */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onChangeFilters({ ...filters, category: cat.value })}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer rounded-sm ${
                filters.category === cat.value
                  ? 'bg-[#162B21] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'bg-transparent text-[#525B56] hover:text-[#162B21] hover:bg-[#F2EDE4]/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary controls: Filter toggle & Sort */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3.5 py-2 border text-xs tracking-wider uppercase transition-colors cursor-pointer rounded-sm ${
              showFilters
                ? 'border-[#162B21] bg-[#162B21] text-[#FAF8F5]'
                : 'border-[#EBE4D8] text-[#525B56] hover:border-[#C5A059] bg-[#FAF8F5]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Refine</span>
          </button>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                sortBy: e.target.value as FilterOptions['sortBy'],
              })
            }
            className="px-3 py-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs uppercase tracking-wider text-[#1C1F1E] focus:outline-none focus:border-[#C5A059] cursor-pointer rounded-sm"
          >
            <option value="featured">Featured Curations</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Expanded Refine Drawer */}
      {showFilters && (
        <div className="p-5 bg-[#F2EDE4]/40 border border-[#EBE4D8] rounded-sm space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Needlework Craft */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                Artisan Needlework
              </label>
              <select
                value={filters.embroidery}
                onChange={(e) =>
                  onChangeFilters({ ...filters, embroidery: e.target.value })
                }
                className="w-full p-2 text-xs border border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
              >
                {embroideries.map((emb) => (
                  <option key={emb} value={emb}>
                    {emb}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Cap Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-[#162B21] font-semibold">
                <span>Maximum Price</span>
                <span className="font-mono text-[#162B21]">
                  ₹{filters.maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="80000"
                step="5000"
                value={filters.maxPrice}
                onChange={(e) =>
                  onChangeFilters({ ...filters, maxPrice: Number(e.target.value) })
                }
                className="w-full accent-[#162B21] cursor-pointer"
              />
            </div>

            {/* In-Stock Only Toggle */}
            <div className="flex items-center sm:justify-center pt-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1C1F1E]">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) =>
                    onChangeFilters({ ...filters, inStockOnly: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#162B21] rounded"
                />
                <span className="font-medium">Ready in Atelier (In Stock)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[#EBE4D8]">
            <span className="text-xs text-[#525B56]">
              Showing <strong className="text-[#162B21]">{totalCount}</strong> authenticated pieces
            </span>

            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-[#681A24] hover:underline cursor-pointer uppercase tracking-wider font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

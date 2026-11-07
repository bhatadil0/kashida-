import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const LiveSearchModal: React.FC<LiveSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularTerms = [
    'Velvet Pheran',
    'GI Pashmina Shawl',
    'Tilla Needlework',
    'Chanderi Kurta',
    'Sozni Border',
    'Saffron Elixir',
  ];

  const filteredProducts = query.trim().length > 0
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.embroidery.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      })
    : [];

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl rounded-xs overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F2EDE4] bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-[#C5A059] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bespoke pherans, GI Pashmina, silk kurtas, tilla..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#1C1F1E] placeholder:text-[#525B56]/50 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#525B56] hover:text-[#1C1F1E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-wider text-[#525B56] hover:text-[#162B21] ml-2 px-2 py-1 cursor-pointer font-medium"
          >
            Esc
          </button>
        </div>

        {/* Dynamic Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6">
          {query.trim().length === 0 ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-2">
                  Curated Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularTerms.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-[#F2EDE4]/60 hover:bg-[#EBE4D8] text-[#162B21] text-xs tracking-wider transition-colors cursor-pointer rounded-xs"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#525B56] font-semibold block mb-2">
                  Featured Seasonal Curations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(p)}
                      className="flex items-center gap-3 p-2 bg-[#F2EDE4]/30 hover:bg-[#F2EDE4] transition-colors cursor-pointer border border-transparent hover:border-[#EBE4D8]"
                    >
                      <img
                        src={p.primaryImage}
                        alt=""
                        className="w-12 h-14 object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="font-serif text-xs text-[#162B21] font-medium truncate">
                          {p.name}
                        </p>
                        <p className="font-mono text-[11px] text-[#525B56]">
                          ₹{p.basePrice.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-[#525B56]">
                <span>Matching authenticated creations ({filteredProducts.length})</span>
                <span className="text-[11px] text-[#C5A059] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Certified Craft
                </span>
              </div>

              <div className="divide-y divide-[#F2EDE4]">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-[#F2EDE4]/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.primaryImage}
                        alt=""
                        className="w-14 h-16 object-cover rounded-xs shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#C5A059]">
                          <span>{p.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{p.embroidery}</span>
                        </div>
                        <h4 className="font-serif text-sm text-[#162B21] font-medium group-hover:text-[#C5A059] transition-colors">
                          {p.name}
                        </h4>
                        <p className="text-xs text-[#525B56] line-clamp-1 mt-0.5">
                          {p.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono text-sm font-semibold text-[#162B21] tabular-nums">
                        ₹{Math.round(p.basePrice * (1 - p.discountPercent / 100)).toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] text-[#525B56] group-hover:text-[#162B21] flex items-center justify-end gap-1 mt-1">
                        Inspect <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <p className="font-serif text-base text-[#162B21]">
                No pieces found for "{query}"
              </p>
              <p className="text-xs text-[#525B56] max-w-sm mx-auto">
                Try searching for specific crafts such as <span className="text-[#C5A059]">Tilla</span>, <span className="text-[#C5A059]">Pashmina</span>, or browse by silhouette.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

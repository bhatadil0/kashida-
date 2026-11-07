import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Zap,
  Edit2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Check,
  Eye,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Product, SEOConfig, ProductSEOScore } from '../../types';
import {
  auditCatalogSEO,
  calculateProductSEOScore,
  autoOptimizeProductSEO,
} from '../../utils/seoHealth';
import { ContentQualityScoreBadge } from '../product/ContentQualityScoreBadge';

interface SEOHealthCheckerProps {
  products: Product[];
  seoConfig: SEOConfig;
  onUpdateProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
}

export const SEOHealthChecker: React.FC<SEOHealthCheckerProps> = ({
  products,
  seoConfig,
  onUpdateProduct,
  onEditProduct,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [filterGrade, setFilterGrade] = useState<'ALL' | 'CRITICAL' | 'NEEDS_IMPROVEMENT' | 'GOOD' | 'EXEMPLARY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [previewSnippetId, setPreviewSnippetId] = useState<string | null>(null);
  const [optimizedToast, setOptimizedToast] = useState<string | null>(null);
  const [bulkOptimizedToast, setBulkOptimizedToast] = useState<string | null>(null);

  // Compute catalog audit
  const { summary, productScores } = useMemo(() => {
    return auditCatalogSEO(products, seoConfig);
  }, [products, seoConfig]);

  // Handle re-scan animation
  const handleReScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  // Handle individual auto-optimization
  const handleAutoOptimize = (product: Product) => {
    const optimized = autoOptimizeProductSEO(product, seoConfig);
    onUpdateProduct(optimized);
    setOptimizedToast(`Optimized SEO for "${product.name}"!`);
    setTimeout(() => setOptimizedToast(null), 3000);
  };

  // Handle bulk auto-optimization
  const handleBulkOptimize = () => {
    const underperforming = products.filter((p) => {
      const score = calculateProductSEOScore(p, seoConfig);
      return score.totalScore < 85;
    });

    if (underperforming.length === 0) {
      setBulkOptimizedToast('All catalog pieces already meet high content quality standards (85+)!');
      setTimeout(() => setBulkOptimizedToast(null), 3000);
      return;
    }

    underperforming.forEach((p) => {
      const optimized = autoOptimizeProductSEO(p, seoConfig);
      onUpdateProduct(optimized);
    });

    setBulkOptimizedToast(`Successfully optimized metadata across ${underperforming.length} catalog piece(s)!`);
    setTimeout(() => setBulkOptimizedToast(null), 3500);
  };

  // Filtered product items
  const filteredScores = useMemo(() => {
    return productScores.filter(({ productId, grade, detectedKeywords }) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return false;

      // Grade filter
      if (filterGrade !== 'ALL') {
        if (filterGrade === 'CRITICAL' && grade !== 'CRITICAL') return false;
        if (filterGrade === 'NEEDS_IMPROVEMENT' && grade !== 'NEEDS_IMPROVEMENT') return false;
        if (filterGrade === 'GOOD' && grade !== 'GOOD') return false;
        if (filterGrade === 'EXEMPLARY' && grade !== 'EXEMPLARY') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = product.name.toLowerCase().includes(q);
        const matchCategory = product.category.toLowerCase().includes(q);
        const matchKeyword = detectedKeywords.some((k) => k.toLowerCase().includes(q));
        if (!matchTitle && !matchCategory && !matchKeyword) return false;
      }

      return true;
    });
  }, [productScores, products, filterGrade, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Audit Controls */}
      <div className="p-6 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Real-Time Catalog SEO Engine</span>
            </div>
            <h3 className="font-serif text-2xl text-[#162B21] mt-0.5">
              SEO Health Checker & Content Quality Auditor
            </h3>
            <p className="text-xs text-[#525B56] max-w-2xl mt-1 leading-relaxed">
              Continuously scans product titles, subtitles, craft dossiers, and description depth against active target keywords ({seoConfig.keywords}). Detects snippet truncation risks and keyword voids.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReScan}
              disabled={isScanning}
              className="px-4 py-2.5 border border-[#162B21] text-[#162B21] hover:bg-[#162B21] hover:text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer rounded-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Scan Metadata'}</span>
            </button>

            <button
              type="button"
              onClick={handleBulkOptimize}
              className="px-5 py-2.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-[0.15em] font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs rounded-xs"
            >
              <Zap className="w-3.5 h-3.5 text-[#DFC289]" />
              <span>Auto-Tune All Pieces</span>
            </button>
          </div>
        </div>

        {/* Catalog Health Indices KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {/* Overall Score */}
          <div className="p-3.5 bg-white border border-[#EBE4D8] rounded-xs space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#525B56] block font-semibold">
              Catalog Health Index
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-bold text-[#162B21]">
                {summary.overallHealthIndex}
              </span>
              <span className="text-xs text-[#525B56]">/ 100</span>
            </div>
            <div className="w-full bg-[#EBE4D8] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  summary.overallHealthIndex >= 85
                    ? 'bg-emerald-700'
                    : summary.overallHealthIndex >= 70
                    ? 'bg-[#C5A059]'
                    : 'bg-[#681A24]'
                }`}
                style={{ width: `${summary.overallHealthIndex}%` }}
              />
            </div>
          </div>

          {/* Exemplary */}
          <div className="p-3.5 bg-white border border-[#EBE4D8] rounded-xs space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-emerald-800 block font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Exemplary (90+)</span>
            </span>
            <div className="font-mono text-2xl font-bold text-emerald-900">
              {summary.exemplaryCount}
              <span className="text-xs font-normal text-[#525B56] ml-1">pieces</span>
            </div>
            <span className="text-[10px] text-[#525B56] block">Search ready</span>
          </div>

          {/* Good */}
          <div className="p-3.5 bg-white border border-[#EBE4D8] rounded-xs space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#162B21] block font-semibold">
              Strong (74-89)
            </span>
            <div className="font-mono text-2xl font-bold text-[#162B21]">
              {summary.goodCount}
              <span className="text-xs font-normal text-[#525B56] ml-1">pieces</span>
            </div>
            <span className="text-[10px] text-[#525B56] block">Minor improvements</span>
          </div>

          {/* Needs Improvement */}
          <div className="p-3.5 bg-white border border-[#EBE4D8] rounded-xs space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#C5A059] block font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-[#C5A059]" />
              <span>Moderate (55-73)</span>
            </span>
            <div className="font-mono text-2xl font-bold text-[#C5A059]">
              {summary.needsImprovementCount}
              <span className="text-xs font-normal text-[#525B56] ml-1">pieces</span>
            </div>
            <span className="text-[10px] text-[#525B56] block">Needs enrichment</span>
          </div>

          {/* Critical */}
          <div className="p-3.5 bg-white border border-[#EBE4D8] rounded-xs space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#681A24] block font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-[#681A24]" />
              <span>Critical (&lt;55)</span>
            </span>
            <div className="font-mono text-2xl font-bold text-[#681A24]">
              {summary.criticalCount}
              <span className="text-xs font-normal text-[#525B56] ml-1">pieces</span>
            </div>
            <span className="text-[10px] text-[#525B56] block">Thin copy / missing</span>
          </div>

          {/* Average metrics */}
          <div className="p-3.5 bg-white border border-[#EBE4D8] rounded-xs space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#525B56] block font-semibold">
              Average Dimensions
            </span>
            <div className="text-xs space-y-0.5 text-[#162B21]">
              <div>
                Title: <strong className="font-mono">{summary.averageTitleLength}</strong> ch
              </div>
              <div>
                Desc: <strong className="font-mono">{summary.averageDescriptionLength}</strong> ch
              </div>
            </div>
            <span className="text-[9px] text-[#C5A059] block font-medium">Optimal: 32-58 / 180+</span>
          </div>
        </div>

        {/* Missing Target Keywords Analysis */}
        {summary.topMissingKeywords.length > 0 && (
          <div className="p-3.5 bg-[#F2EDE4]/60 border border-[#EBE4D8] rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px]">
                High-Opportunity Keyword Gaps:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {summary.topMissingKeywords.map(({ keyword, missingInCount }) => (
                  <span
                    key={keyword}
                    className="px-2 py-0.5 bg-white border border-[#EBE4D8] text-[10px] font-mono text-[#525B56] rounded-xs"
                    title={`Missing in ${missingInCount} products`}
                  >
                    "{keyword}" ({missingInCount} missing)
                  </span>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-[#525B56] shrink-0">
              Infusing these terms will elevate organic discovery.
            </span>
          </div>
        )}

        {/* Toast notifications */}
        {optimizedToast && (
          <div className="p-3 bg-emerald-100 text-emerald-900 text-xs flex items-center gap-2 rounded-xs animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{optimizedToast}</span>
          </div>
        )}
        {bulkOptimizedToast && (
          <div className="p-3 bg-[#162B21] text-[#DFC289] text-xs flex items-center gap-2 rounded-xs animate-in fade-in">
            <Sparkles className="w-4 h-4 text-[#DFC289]" />
            <span>{bulkOptimizedToast}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterGrade('ALL')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer shrink-0 ${
              filterGrade === 'ALL'
                ? 'bg-[#162B21] text-[#FAF8F5]'
                : 'bg-white border border-[#EBE4D8] text-[#525B56] hover:bg-[#F2EDE4]'
            }`}
          >
            All Pieces ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterGrade('CRITICAL')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer shrink-0 ${
              filterGrade === 'CRITICAL'
                ? 'bg-[#681A24] text-white'
                : 'bg-white border border-[#EBE4D8] text-[#681A24] hover:bg-red-50'
            }`}
          >
            Critical Issues ({summary.criticalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterGrade('NEEDS_IMPROVEMENT')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer shrink-0 ${
              filterGrade === 'NEEDS_IMPROVEMENT'
                ? 'bg-[#C5A059] text-[#162B21]'
                : 'bg-white border border-[#EBE4D8] text-[#C5A059] hover:bg-amber-50'
            }`}
          >
            Moderate ({summary.needsImprovementCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterGrade('EXEMPLARY')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer shrink-0 ${
              filterGrade === 'EXEMPLARY'
                ? 'bg-emerald-800 text-white'
                : 'bg-white border border-[#EBE4D8] text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            Champions ({summary.exemplaryCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search piece, keyword..."
            className="w-full pl-9 pr-3 py-1.5 border border-[#EBE4D8] bg-white text-xs text-[#1C1F1E] focus:outline-none focus:border-[#C5A059] rounded-xs"
          />
        </div>
      </div>

      {/* Product SEO Diagnostic Cards List */}
      <div className="space-y-3">
        {filteredScores.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#EBE4D8] rounded-xs space-y-2">
            <p className="font-serif text-base text-[#162B21]">
              No catalog pieces match this filter.
            </p>
            <p className="text-xs text-[#525B56]">
              All scanned products fulfill the selected content criteria.
            </p>
          </div>
        ) : (
          filteredScores.map((score) => {
            const product = products.find((p) => p.id === score.productId);
            if (!product) return null;

            const isExpanded = expandedProductId === product.id;
            const isSnippetPreview = previewSnippetId === product.id;

            return (
              <div
                key={product.id}
                className="bg-white border border-[#EBE4D8] rounded-xs overflow-hidden transition-shadow hover:shadow-xs"
              >
                {/* Product Summary Row */}
                <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <img
                      src={product.primaryImage}
                      alt={product.name}
                      className="w-14 h-18 object-cover border border-[#EBE4D8] rounded-xs shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold">
                          {product.category}
                        </span>
                        <span className="text-[10px] text-[#525B56]">·</span>
                        <span className="text-[10px] text-[#525B56] font-mono">{product.embroidery}</span>
                        <span className="text-[10px] text-[#525B56]">·</span>
                        <span className="text-[10px] text-[#525B56]">{product.fabric}</span>
                      </div>

                      <h4 className="font-serif text-base font-semibold text-[#162B21] truncate mt-0.5">
                        {product.name}
                      </h4>

                      <p className="text-xs text-[#525B56] line-clamp-1 mt-0.5">
                        {product.subtitle || 'No subtitle specified'}
                      </p>

                      <div className="flex items-center gap-4 text-[10px] text-[#525B56] font-mono mt-1">
                        <span>Title: {score.titleLength} ch</span>
                        <span>·</span>
                        <span>Desc: {score.descriptionLength} ch</span>
                        <span>·</span>
                        <span>Keywords detected: {score.detectedKeywords.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Quality Score Meter & Actions */}
                  <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F2EDE4]">
                    <div className="w-48">
                      <ContentQualityScoreBadge score={score} showDetails={false} />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAutoOptimize(product)}
                        className="p-2 bg-[#F2EDE4] hover:bg-[#162B21] text-[#162B21] hover:text-[#FAF8F5] transition-colors rounded-xs cursor-pointer"
                        title="Auto-Optimize Product SEO (Elevate to 90+)"
                      >
                        <Zap className="w-4 h-4 text-[#C5A059]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        className="p-2 border border-[#EBE4D8] hover:bg-[#F2EDE4] text-[#162B21] transition-colors rounded-xs cursor-pointer"
                        title="Edit Full Product Dossier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedProductId(isExpanded ? null : product.id)}
                        className="p-2 border border-[#EBE4D8] hover:bg-[#F2EDE4] text-[#162B21] transition-colors rounded-xs cursor-pointer"
                        title="Toggle Diagnostic Breakdown"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Diagnostic Dossier */}
                {isExpanded && (
                  <div className="p-5 bg-[#FAF8F5] border-t border-[#EBE4D8] space-y-5 text-xs animate-in fade-in">
                    {/* 3 Pillars Score Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Keywords breakdown */}
                      <div className="p-3 bg-white border border-[#EBE4D8] rounded-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px]">
                            Keywords Coverage
                          </span>
                          <span className="font-mono font-bold text-xs">
                            {score.metrics.keywordsScore} / 35 pts
                          </span>
                        </div>
                        <div className="w-full bg-[#EBE4D8] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-700 h-full"
                            style={{ width: `${(score.metrics.keywordsScore / 35) * 100}%` }}
                          />
                        </div>
                        <div className="pt-1 space-y-1">
                          <span className="text-[10px] text-[#525B56] block">Detected Keywords:</span>
                          <div className="flex flex-wrap gap-1">
                            {score.detectedKeywords.map((kw) => (
                              <span
                                key={kw}
                                className="px-1.5 py-0.2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono rounded-xs"
                              >
                                ✓ {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                        {score.missingTargetKeywords.length > 0 && (
                          <div className="pt-1 space-y-1">
                            <span className="text-[10px] text-[#C5A059] block">Missing Target Terms:</span>
                            <div className="flex flex-wrap gap-1">
                              {score.missingTargetKeywords.map((kw) => (
                                <span
                                  key={kw}
                                  className="px-1.5 py-0.2 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono rounded-xs"
                                >
                                  + {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Title breakdown */}
                      <div className="p-3 bg-white border border-[#EBE4D8] rounded-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px]">
                            Title Snippet Health
                          </span>
                          <span className="font-mono font-bold text-xs">
                            {score.metrics.titleScore} / 30 pts
                          </span>
                        </div>
                        <div className="w-full bg-[#EBE4D8] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#162B21] h-full"
                            style={{ width: `${(score.metrics.titleScore / 30) * 100}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-[#525B56] pt-1">
                          Current length: <strong className="font-mono">{score.titleLength}</strong> characters.
                          <span className="block text-[10px] text-[#C5A059] mt-0.5">
                            Target benchmark: 32 to 58 characters.
                          </span>
                        </p>
                        <button
                          type="button"
                          onClick={() => setPreviewSnippetId(isSnippetPreview ? null : product.id)}
                          className="text-[11px] text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{isSnippetPreview ? 'Hide Snippet' : 'Preview Search Snippet'}</span>
                        </button>
                      </div>

                      {/* Description Richness breakdown */}
                      <div className="p-3 bg-white border border-[#EBE4D8] rounded-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px]">
                            Description Depth
                          </span>
                          <span className="font-mono font-bold text-xs">
                            {score.metrics.descriptionScore} / 35 pts
                          </span>
                        </div>
                        <div className="w-full bg-[#EBE4D8] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#C5A059] h-full"
                            style={{ width: `${(score.metrics.descriptionScore / 35) * 100}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-[#525B56] pt-1">
                          Current length: <strong className="font-mono">{score.descriptionLength}</strong> characters ({score.wordCount} words).
                          <span className="block text-[10px] text-[#525B56] mt-0.5">
                            Craft dossier: {product.craftsmanship?.length ? 'Documented ✓' : 'Sparse ⚠'}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Google SERP Snippet Preview for this Product */}
                    {isSnippetPreview && (
                      <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                          Simulated Google SERP Snippet
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-[#202124]">
                          <span className="text-[11px] text-[#202124]">https://kashida-couture.com</span>
                          <span className="text-gray-400">›</span>
                          <span className="text-[11px] text-gray-500">{product.category}</span>
                          <span className="text-gray-400">›</span>
                          <span className="text-[11px] text-gray-500">{product.id}</span>
                        </div>
                        <h4 className="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                          {product.name} — Luxury Kashmiri Couture
                        </h4>
                        <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                          {product.subtitle ? `${product.subtitle}. ` : ''}
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-0.5 font-mono">
                          <span className="text-amber-500 font-bold">★★★★★</span>
                          <span>{product.rating} ({product.reviewsCount} reviews)</span>
                          <span>· ₹{product.basePrice.toLocaleString('en-IN')}</span>
                          <span>· In stock</span>
                        </div>
                      </div>
                    )}

                    {/* Actionable Suggestions & Optimizations */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px]">
                          Actionable Optimization Recommendations ({score.recommendations.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAutoOptimize(product)}
                          className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Apply Intelligent Optimization</span>
                        </button>
                      </div>

                      {score.recommendations.length === 0 ? (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>This piece satisfies all search snippet and keyword depth benchmarks!</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {score.recommendations.map((rec, idx) => (
                            <div
                              key={idx}
                              className={`p-3 border rounded-xs flex items-start gap-2.5 ${
                                rec.severity === 'CRITICAL'
                                  ? 'bg-red-50 border-red-200 text-red-900'
                                  : rec.severity === 'WARNING'
                                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                                  : 'bg-blue-50 border-blue-200 text-blue-900'
                              }`}
                            >
                              {rec.severity === 'CRITICAL' ? (
                                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                              ) : rec.severity === 'WARNING' ? (
                                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                              ) : (
                                <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-0.5 flex-1">
                                <p className="font-medium text-xs">{rec.message}</p>
                                {rec.suggestedFix && (
                                  <p className="text-[11px] opacity-85">
                                    <strong>Recommendation:</strong> {rec.suggestedFix}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

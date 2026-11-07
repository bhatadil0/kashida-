import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { ProductSEOScore } from '../../types';

interface ContentQualityScoreBadgeProps {
  score: ProductSEOScore;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onInspect?: () => void;
}

export const ContentQualityScoreBadge: React.FC<ContentQualityScoreBadgeProps> = ({
  score,
  size = 'md',
  showDetails = false,
  onInspect,
}) => {
  const { totalScore, grade, metrics } = score;

  // Grade color theme
  let badgeBg = 'bg-[#162B21]/10 text-[#162B21] border-[#162B21]/30';
  let pillColor = 'bg-[#162B21] text-[#FAF8F5]';
  let gradeLabel = 'Exemplary';

  if (grade === 'EXEMPLARY') {
    badgeBg = 'bg-emerald-50 text-emerald-900 border-emerald-300';
    pillColor = 'bg-emerald-800 text-white';
    gradeLabel = 'SEO Champion';
  } else if (grade === 'GOOD') {
    badgeBg = 'bg-[#162B21]/5 text-[#162B21] border-[#162B21]/20';
    pillColor = 'bg-[#162B21] text-[#DFC289]';
    gradeLabel = 'Strong';
  } else if (grade === 'NEEDS_IMPROVEMENT') {
    badgeBg = 'bg-amber-50 text-amber-900 border-amber-300';
    pillColor = 'bg-[#C5A059] text-[#162B21]';
    gradeLabel = 'Moderate';
  } else {
    badgeBg = 'bg-red-50 text-red-900 border-red-300';
    pillColor = 'bg-[#681A24] text-white';
    gradeLabel = 'Needs Attention';
  }

  if (size === 'sm') {
    return (
      <div
        onClick={onInspect}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-xs text-[10px] font-mono font-medium ${badgeBg} ${
          onInspect ? 'cursor-pointer hover:shadow-xs transition-shadow' : ''
        }`}
        title={`Content Quality: ${totalScore}/100 (${gradeLabel})`}
      >
        <span className="font-bold">{totalScore}/100</span>
        <span className="text-[9px] uppercase tracking-wider opacity-80">{gradeLabel}</span>
      </div>
    );
  }

  return (
    <div className={`p-3 border rounded-xs ${badgeBg} space-y-2`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 rounded-xs font-mono font-bold text-xs ${pillColor}`}>
            {totalScore}/100
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider block">
              Content Quality Score
            </span>
            <span className="text-[10px] opacity-75">{gradeLabel} Optimization</span>
          </div>
        </div>

        {onInspect && (
          <button
            type="button"
            onClick={onInspect}
            className="text-[11px] underline flex items-center gap-0.5 hover:opacity-100 opacity-80 cursor-pointer"
          >
            <span>Audit</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {showDetails && (
        <div className="space-y-1.5 pt-1.5 border-t border-current/10 text-[11px]">
          {/* Keywords bar */}
          <div className="flex items-center justify-between">
            <span className="opacity-80">Keywords Match:</span>
            <span className="font-mono font-semibold">{metrics.keywordsScore}/35</span>
          </div>
          <div className="w-full bg-black/10 h-1 rounded-full overflow-hidden">
            <div
              className="bg-current h-full transition-all duration-300"
              style={{ width: `${(metrics.keywordsScore / 35) * 100}%` }}
            />
          </div>

          {/* Title bar */}
          <div className="flex items-center justify-between">
            <span className="opacity-80">Title Snippet Length:</span>
            <span className="font-mono font-semibold">{metrics.titleScore}/30</span>
          </div>
          <div className="w-full bg-black/10 h-1 rounded-full overflow-hidden">
            <div
              className="bg-current h-full transition-all duration-300"
              style={{ width: `${(metrics.titleScore / 30) * 100}%` }}
            />
          </div>

          {/* Description bar */}
          <div className="flex items-center justify-between">
            <span className="opacity-80">Description Richness:</span>
            <span className="font-mono font-semibold">{metrics.descriptionScore}/35</span>
          </div>
          <div className="w-full bg-black/10 h-1 rounded-full overflow-hidden">
            <div
              className="bg-current h-full transition-all duration-300"
              style={{ width: `${(metrics.descriptionScore / 35) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

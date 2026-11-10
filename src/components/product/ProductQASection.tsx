import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  MessageSquare,
  CheckCircle,
  ThumbsUp,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';
import { ProductQA } from '../../types';

interface ProductQASectionProps {
  productId: string;
  productName: string;
}

const DEFAULT_QAS: ProductQA[] = [
  {
    id: 'qa-1',
    productId: 'prod-pheran-1',
    question: 'Is the Tilla embroidery on this velvet pheran executed with genuine silver or silver-plated wire?',
    askedBy: 'Amina R., London',
    askedAt: '3 days ago',
    answer:
      'Every imperial velvet pheran commissioned at Kāshida uses traditional 24-karat gold-washed or authentic silver-gilt wire (known historically as "Pure Zari/Tilla"), wound painstakingly over fine silk thread. It retains its radiant luster for generations without tarnishing.',
    answeredBy: 'Master Ustad Ghulam Rasool, Srinagar Atelier',
    answeredAt: '2 days ago',
    helpfulCount: 28,
  },
  {
    id: 'qa-2',
    productId: 'prod-pheran-1',
    question: 'Can the sleeve length and hemline be customized to my personal height?',
    askedBy: 'Zainab K., Dubai',
    askedAt: '1 week ago',
    answer:
      'Yes, absolutely. Because each piece is tailored to order, you can save your exact arm span and height measurements in your Patron Sanctuary or request custom tailoring at checkout. Our master tailors will calibrate the silhouette precisely.',
    answeredBy: 'Kāshida Bespoke Master Tailor',
    answeredAt: '6 days ago',
    helpfulCount: 19,
  },
  {
    id: 'qa-3',
    productId: 'prod-pheran-1',
    question: 'How should this piece be cared for and stored in warmer climates?',
    askedBy: 'Rohit M., Mumbai',
    askedAt: '2 weeks ago',
    answer:
      'We ship every garment inside an aromatic Kashmiri cedar-wood box wrapped in pure unbleached muslin. Dry clean only with a specialist heritage textile conservator. Never hang by the shoulders; fold gently along the side seams with acid-free tissue paper between the embroidered panels.',
    answeredBy: 'Curator of Textile Preservation',
    answeredAt: '12 days ago',
    helpfulCount: 14,
  },
];

export const ProductQASection: React.FC<ProductQASectionProps> = ({
  productId,
  productName,
}) => {
  const [qas, setQas] = useState<ProductQA[]>(() => {
    const saved = localStorage.getItem(`kashida_qa_${productId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_QAS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [askerName, setAskerName] = useState('');
  const [askerEmail, setAskerEmail] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});

  const filteredQAs = qas.filter(
    (qa) =>
      qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVoteHelpful = (qaId: string) => {
    if (helpfulVoted[qaId]) return;
    setHelpfulVoted((prev) => ({ ...prev, [qaId]: true }));
    setQas((prev) =>
      prev.map((item) =>
        item.id === qaId ? { ...item, helpfulCount: item.helpfulCount + 1 } : item
      )
    );
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !askerName.trim()) return;

    const newQAItem: ProductQA = {
      id: `qa-${Date.now()}`,
      productId,
      question: newQuestion.trim(),
      askedBy: askerName.trim(),
      askedAt: 'Just now',
      answer:
        'Thank you for your commission inquiry. Our Srinagar Master Artisan reviews all questions within 4 hours. General consultation: All Kāshida garments follow authenticated Kashmiri GI handicraft standards.',
      answeredBy: 'Master Artisan Dispatch Concierge',
      answeredAt: 'Moments ago',
      helpfulCount: 1,
    };

    const updated = [newQAItem, ...qas];
    setQas(updated);
    localStorage.setItem(`kashida_qa_${productId}`, JSON.stringify(updated));

    setSubmittedSuccess(true);
    setNewQuestion('');
    setAskerName('');
    setAskerEmail('');
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsAsking(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 pt-6 border-t border-[#F2EDE4]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold block">
            Amazon & Flipkart Proven Standard
          </span>
          <h3 className="font-serif text-2xl text-[#162B21]">
            Patron Inquiries & Master Craftsman Answers
          </h3>
          <p className="text-xs text-[#525B56] mt-0.5">
            Verified answers on silk weights, gold zari fineness, and tailoring directly from our Srinagar guild.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAsking(!isAsking)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer rounded-xs transition-colors self-start sm:self-auto shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#DFC289]" />
          <span>{isAsking ? 'Close Form' : 'Ask Master Artisan'}</span>
        </button>
      </div>

      {/* Ask Question Drawer */}
      {isAsking && (
        <form
          onSubmit={handleSubmitQuestion}
          className="p-5 bg-[#FAF8F5] border border-[#C5A059]/40 rounded-xs space-y-4 animate-in fade-in"
        >
          <div className="flex items-center gap-2 text-xs text-[#162B21] font-semibold">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Consult Our Srinagar Master Craftsmen regarding "{productName}"</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-[#525B56] block">
              Your Question or Custom Commission Inquiry *
            </label>
            <textarea
              rows={3}
              required
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="e.g. Can this be ordered in bespoke burgundy velvet with gold sozni needlework?"
              className="w-full p-2.5 text-xs border border-[#EBE4D8] bg-white text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#525B56] block">
                Your Full Name / Title *
              </label>
              <input
                type="text"
                required
                value={askerName}
                onChange={(e) => setAskerName(e.target.value)}
                placeholder="e.g. Lady Leila"
                className="w-full p-2 text-xs border border-[#EBE4D8] bg-white text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#525B56] block">
                Email for Response Dispatch
              </label>
              <input
                type="email"
                value={askerEmail}
                onChange={(e) => setAskerEmail(e.target.value)}
                placeholder="patron@domain.com"
                className="w-full p-2 text-xs border border-[#EBE4D8] bg-white text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {submittedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Inquiry dispatched! Our master weavers have recorded your inquiry.</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAsking(false)}
              className="px-4 py-2 border border-[#EBE4D8] text-xs text-[#525B56] hover:text-[#162B21] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-[#DFC289]" />
              <span>Submit Inquiry</span>
            </button>
          </div>
        </form>
      )}

      {/* Real-time Search Box */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525B56]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search answers on sizing, fabric authenticity, zari purity, and shipping..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EBE4D8] text-xs text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
        />
      </div>

      {/* Q&A Items List */}
      <div className="divide-y divide-[#EBE4D8] border border-[#EBE4D8] rounded-xs bg-[#FAF8F5]">
        {filteredQAs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#525B56] space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto text-[#C5A059]" />
            <p>No questions matched your search query.</p>
            <button
              onClick={() => setIsAsking(true)}
              className="text-[#162B21] font-semibold underline cursor-pointer"
            >
              Be the first to ask the artisan!
            </button>
          </div>
        ) : (
          filteredQAs.map((qa) => (
            <div key={qa.id} className="p-5 space-y-3">
              {/* Question */}
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-[#162B21] bg-[#EBE4D8] px-2 py-0.5 rounded-xs shrink-0 mt-0.5">
                  Q
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-serif text-sm font-semibold text-[#162B21] leading-snug">
                    {qa.question}
                  </h4>
                  <span className="text-[11px] text-[#525B56]">
                    Asked by {qa.askedBy} • {qa.askedAt}
                  </span>
                </div>
              </div>

              {/* Verified Artisan Answer */}
              <div className="flex items-start gap-3 pl-8">
                <span className="font-mono text-xs font-bold text-[#DFC289] bg-[#162B21] px-2 py-0.5 rounded-xs shrink-0 mt-0.5">
                  A
                </span>
                <div className="space-y-2 text-xs leading-relaxed text-[#1C1F1E]">
                  <p>{qa.answer}</p>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#EBE4D8]/60 text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium">{qa.answeredBy}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#525B56]">
                      <span>Helpful?</span>
                      <button
                        type="button"
                        onClick={() => handleVoteHelpful(qa.id)}
                        disabled={helpfulVoted[qa.id]}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs border text-[10px] transition-colors cursor-pointer ${
                          helpfulVoted[qa.id]
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white border-[#EBE4D8] hover:border-[#C5A059] text-[#162B21]'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Yes ({qa.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

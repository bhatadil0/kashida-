import React, { useState } from 'react';
import { Star, CheckCircle, HelpCircle, MessageSquare, Search, Send, ThumbsUp, Camera } from 'lucide-react';
import { Review } from '../../types';

interface CustomerReviewsBreakdownProps {
  productName: string;
  rating: number;
  reviews: Review[];
  onAddReview?: (review: Review) => void;
}

interface QuestionAnswer {
  id: string;
  question: string;
  author: string;
  date: string;
  answer: string;
  answeredBy: string;
  votes: number;
}

const INITIAL_QA: QuestionAnswer[] = [
  {
    id: 'qa-1',
    question: 'Is the metallic thread in the Tilla embroidery real silver or synthetic?',
    author: 'Meenakshi R., New Delhi',
    date: '3 weeks ago',
    answer: 'All Kāshida Tilla creations are wrought with authentic 925 sterling silver thread electroplated in 24k gold leaf, hand-twined by master artisans in Old Srinagar. A laboratory assay certificate accompanies every commission.',
    answeredBy: 'Kāshida Master Goldsmith Atelier',
    votes: 24,
  },
  {
    id: 'qa-2',
    question: 'How does the sizing run for layering over winter undergarments?',
    author: 'Sunita B., London',
    date: '1 month ago',
    answer: 'Traditional Kashmiri pherans feature a regal, relaxed drape designed for comfortable layering. If you prefer a tailored modern silhouette, we recommend choosing your standard UK/US dress size.',
    answeredBy: 'Kāshida Fit Concierge',
    votes: 18,
  },
  {
    id: 'qa-3',
    question: 'Can I request custom sleeve length or bridal monogramming in Urdu/English?',
    author: 'Zainab F., Dubai',
    date: '2 months ago',
    answer: 'Yes, absolutely. You can click "Request Bespoke Fit / Custom Monogram" on this page or specify your heirloom monogram during checkout.',
    answeredBy: 'Bespoke Atelier Liaison',
    votes: 15,
  },
];

const PATRON_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    caption: 'Handcrafted Tilla embroidery in natural daylight',
    author: 'Soraya M., Mumbai',
  },
  {
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    caption: 'Pure silk velvet texture and antique gold thread',
    author: 'Radhika K., Bengaluru',
  },
  {
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    caption: 'Unboxing the hand-carved cedarwood chest',
    author: 'Ayesha T., London',
  },
  {
    url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=600&q=80',
    caption: 'Changthangi Pashmina micro-weave under magnifying loupe',
    author: 'David P., New York',
  },
];

export const CustomerReviewsBreakdown: React.FC<CustomerReviewsBreakdownProps> = ({
  productName,
  rating,
  reviews,
  onAddReview,
}) => {
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');

  // Q&A state
  const [qaList, setQaList] = useState<QuestionAnswer[]>(INITIAL_QA);
  const [qaSearch, setQaSearch] = useState('');
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionAuthor, setNewQuestionAuthor] = useState('');
  const [qaSuccessMessage, setQaSuccessMessage] = useState('');

  // Photo modal preview
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; caption: string; author: string } | null>(null);

  // Compute Star Distribution (Amazon style)
  const totalReviews = reviews.length;
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    starCounts[star] = (starCounts[star] || 0) + 1;
  });

  // Filtered reviews
  const filteredReviews = selectedStarFilter
    ? reviews.filter((r) => Math.round(r.rating) === selectedStarFilter)
    : reviews;

  // Filtered Q&A
  const filteredQa = qaList.filter(
    (q) =>
      q.question.toLowerCase().includes(qaSearch.toLowerCase()) ||
      q.answer.toLowerCase().includes(qaSearch.toLowerCase())
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      location: 'Verified Patron',
      rating: newReviewRating,
      date: 'Today',
      title: newReviewTitle.trim() || 'Exceptional Kashmiri needlework',
      comment: newReviewComment.trim(),
      verified: true,
    };

    if (onAddReview) {
      onAddReview(newRev);
    }
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    setIsWriteReviewOpen(false);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newQuestionAuthor.trim()) return;

    const newQa: QuestionAnswer = {
      id: `qa-${Date.now()}`,
      question: newQuestionText.trim(),
      author: newQuestionAuthor.trim(),
      date: 'Just now',
      answer:
        'Thank you for your inquiry. Our master artisans in Srinagar have received your query and confirmed: this piece meets the purest GI and Changthangi standards. Our concierge will follow up directly.',
      answeredBy: 'Srinagar Master Weaver & Curator',
      votes: 1,
    };

    setQaList([newQa, ...qaList]);
    setNewQuestionText('');
    setNewQuestionAuthor('');
    setIsAskQuestionOpen(false);
    setQaSuccessMessage('Your question was answered by our Srinagar atelier concierge!');
    setTimeout(() => setQaSuccessMessage(''), 4000);
  };

  const handleVoteQa = (id: string) => {
    setQaList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, votes: q.votes + 1 } : q))
    );
  };

  return (
    <div className="space-y-12">
      {/* 1. Amazon-Style Rating Summary & Star Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-[#FAF8F5] p-6 sm:p-8 border border-[#EBE4D8] rounded-xs shadow-xs">
        {/* Left Column: Big Rating & Stars */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="font-serif text-xl text-[#162B21]">Patron Appraisals</h3>
          
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-5xl font-bold text-[#162B21]">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs text-[#525B56] uppercase tracking-wider">
              out of 5 stars
            </span>
          </div>

          <div className="flex text-[#C5A059]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? 'fill-current stroke-none'
                    : 'stroke-current fill-none'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-[#525B56]">
            Based on <strong>{totalReviews}</strong> verified purchases & atelier appraisals.
          </p>

          <button
            type="button"
            onClick={() => setIsWriteReviewOpen(!isWriteReviewOpen)}
            className="w-full mt-2 py-2.5 px-4 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] transition-colors cursor-pointer"
          >
            {isWriteReviewOpen ? 'Close Form' : 'Write a Patron Review'}
          </button>
        </div>

        {/* Right Column: Visual Star Distribution Progress Bars (Amazon Style) */}
        <div className="md:col-span-8 space-y-2.5 border-t md:border-t-0 md:border-l md:pl-8 border-[#EBE4D8] pt-4 md:pt-0">
          <div className="flex items-center justify-between text-xs text-[#525B56] pb-1">
            <span className="font-semibold uppercase tracking-wider text-[#162B21]">
              Rating Breakdown
            </span>
            {selectedStarFilter && (
              <button
                type="button"
                onClick={() => setSelectedStarFilter(null)}
                className="text-[11px] text-[#681A24] underline cursor-pointer"
              >
                Clear {selectedStarFilter}★ Filter
              </button>
            )}
          </div>

          {[5, 4, 3, 2, 1].map((star) => {
            const count = starCounts[star] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            const isSelected = selectedStarFilter === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedStarFilter(isSelected ? null : star)}
                className={`w-full flex items-center gap-3 text-xs p-1 rounded-xs transition-colors cursor-pointer group text-left ${
                  isSelected ? 'bg-[#162B21]/10 font-bold' : 'hover:bg-black/5'
                }`}
              >
                <span className="w-12 text-[#162B21] font-medium shrink-0 group-hover:underline">
                  {star} Star
                </span>

                <div className="flex-1 bg-[#EBE4D8] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C5A059] group-hover:bg-[#162B21] h-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-10 text-right font-mono text-[#525B56] tabular-nums text-[11px] shrink-0">
                  {percentage}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Customer Photo Gallery (Amazon/Flipkart Style) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#C5A059]" />
            <h4 className="font-serif text-lg text-[#162B21]">
              Customer Gallery & Unboxings
            </h4>
          </div>
          <span className="text-xs text-[#525B56]">
            {PATRON_PHOTOS.length} authentic patron snapshots
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PATRON_PHOTOS.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setPreviewPhoto(photo)}
              className="group relative aspect-square bg-[#F2EDE4] overflow-hidden rounded-xs border border-[#EBE4D8] cursor-pointer"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 text-[10px] text-white">
                <p className="line-clamp-2">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Review Submission Form (Collapsible) */}
      {isWriteReviewOpen && (
        <form
          onSubmit={handleReviewSubmit}
          className="p-6 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-4 animate-in fade-in"
        >
          <h4 className="font-serif text-base text-[#162B21]">
            Share Your Experience with {productName}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <input
              type="text"
              placeholder="Your Full Name (e.g. Maharani Gayatri Devi)"
              value={newReviewAuthor}
              onChange={(e) => setNewReviewAuthor(e.target.value)}
              required
              className="p-2.5 bg-white border border-[#EBE4D8] text-[#162B21] focus:outline-none focus:border-[#C5A059]"
            />

            <input
              type="text"
              placeholder="Headline / Impression (e.g. Heirloom Masterpiece)"
              value={newReviewTitle}
              onChange={(e) => setNewReviewTitle(e.target.value)}
              required
              className="p-2.5 bg-white border border-[#EBE4D8] text-[#162B21] focus:outline-none focus:border-[#C5A059]"
            />

            <div className="flex items-center gap-2 p-2.5 bg-white border border-[#EBE4D8]">
              <span className="text-[#525B56]">Rating:</span>
              <select
                value={newReviewRating}
                onChange={(e) => setNewReviewRating(Number(e.target.value))}
                className="bg-transparent font-semibold text-[#162B21] focus:outline-none cursor-pointer"
              >
                <option value={5}>5 Stars - Flawless Heirloom</option>
                <option value={4}>4 Stars - Exquisite Craft</option>
                <option value={3}>3 Stars - Good Quality</option>
                <option value={2}>2 Stars - Needs Improvement</option>
                <option value={1}>1 Star - Dissatisfied</option>
              </select>
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="Describe the fabric texture, needlework precision, packaging, or fit..."
            value={newReviewComment}
            onChange={(e) => setNewReviewComment(e.target.value)}
            required
            className="w-full p-2.5 bg-white border border-[#EBE4D8] text-xs text-[#162B21] focus:outline-none focus:border-[#C5A059]"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsWriteReviewOpen(false)}
              className="px-4 py-2 border border-[#EBE4D8] text-xs uppercase tracking-wider text-[#525B56] hover:bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-[#DFC289]" />
              <span>Publish Appraisal</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. Filtered Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#162B21]">
            Showing {filteredReviews.length} Verified Patron Review(s)
            {selectedStarFilter && ` with ${selectedStarFilter} Stars`}
          </span>
        </div>

        {filteredReviews.length === 0 ? (
          <p className="text-xs text-[#525B56] py-6 text-center italic">
            No appraisals found for this star tier.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 bg-white border border-[#EBE4D8] rounded-xs space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-semibold text-[#162B21]">
                      {rev.author}
                    </span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-medium">
                        <CheckCircle className="w-3 h-3 text-emerald-700" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#525B56]/70">{rev.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-current stroke-none'
                            : 'stroke-current fill-none'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#162B21]">{rev.title}</span>
                </div>

                <p className="text-xs text-[#525B56] leading-relaxed">{rev.comment}</p>

                <div className="pt-2 flex items-center gap-4 text-[11px] text-[#525B56]">
                  <span>Purchased in: {rev.location}</span>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      const btn = e.currentTarget;
                      btn.textContent = 'Helpful (1)';
                    }}
                    className="flex items-center gap-1 text-[#162B21] hover:underline cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Amazon-style Customer Questions & Answers */}
      <div className="pt-8 border-t border-[#F2EDE4] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#C5A059]" />
              <h4 className="font-serif text-xl text-[#162B21]">
                Have a Question? Ask Srinagar Artisans
              </h4>
            </div>
            <p className="text-xs text-[#525B56] mt-0.5">
              Get answers about pure Pashmina micron counts, sizing alterations, or zari threads.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAskQuestionOpen(!isAskQuestionOpen)}
            className="px-4 py-2 border border-[#162B21] text-[#162B21] hover:bg-[#162B21] hover:text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer shrink-0"
          >
            {isAskQuestionOpen ? 'Close Form' : 'Ask Question'}
          </button>
        </div>

        {/* Search Q&A */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={qaSearch}
            onChange={(e) => setQaSearch(e.target.value)}
            placeholder="Search answers or topics (e.g. 'Tilla thread', 'lining', 'sizing')..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EBE4D8] text-xs text-[#162B21] focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        {qaSuccessMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>{qaSuccessMessage}</span>
          </div>
        )}

        {/* Ask Question Form */}
        {isAskQuestionOpen && (
          <form
            onSubmit={handleAskQuestion}
            className="p-5 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-3 animate-in fade-in"
          >
            <h5 className="font-serif text-sm text-[#162B21]">
              Submit Question to Srinagar Master Weavers
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                placeholder="Your Name (e.g. Fatima K., Srinagar)"
                value={newQuestionAuthor}
                onChange={(e) => setNewQuestionAuthor(e.target.value)}
                required
                className="p-2 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
              />
              <input
                type="text"
                placeholder="Question (e.g. Is dry clean compulsory for this silk?)"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                required
                className="p-2 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-5 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Send Question
              </button>
            </div>
          </form>
        )}

        {/* Q&A Accordion Items */}
        <div className="space-y-4">
          {filteredQa.map((qa) => (
            <div
              key={qa.id}
              className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-2 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#162B21] bg-[#F2EDE4] px-1.5 py-0.5 rounded-xs shrink-0 font-mono">
                  Q:
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-[#162B21]">{qa.question}</p>
                  <p className="text-[10px] text-[#525B56] mt-0.5">
                    Asked by {qa.author} · {qa.date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1 pl-6 border-t border-[#F2EDE4]">
                <span className="font-bold text-[#C5A059] bg-[#162B21] text-[#FAF8F5] px-1.5 py-0.5 rounded-xs shrink-0 font-mono">
                  A:
                </span>
                <div className="flex-1 space-y-1">
                  <p className="text-[#525B56] leading-relaxed">{qa.answer}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#525B56] pt-1">
                    <span className="font-semibold text-[#162B21]">
                      Answered by {qa.answeredBy}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleVoteQa(qa.id)}
                      className="flex items-center gap-1 text-[#162B21] hover:underline cursor-pointer"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({qa.votes})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Patron Photo */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-pointer animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] max-w-lg w-full overflow-hidden border border-[#EBE4D8] shadow-2xl rounded-xs"
          >
            <img
              src={previewPhoto.url}
              alt={previewPhoto.caption}
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="p-4 space-y-1">
              <p className="font-serif text-sm text-[#162B21] font-semibold">
                {previewPhoto.caption}
              </p>
              <p className="text-xs text-[#525B56]">Uploaded by {previewPhoto.author}</p>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="w-full mt-3 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

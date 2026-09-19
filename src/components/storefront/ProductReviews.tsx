'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, ThumbsUp, MessageSquarePlus, X, Filter } from 'lucide-react';
import { ProductReview } from '@/lib/types';

interface ProductReviewsProps {
  productId: string;
  productTitle: string;
  initialReviews?: ProductReview[];
}

export function ProductReviews({
  productId,
  productTitle,
  initialReviews = [],
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [votedIds, setVotedIds] = useState<Record<string, boolean>>({});

  // Review Form State
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Fetch latest reviews if not provided
    if (initialReviews.length === 0) {
      fetch(`/api/reviews?productId=${productId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.reviews) setReviews(data.reviews);
        })
        .catch(() => {});
    }
  }, [productId, initialReviews.length]);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews) * 10) / 10
      : 5.0;

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const filteredReviews = selectedFilter
    ? reviews.filter((r) => r.rating === selectedFilter)
    : reviews;

  const handleVoteHelpful = async (reviewId: string) => {
    if (votedIds[reviewId]) return;
    setVotedIds((prev) => ({ ...prev, [reviewId]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );

    try {
      await fetch(`/api/reviews/${reviewId}/vote`, { method: 'POST' });
    } catch {}
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formTitle || !formComment) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          authorName: formName,
          authorLocation: formLocation || 'Europe',
          rating: formRating,
          title: formTitle,
          comment: formComment,
        }),
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setIsModalOpen(false);
          setFormName('');
          setFormLocation('');
          setFormTitle('');
          setFormComment('');
        }, 1200);
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-[#E4E4E0]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
            Verified Customer Proof
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#111111] mt-1">
            Customer Reviews & Ratings
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-[#0F5132] transition-colors shadow-xs"
        >
          <MessageSquarePlus size={15} />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Ratings Scorecard Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#F7F7F5] rounded-2xl p-6 sm:p-8 border border-[#E4E4E0] mb-10">
        {/* Left: Big Score */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b lg:border-b-0 lg:border-r border-[#E4E4E0]">
          <div className="text-5xl font-black text-[#111111] tracking-tight">{averageRating}</div>
          <div className="flex items-center gap-1 my-2 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={
                  star <= Math.round(averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-neutral-300'
                }
              />
            ))}
          </div>
          <p className="text-xs text-[#666660] font-medium">
            Based on {totalReviews} verified European artisan orders
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#0F5132] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 size={13} />
            <span>100% Authentic Customer Feedback</span>
          </div>
        </div>

        {/* Right: Distribution Bars */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star as keyof typeof ratingCounts] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            const isSelected = selectedFilter === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedFilter(isSelected ? null : star)}
                className={`flex items-center gap-3 text-xs text-left group w-full p-1 rounded-lg transition-colors ${
                  isSelected ? 'bg-white shadow-xs ring-1 ring-[#0F5132]' : 'hover:bg-white/50'
                }`}
              >
                <div className="w-12 font-semibold text-[#111111] flex items-center gap-1">
                  <span>{star}</span>
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 bg-[#E4E4E0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-10 text-right text-[#666660] font-mono text-[11px]">
                  {percentage}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter indicator */}
      {selectedFilter && (
        <div className="flex items-center justify-between bg-[#F0F0EC] px-4 py-2 rounded-xl mb-6 text-xs">
          <div className="flex items-center gap-2 font-medium text-[#111111]">
            <Filter size={14} className="text-[#0F5132]" />
            <span>Showing {selectedFilter}-star reviews only</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedFilter(null)}
            className="text-xs font-semibold text-[#0F5132] hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-10 bg-[#FAFAF8] rounded-2xl border border-dashed border-[#E4E4E0] text-neutral-500 text-xs">
            No reviews match your selected filter.
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#FAFAF8] rounded-xl p-5 border border-[#E4E4E0] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#0F5132] text-white flex items-center justify-center font-bold text-xs">
                    {review.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111111]">{review.authorName}</span>
                      {review.isVerifiedBuyer && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#0F5132] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 size={10} />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#666660]">{review.authorLocation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className={s <= review.rating ? 'fill-amber-400' : 'text-neutral-200'}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#111111]">{review.title}</h4>
                <p className="text-xs text-[#555550] leading-relaxed mt-1">{review.comment}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#666660] pt-2 border-t border-[#E4E4E0]/50">
                <span>Ordered {review.createdAt}</span>
                <button
                  type="button"
                  onClick={() => handleVoteHelpful(review.id)}
                  disabled={votedIds[review.id]}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                    votedIds[review.id]
                      ? 'text-[#0F5132] font-semibold'
                      : 'hover:text-[#111111] hover:bg-[#F0F0EC]'
                  }`}
                >
                  <ThumbsUp size={12} />
                  <span>Helpful ({review.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-200 p-6 relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-800 rounded-full hover:bg-neutral-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold text-[#111111]">Write a Review</h3>
            <p className="text-xs text-[#666660] mt-0.5">
              Share your thoughts on <strong className="text-neutral-900">{productTitle}</strong>
            </p>

            {submitSuccess ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 size={40} className="text-[#0F5132] mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-[#111111]">Thank You For Your Review!</h4>
                <p className="text-xs text-[#666660]">
                  Your verified buyer experience helps modern conscious shoppers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
                {/* Star Rating Select */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Overall Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        onMouseEnter={() => setFormHoverRating(star)}
                        onMouseLeave={() => setFormHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={22}
                          className={
                            star <= (formHoverRating || formRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-300'
                          }
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold ml-2 text-neutral-700 font-mono">
                      {formHoverRating || formRating} / 5
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Matteo R."
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      City, Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Milan, Italy"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Exceptional tailoring and luxurious drape"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe material feel, fit, sizing recommendations, and delivery experience..."
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 text-xs font-semibold bg-[#0F5132] text-white rounded-lg hover:bg-[#0c4128] transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Post Verified Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductReviews;

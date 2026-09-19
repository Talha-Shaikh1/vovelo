export interface SeoSignalFactors {
  hasMetaTitle: boolean;
  hasMetaDescription: boolean;
  hasAltText: boolean;
  hasStructuredData: boolean;
  viewsCount?: number;
  cartAddCount?: number;
  ordersCount?: number;
  createdAt: Date;
  isFeatured?: boolean;
}

/**
 * Calculates a dynamic SEO and popularity score for product surfacing.
 *
 * Scoring breakdown (Max ~100 points base + engagement + featured boost):
 * 1. On-page SEO completeness (30 points)
 *    - Meta title present: +10
 *    - Meta description present: +10
 *    - Alt text on images: +5
 *    - Structured data / valid schema: +5
 *
 * 2. Recency Soft Boost (20 points max, decay over 60 days)
 *
 * 3. Engagement & Conversion (30 points max)
 *    - Page views, add-to-cart, orders
 *
 * 4. Admin Featured / Boost (20 points)
 */
export function calculateSeoScore(factors: SeoSignalFactors): number {
  let score = 0;

  // 1. On-Page SEO Completeness (Max 30 pts)
  if (factors.hasMetaTitle) score += 10;
  if (factors.hasMetaDescription) score += 10;
  if (factors.hasAltText) score += 5;
  if (factors.hasStructuredData) score += 5;

  // 2. Recency Soft Boost (Max 20 pts)
  const now = new Date().getTime();
  const created = new Date(factors.createdAt).getTime();
  const daysOld = Math.max(0, (now - created) / (1000 * 60 * 60 * 24));
  const recencyBoost = Math.max(0, 20 * (1 - daysOld / 60)); // linear decay over 60 days
  score += recencyBoost;

  // 3. Engagement & Conversion Signals (Max 30 pts)
  const views = factors.viewsCount || 0;
  const cartAdds = factors.cartAddCount || 0;
  const orders = factors.ordersCount || 0;

  const viewsPoints = Math.min(10, views * 0.1);
  const cartPoints = Math.min(10, cartAdds * 0.5);
  const orderPoints = Math.min(10, orders * 2.0);
  score += viewsPoints + cartPoints + orderPoints;

  // 4. Admin Featured Boost (20 pts)
  if (factors.isFeatured) {
    score += 20;
  }

  return Math.round(score * 10) / 10;
}

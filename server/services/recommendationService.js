/**
 * Enterprise Product Recommendation Engine Service
 * Implements Content-Based Filtering, Frequently Bought Together co-occurrence,
 * and Trending item recommendations.
 */

export class RecommendationEngine {
  /**
   * Get personalized or contextual product recommendations
   */
  static getRecommendations(options = {}) {
    const {
      productId = null,
      products = [],
      orders = [],
      limit = 6,
      category = null,
    } = options;

    if (!products || products.length === 0) return [];

    // Scenario 1: Similar & Frequently Bought Together for a specific product
    if (productId) {
      const targetProduct = products.find(p => String(p.id) === String(productId));
      if (!targetProduct) return products.slice(0, limit);

      // 1A. Co-occurrence analysis (Frequently Bought Together from orders)
      const coOccurrenceCounts = new Map();
      if (orders && orders.length > 0) {
        for (const order of orders) {
          const items = order.items || order.order_items || [];
          const hasTarget = items.some(item => String(item.product_id || item.id) === String(productId));
          if (hasTarget) {
            for (const item of items) {
              const itemPId = String(item.product_id || item.id);
              if (itemPId !== String(productId)) {
                coOccurrenceCounts.set(itemPId, (coOccurrenceCounts.get(itemPId) || 0) + 1);
              }
            }
          }
        }
      }

      // 1B. Content-based similarity scoring
      const candidateScores = products
        .filter(p => String(p.id) !== String(productId))
        .map(candidate => {
          let score = 0;

          // Category match boost (+15)
          const targetCat = String(targetProduct.category || targetProduct.category_id || '');
          const candCat = String(candidate.category || candidate.category_id || '');
          if (targetCat && targetCat === candCat) {
            score += 15;
          }

          // Price proximity boost (+10 max)
          const targetPrice = parseFloat(targetProduct.price || 0);
          const candPrice = parseFloat(candidate.price || 0);
          if (targetPrice > 0 && candPrice > 0) {
            const priceDiff = Math.abs(targetPrice - candPrice);
            const priceRatio = priceDiff / targetPrice;
            if (priceRatio < 0.3) score += (1 - priceRatio) * 10;
          }

          // Frequently bought together boost (+20 per order match)
          const coCount = coOccurrenceCounts.get(String(candidate.id)) || 0;
          score += coCount * 20;

          // Rating boost (+ rating)
          score += parseFloat(candidate.rating || 4.0);

          return { product: candidate, score };
        });

      candidateScores.sort((a, b) => b.score - a.score);
      return candidateScores.slice(0, limit).map(c => c.product);
    }

    // Scenario 2: Category-specific top items
    if (category) {
      const categoryFiltered = products.filter(
        p => String(p.category || p.category_id).toLowerCase() === String(category).toLowerCase()
      );
      categoryFiltered.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
      return categoryFiltered.slice(0, limit);
    }

    // Scenario 3: General Trending / Popular items
    const trending = [...products];
    trending.sort((a, b) => {
      const ratingA = parseFloat(a.rating || 4.5);
      const ratingB = parseFloat(b.rating || 4.5);
      const reviewsA = parseInt(a.reviews_count || a.review_count || 10, 10);
      const reviewsB = parseInt(b.reviews_count || b.review_count || 10, 10);
      return (ratingB * reviewsB) - (ratingA * reviewsA);
    });

    return trending.slice(0, limit);
  }
}

export default RecommendationEngine;

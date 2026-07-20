/**
 * Advanced Elasticsearch-Style Search Engine Service
 * Implements tokenization, fuzzy term weighting, field-specific scoring,
 * faceted filtering, auto-complete suggestions, and dynamic sorting.
 */

export class SearchEngine {
  /**
   * Tokenize text into normalized lower-case search tokens
   */
  static tokenize(text = '') {
    if (!text) return [];
    return String(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 0);
  }

  /**
   * Calculate fuzzy similarity / inclusion score between query tokens and product fields
   */
  static scoreProduct(product, queryTokens) {
    if (!queryTokens || queryTokens.length === 0) return 1;

    const titleTokens = this.tokenize(product.name || product.title || '');
    const descTokens = this.tokenize(product.description || '');
    const categoryTokens = this.tokenize(product.category || product.category_id || '');
    const tagTokens = (product.tags || []).flatMap(t => this.tokenize(t));
    const brandTokens = this.tokenize(product.brand || '');

    let score = 0;
    let matchedTokens = 0;

    for (const qToken of queryTokens) {
      let tokenMatched = false;

      // 1. Exact or prefix match in Title (Weight: 10)
      if (titleTokens.some(t => t.includes(qToken))) {
        score += titleTokens.some(t => t === qToken) ? 10 : 6;
        tokenMatched = true;
      }

      // 2. Brand match (Weight: 8)
      if (brandTokens.some(b => b.includes(qToken))) {
        score += 8;
        tokenMatched = true;
      }

      // 3. Tag match (Weight: 5)
      if (tagTokens.some(t => t.includes(qToken))) {
        score += 5;
        tokenMatched = true;
      }

      // 4. Category match (Weight: 4)
      if (categoryTokens.some(c => c.includes(qToken))) {
        score += 4;
        tokenMatched = true;
      }

      // 5. Description match (Weight: 2)
      if (descTokens.some(d => d.includes(qToken))) {
        score += 2;
        tokenMatched = true;
      }

      if (tokenMatched) matchedTokens++;
    }

    // Require at least one matching token
    if (matchedTokens === 0) return 0;

    // Boost score if all query tokens match
    const coverageMultiplier = matchedTokens / queryTokens.length;
    return score * coverageMultiplier;
  }

  /**
   * Execute full multi-faceted search query against dataset
   */
  static search(products = [], options = {}) {
    const {
      q = '',
      category = 'all',
      minPrice = 0,
      maxPrice = Infinity,
      minRating = 0,
      inStock = false,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
    } = options;

    const queryTokens = this.tokenize(q);

    // Step 1: Filter & Score
    const scoredList = [];
    for (const product of products) {
      // Category filter
      if (category && category !== 'all') {
        const prodCat = String(product.category || product.category_id || '').toLowerCase();
        if (prodCat !== String(category).toLowerCase()) continue;
      }

      // Price filter
      const price = parseFloat(product.price || 0);
      if (price < parseFloat(minPrice) || price > parseFloat(maxPrice)) continue;

      // Rating filter
      const rating = parseFloat(product.rating || 4.5);
      if (rating < parseFloat(minRating)) continue;

      // In-stock filter
      const stock = parseInt(product.stock || product.inventory || 0, 10);
      if (inStock && stock <= 0) continue;

      // Calculate relevancy score
      const relevanceScore = this.scoreProduct(product, queryTokens);
      if (queryTokens.length > 0 && relevanceScore <= 0) continue;

      scoredList.push({
        product,
        score: relevanceScore,
      });
    }

    // Step 2: Sort
    scoredList.sort((a, b) => {
      if (sortBy === 'price_asc') return (a.product.price || 0) - (b.product.price || 0);
      if (sortBy === 'price_desc') return (b.product.price || 0) - (a.product.price || 0);
      if (sortBy === 'rating') return (b.product.rating || 0) - (a.product.rating || 0);
      if (sortBy === 'newest') return new Date(b.product.created_at || 0) - new Date(a.product.created_at || 0);
      // Default: relevance
      return b.score - a.score;
    });

    const totalHits = scoredList.length;
    const startIndex = (page - 1) * limit;
    const paginated = scoredList.slice(startIndex, startIndex + limit).map(item => item.product);

    // Step 3: Compute Facets
    const facets = {
      categories: {},
      priceRanges: {
        'under_50': 0,
        '50_to_100': 0,
        '100_to_500': 0,
        'over_500': 0,
      },
      inStockCount: 0,
    };

    for (const item of scoredList) {
      const p = item.product;
      const cat = p.category || p.category_id || 'uncategorized';
      facets.categories[cat] = (facets.categories[cat] || 0) + 1;

      const pr = parseFloat(p.price || 0);
      if (pr < 50) facets.priceRanges['under_50']++;
      else if (pr <= 100) facets.priceRanges['50_to_100']++;
      else if (pr <= 500) facets.priceRanges['100_to_500']++;
      else facets.priceRanges['over_500']++;

      const st = parseInt(p.stock || p.inventory || 0, 10);
      if (st > 0) facets.inStockCount++;
    }

    return {
      hits: paginated,
      total: totalHits,
      page: Number(page),
      totalPages: Math.ceil(totalHits / limit) || 1,
      facets,
      query: q,
    };
  }

  /**
   * Fast auto-complete suggestions endpoint
   */
  static suggest(products = [], query = '', limit = 5) {
    const tokens = this.tokenize(query);
    if (!tokens || tokens.length === 0) return [];

    const suggestions = [];
    for (const p of products) {
      const score = this.scoreProduct(p, tokens);
      if (score > 0) {
        suggestions.push({
          id: p.id,
          name: p.name || p.title,
          category: p.category || p.category_id,
          price: p.price,
          image_url: p.image_url || (p.images && p.images[0]),
          score,
        });
      }
    }

    suggestions.sort((a, b) => b.score - a.score);
    return suggestions.slice(0, limit);
  }
}

export default SearchEngine;

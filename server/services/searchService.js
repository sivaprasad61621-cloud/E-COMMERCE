const SEARCH_STOP_WORDS = new Set([
  'under', 'below', 'above', 'over', 'less', 'than', 'more', 'with', 'for', 'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'at', 
  'is', 'are', 'show', 'me', 'find', 'get', 'buy', 'item', 'items', 'product', 'products', 'give', 'list', 'please'
]);

const SYNONYMS_MAP = {
  'laptop': ['laptop', 'laptops', 'macbook', 'ultrabook', 'vivobook', 'ideapad', 'inspiron', 'pavilion'],
  'laptops': ['laptop', 'laptops', 'macbook', 'ultrabook', 'vivobook', 'ideapad', 'inspiron', 'pavilion'],
  'phone': ['phone', 'phones', 'mobile', 'mobiles', 'iphone', 'galaxy', 'pixel', 'smartphone'],
  'phones': ['phone', 'phones', 'mobile', 'mobiles', 'iphone', 'galaxy', 'pixel', 'smartphone'],
  'mobile': ['phone', 'phones', 'mobile', 'mobiles', 'iphone', 'galaxy', 'pixel', 'smartphone'],
  'mobiles': ['phone', 'phones', 'mobile', 'mobiles', 'iphone', 'galaxy', 'pixel', 'smartphone'],
  'headphone': ['headphone', 'headphones', 'earphone', 'earbuds', 'airpods', 'headset', 'audio'],
  'headphones': ['headphone', 'headphones', 'earphone', 'earbuds', 'airpods', 'headset', 'audio'],
  'shoe': ['shoe', 'shoes', 'sneaker', 'sneakers', 'footwear'],
  'shoes': ['shoe', 'shoes', 'sneaker', 'sneakers', 'footwear'],
  'watch': ['watch', 'watches', 'smartwatch'],
  'watches': ['watch', 'watches', 'smartwatch'],
  'bag': ['bag', 'bags', 'backpack', 'luggage', 'carry-on'],
  'bags': ['bag', 'bags', 'backpack', 'luggage', 'carry-on'],
  'dress': ['dress', 'dresses', 'fleece', 'sweater', 'shirt', 'clothing', 'apparel'],
  'dresses': ['dress', 'dresses', 'fleece', 'sweater', 'shirt', 'clothing', 'apparel'],
  'tv': ['tv', 'monitor', 'display', 'screen']
};

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

    const queryStr = queryTokens.join(' ').toLowerCase();
    const titleLower = String(product.name || product.title || '').toLowerCase();

    // 1. Accessory Exclusion Rule: If user asks for "laptop/laptops" without asking for bags/cases, exclude bags/backpacks
    const isLaptopQuery = queryTokens.some(t => ['laptop', 'laptops', 'macbook', 'ultrabook'].includes(t));
    const isBagQuery = queryTokens.some(t => ['bag', 'backpack', 'sleeve', 'case', 'cover', 'pack', 'luggage', 'pouch', 'tote', 'skin'].includes(t));
    if (isLaptopQuery && !isBagQuery) {
      const isAccessoryProduct = ['backpack', 'pack', 'luggage', 'sleeve', 'case', 'bag', 'pouch', 'tote', 'skin', 'stand', 'mount', 'cleaner'].some(acc => titleLower.includes(acc));
      if (isAccessoryProduct) return 0;
    }

    // 2. Accessory Exclusion Rule: If user asks for "phone/mobile" without asking for cases/chargers, exclude phone cases/chargers
    const isPhoneQuery = queryTokens.some(t => ['phone', 'phones', 'mobile', 'iphone', 'smartphone'].includes(t));
    const isPhoneAccQuery = queryTokens.some(t => ['case', 'cover', 'charger', 'cable', 'protector', 'holder', 'mount', 'skin'].includes(t));
    if (isPhoneQuery && !isPhoneAccQuery) {
      const isPhoneAccProduct = ['case', 'cover', 'screen protector', 'tempered glass', 'cable', 'charger', 'mount', 'holder'].some(acc => titleLower.includes(acc));
      if (isPhoneAccProduct) return 0;
    }

    const titleTokens = this.tokenize(product.name || product.title || '');
    const descTokens = this.tokenize(product.description || '');
    const categoryTokens = this.tokenize(product.category || product.category_id || '');
    const tagTokens = (product.tags || []).flatMap(t => this.tokenize(t));
    const brandTokens = this.tokenize(product.brand || '');

    let score = 0;
    let matchedTokens = 0;

    for (const qToken of queryTokens) {
      if (SEARCH_STOP_WORDS.has(qToken) && queryTokens.length > 1) {
        continue; // Skip preposition/stop words unless single-word query
      }

      // Check synonyms
      const synonymList = SYNONYMS_MAP[qToken] || [qToken];
      let tokenMatched = false;

      for (const syn of synonymList) {
        // 1. Exact or prefix match in Title (Weight: 20)
        if (titleTokens.some(t => t.includes(syn))) {
          score += titleTokens.some(t => t === syn) ? 20 : 12;
          tokenMatched = true;
          break;
        }

        // 2. Category match (Weight: 15)
        if (categoryTokens.some(c => c.includes(syn))) {
          score += 15;
          tokenMatched = true;
          break;
        }

        // 3. Brand match (Weight: 8)
        if (brandTokens.some(b => b.includes(syn))) {
          score += 8;
          tokenMatched = true;
          break;
        }

        // 4. Tag match (Weight: 5)
        if (tagTokens.some(t => t.includes(syn))) {
          score += 5;
          tokenMatched = true;
          break;
        }

        // 5. Description match (Weight: 1 - weak penalty to prevent accessory false positives)
        if (descTokens.some(d => d.includes(syn))) {
          score += 1;
          tokenMatched = true;
          break;
        }
      }

      if (tokenMatched) matchedTokens++;
    }

    const effectiveQueryTokens = queryTokens.filter(t => !SEARCH_STOP_WORDS.has(t) || queryTokens.length === 1);
    if (effectiveQueryTokens.length === 0) return 1;

    // Require at least one matching meaningful token
    if (matchedTokens === 0) return 0;

    // Boost score if all effective query tokens match
    const coverageMultiplier = matchedTokens / effectiveQueryTokens.length;
    return score * coverageMultiplier;
  }

  /**
   * Execute full multi-faceted search query against dataset
   */
  static search(products = [], options = {}) {
    let {
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

    let cleanQuery = q;

    // Natural Language Price Parsing (e.g. "laptops under 60000", "below 50000")
    if (q) {
      const maxMatch = q.match(/(?:under|below|less\s+than)\s*(?:rs\.?|₹)?\s*(\d+)/i);
      if (maxMatch) {
        maxPrice = parseFloat(maxMatch[1]);
        cleanQuery = cleanQuery.replace(maxMatch[0], '').trim();
      }

      const minMatch = q.match(/(?:above|over|more\s+than|greater\s+than)\s*(?:rs\.?|₹)?\s*(\d+)/i);
      if (minMatch) {
        minPrice = parseFloat(minMatch[1]);
        cleanQuery = cleanQuery.replace(minMatch[0], '').trim();
      }
    }

    const queryTokens = this.tokenize(cleanQuery);

    // Step 1: Filter & Score
    const scoredList = [];
    for (const product of products) {
      // Category filter
      if (category && category !== 'all') {
        const prodCat = String(product.category || product.category_id || '').toLowerCase();
        if (prodCat !== String(category).toLowerCase()) continue;
      }

      // Calculate effective discounted price
      const basePrice = parseFloat(product.price || 0);
      const discount = parseFloat(product.discount || 0);
      const effectivePrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;

      // Price filter against effective price
      if (effectivePrice < parseFloat(minPrice) || effectivePrice > parseFloat(maxPrice)) continue;

      // Rating filter
      const rating = parseFloat(product.rating || 4.5);
      if (rating < parseFloat(minRating)) continue;

      // In-stock filter
      const stock = parseInt(product.stock || product.inventory || 0, 10);
      if (inStock && stock <= 0) continue;

      // Calculate relevancy score
      const relevanceScore = this.scoreProduct(product, queryTokens);
      const minScoreThreshold = queryTokens.length > 0 ? 4 : 0;
      if (queryTokens.length > 0 && relevanceScore < minScoreThreshold) continue;

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

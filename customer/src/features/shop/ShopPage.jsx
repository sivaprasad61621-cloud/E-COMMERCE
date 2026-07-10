import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import {
  ChevronRight, Search, SlidersHorizontal, Heart, Star,
  ShoppingBag, ArrowLeft, Laptop, Shirt, Home, Sparkles,
  BookOpen, Dumbbell, Zap
} from 'lucide-react';


const API = 'http://localhost:5000/api';

const categoryIcons = {
  electronics: Laptop,
  'fashion & apparel': Shirt,
  fashion: Shirt,
  'home & kitchen': Home,
  'beauty & health': Sparkles,
  'beauty & personal care': Sparkles,
  'books & stationery': BookOpen,
  'sports & outdoors': Dumbbell,
  bags: ShoppingBag,
};
const getCategoryIcon = (name = '') => {
  const key = name.toLowerCase();
  for (const [k, Icon] of Object.entries(categoryIcons)) {
    if (key.includes(k)) return Icon;
  }
  return Dumbbell;
};

export const ShopPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const wishlistItems = useSelector(state => state.wishlist.items);
  const isWishlisted = (id) => wishlistItems.some(item => item.id === id);

  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlSort = searchParams.get('sort') || '';
  const urlFilter = searchParams.get('filter') || '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(urlSearch);
  const [addedIds, setAddedIds] = useState({});

  const pageTitle = urlFilter === 'deals' ? "Today's Deals"
    : urlFilter === 'offers' ? 'Special Offers'
    : urlSort === 'new' ? 'New Arrivals'
    : urlSort === 'best_sellers' ? 'Best Sellers'
    : urlCategory ? urlCategory
    : urlSearch ? `Results for "${urlSearch}"`
    : 'All Products';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const catRes = await fetch(`${API}/categories`);
      if (catRes.ok) {
        const d = await catRes.json();
        setCategories(Array.isArray(d) ? d : (d.data || []));
      }

      let url = `${API}/products?status=active&limit=50`;
      if (urlSearch) url += `&search=${encodeURIComponent(urlSearch)}`;
      if (urlCategory) {
        const catRes2 = await fetch(`${API}/categories`);
        if (catRes2.ok) {
          const d = await catRes2.json();
          const cats = Array.isArray(d) ? d : (d.data || []);
          const matched = cats.find(c => c.slug === urlCategory || c.name.toLowerCase() === urlCategory.toLowerCase());
          if (matched) url += `&category_id=${matched.id}`;
        }
      }

      const res = await fetch(url);
      if (res.ok) {
        const d = await res.json();
        let prods = Array.isArray(d) ? d : (d.data || []);

        if (urlFilter === 'deals' || urlFilter === 'offers') {
          prods = prods.filter(p => parseFloat(p.discount || 0) > 0);
        }
        if (urlSort === 'new') {
          prods = prods.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        if (urlSort === 'best_sellers') {
          prods = prods.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        }
        if (urlSort === 'price_asc') {
          prods = prods.sort((a, b) => {
            const finalA = parseFloat(a.price) * (1 - parseFloat(a.discount || 0) / 100);
            const finalB = parseFloat(b.price) * (1 - parseFloat(b.discount || 0) / 100);
            return finalA - finalB;
          });
        }
        if (urlSort === 'price_desc') {
          prods = prods.sort((a, b) => {
            const finalA = parseFloat(a.price) * (1 - parseFloat(a.discount || 0) / 100);
            const finalB = parseFloat(b.price) * (1 - parseFloat(b.discount || 0) / 100);
            return finalB - finalA;
          });
        }
        if (urlSort === 'discount_desc') {
          prods = prods.sort((a, b) => parseFloat(b.discount || 0) - parseFloat(a.discount || 0));
        }
        setProducts(prods);
      }
    } catch (err) {
      console.warn('API unavailable, using fallback', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [urlSearch, urlCategory, urlFilter, urlSort]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearch.trim()) setSearchParams({ search: localSearch.trim() });
    else setSearchParams({});
  };

  const handleCategoryClick = (cat) => {
    setSearchParams({ category: cat.slug || cat.name });
  };

  const handleAddToCart = (e, p) => {
    e.stopPropagation();
    dispatch(addToCart(p));
    setAddedIds(prev => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [p.id]: false })), 1500);
  };

  const handleBuyNow = (e, p) => {
    e.stopPropagation();
    // Navigate to checkout with just this product — bypasses cart
    navigate('/checkout', {
      state: {
        buyNowItem: {
          id: p.id,
          name: p.name,
          price: parseFloat(p.price),
          discount: parseFloat(p.discount || 0),
          image: p.images?.[0] || '',
          sku: p.sku || '',
          quantity: 1
        }
      }
    });
  };

  const finalPrice = (p) => parseFloat(p.price) * (1 - parseFloat(p.discount || 0) / 100);

  return (
    <div className="space-y-6 animate-fadeIn text-[#2F2F2F]">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#2F2F2F]/10 pb-5">
        <div>
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-[#7A756B] hover:text-[#2F2F2F] transition-colors cursor-pointer mb-2">
            <ArrowLeft size={12} /> Home
          </button>
          <h1 className="text-3xl font-serif font-bold tracking-wide">{pageTitle}</h1>
          <div className="flex items-center gap-4 mt-2">
            {!loading && <p className="text-xs text-[#7A756B]">{products.length} products found</p>}
            <div className="flex items-center gap-1.5 bg-[#FAF8F3] border border-[#2F2F2F]/10 px-2 py-1 rounded-sm">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#7A756B]">Sort:</span>
              <select
                value={urlSort}
                onChange={e => {
                  const nextParams = {};
                  searchParams.forEach((val, key) => { nextParams[key] = val; });
                  if (e.target.value) nextParams.sort = e.target.value;
                  else delete nextParams.sort;
                  setSearchParams(nextParams);
                }}
                className="bg-transparent text-[11px] font-bold text-[#2F2F2F] focus:outline-none cursor-pointer"
              >
                <option value="">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="discount_desc">Biggest Discount</option>
                <option value="new">New Arrivals</option>
                <option value="best_sellers">Best Sellers</option>
              </select>
            </div>
          </div>
        </div>
        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative w-72">
          <input
            type="text"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white border border-[#2F2F2F]/20 px-4 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm pr-9 text-[#2F2F2F] transition-all"
          />
          <button type="submit" className="absolute right-2.5 top-2 text-[#7A756B] hover:text-[#8B5E3C]">
            <Search size={15} />
          </button>
        </form>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar filters */}
        <div className="w-52 shrink-0 space-y-4">
          <div className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2F2F2F]/10">
              <SlidersHorizontal size={13} className="text-[#8B5E3C]" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#2F2F2F]">Categories</h3>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setSearchParams(urlSearch ? { search: urlSearch } : {})}
                className={`w-full text-left text-xs px-2 py-1.5 rounded-sm transition-colors ${!urlCategory ? 'text-[#8B5E3C] font-bold bg-[#8B5E3C]/10' : 'text-[#7A756B] hover:text-[#8B5E3C] hover:bg-[#2F2F2F]/5'}`}
              >
                All Products
              </button>
              {(() => {
                const parentCategories = categories.filter(c => !c.name.includes(' - '));
                const getSubcategories = (parentName) => {
                  const prefix = `${parentName} - `;
                  return categories.filter(c => c.name.startsWith(prefix));
                };

                return parentCategories.map(cat => {
                  const Icon = getCategoryIcon(cat.name);
                  const isParentActive = urlCategory === cat.slug || urlCategory === cat.name;
                  const subs = getSubcategories(cat.name);
                  const isAnySubActive = subs.some(sub => urlCategory === sub.slug || urlCategory === sub.name);
                  const isExpanded = isParentActive || isAnySubActive;

                  return (
                    <div key={cat.id} className="space-y-0.5">
                      <button
                        onClick={() => handleCategoryClick(cat)}
                        className={`w-full text-left text-xs px-2 py-1.5 rounded-sm transition-colors flex items-center justify-between group ${
                          isParentActive && !isAnySubActive
                            ? 'text-[#8B5E3C] font-bold bg-[#8B5E3C]/10'
                            : 'text-[#7A756B] hover:text-[#8B5E3C] hover:bg-[#2F2F2F]/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon size={12} className="text-[#8B5E3C]" />
                          <span>{cat.name}</span>
                        </span>
                        {subs.length > 0 && (
                          <ChevronRight 
                            size={10} 
                            className={`text-[#7A756B] group-hover:text-[#8B5E3C] transition-transform duration-300 ${
                              isExpanded ? 'rotate-90' : ''
                            }`} 
                          />
                        )}
                      </button>
                      
                      {isExpanded && subs.length > 0 && (
                        <div className="pl-3 border-l border-[#2F2F2F]/10 ml-3.5 space-y-0.5 py-1 animate-fadeIn">
                          {subs.map(sub => {
                            const isSubActive = urlCategory === sub.slug || urlCategory === sub.name;
                            const displayName = sub.name.split(' - ')[1] || sub.name;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => handleCategoryClick(sub)}
                                className={`w-full text-left text-[11px] px-2 py-1 rounded-sm transition-colors ${
                                  isSubActive
                                    ? 'text-[#8B5E3C] font-bold bg-[#8B5E3C]/10'
                                    : 'text-[#7A756B] hover:text-[#8B5E3C] hover:bg-[#2F2F2F]/5'
                                }`}
                              >
                                {displayName}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-4 space-y-1">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#2F2F2F] mb-3 pb-2 border-b border-[#2F2F2F]/10">Quick Filters</h3>
            {[
              { label: "Today's Deals", params: { filter: 'deals' } },
              { label: 'Special Offers', params: { filter: 'offers' } },
              { label: 'New Arrivals', params: { sort: 'new' } },
              { label: 'Best Sellers', params: { sort: 'best_sellers' } },
            ].map(({ label, params }) => (
              <button
                key={label}
                onClick={() => setSearchParams(params)}
                className="w-full text-left text-xs px-2 py-1.5 rounded-sm text-[#7A756B] hover:text-[#8B5E3C] hover:bg-[#2F2F2F]/5 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-4 animate-pulse">
                  <div className="aspect-square bg-[#2F2F2F]/10 rounded-sm mb-3"></div>
                  <div className="h-3 bg-[#2F2F2F]/10 rounded mb-2"></div>
                  <div className="h-2 bg-[#2F2F2F]/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <ShoppingBag size={40} className="text-[#7A756B]" strokeWidth={1.5} />
              <p className="text-sm font-semibold text-[#2F2F2F]">No products found</p>
              <p className="text-xs text-[#7A756B]">Try a different search or browse all categories.</p>
              <button onClick={() => setSearchParams({})} className="text-xs text-[#8B5E3C] font-bold hover:underline cursor-pointer">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-4 relative flex flex-col group hover:shadow-md hover:border-[#8B5E3C]/30 transition-all duration-300 cursor-pointer"
                >
                  <button
                    onClick={e => { e.stopPropagation(); dispatch(toggleWishlist(p)); }}
                    className="absolute top-3 right-3 text-[#7A756B] hover:text-red-500 transition-colors z-10 cursor-pointer"
                  >
                    <Heart size={14} fill={isWishlisted(p.id) ? "#EF4444" : "none"} className={isWishlisted(p.id) ? "text-red-500" : "text-[#7A756B]"} />
                  </button>
                  <div className="aspect-square bg-white border border-[#2F2F2F]/10 rounded-sm p-2 mb-3 overflow-hidden flex items-center justify-center">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
                      alt={p.name}
                      className="object-contain h-full group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'; }}
                    />
                  </div>
                  {p.category?.name && (
                    <span className="text-[9px] uppercase tracking-widest font-semibold text-[#8B5E3C] mb-1">{p.category.name}</span>
                  )}
                  <h4 className="text-xs font-bold text-[#2F2F2F] group-hover:text-[#8B5E3C] transition-colors leading-tight line-clamp-2 mb-1">{p.name}</h4>
                  <div className="flex items-baseline gap-1.5 mt-auto pt-2">
                    <span className="text-sm text-[#8B5E3C] font-bold">₹{finalPrice(p).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    {parseFloat(p.discount) > 0 && (
                      <span className="text-[9px] text-[#7A756B] line-through">₹{parseFloat(p.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    )}
                  </div>
                  <div className="flex gap-0.5 text-amber-500 mt-1 mb-2">
                    {[1,2,3,4,5].map(s => <Star key={s} size={9} fill="currentColor" />)}
                  </div>
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-1.5 mt-2">
                    <button
                      onClick={e => handleAddToCart(e, p)}
                      className={`w-full py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-sm transition-all border ${
                        addedIds[p.id] ? 'bg-green-700 text-white border-green-700' : 'border-[#2F2F2F]/20 text-[#2F2F2F] hover:bg-[#6C4E31] hover:text-white hover:border-[#6C4E31]'
                      }`}
                    >
                      {addedIds[p.id] ? '✓ Added' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={e => handleBuyNow(e, p)}
                      className="w-full py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-sm transition-all bg-[#8B5E3C] text-white hover:bg-[#6C4E31] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Zap size={10} fill="currentColor" /> Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

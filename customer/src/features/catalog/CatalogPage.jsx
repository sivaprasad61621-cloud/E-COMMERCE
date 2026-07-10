import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { 
  ChevronRight, Laptop, Shirt, Home, Sparkles, BookOpen, 
  Compass, Dumbbell, Award, Shield, 
  RefreshCw, Headphones, Heart, Star, ShoppingBag, Search as SearchIcon
} from 'lucide-react';

const API = 'http://localhost:5000/api';

// Icon map for categories
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
  shoes: Compass,
  jewellery: Sparkles,
};

const getCategoryIcon = (name = '') => {
  const key = name.toLowerCase();
  for (const [k, Icon] of Object.entries(categoryIcons)) {
    if (key.includes(k)) return Icon;
  }
  return Compass;
};

export const CatalogPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const wishlistItems = useSelector(state => state.wishlist.items);
  const isWishlisted = (id) => wishlistItems.some(item => item.id === id);

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  // Countdown timer state for Deal of the Day
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 34, seconds: 22 });

  // Data states
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [dealProduct, setDealProduct] = useState(null);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState({});

  // Slideshow States & Data
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: (
        <>
          Simple Choices. <br />
          Smart Shopping.
        </>
      ),
      subtitle: "Discover quality products handpicked for you.",
      image: "/vintage_hero_banner.png",
      buttonText: "Shop Now",
      action: () => document.getElementById('best-sellers-section')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 2,
      title: (
        <>
          Elevate Your Space. <br />
          Modern Living.
        </>
      ),
      subtitle: "Explore our premium home & kitchen collection.",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
      buttonText: "Explore Decor",
      action: () => navigate("/shop?category=home-kitchen")
    },
    {
      id: 3,
      title: (
        <>
          Next-Gen Tech. <br />
          Uncompromising Power.
        </>
      ),
      subtitle: "Upgrade your workflow with premium electronics.",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
      buttonText: "Browse Tech",
      action: () => navigate("/shop?category=electronics")
    },
    {
      id: 4,
      title: (
        <>
          Timeless Fashion. <br />
          Define Your Style.
        </>
      ),
      subtitle: "Curated wardrobe essentials for every season.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      buttonText: "View Collection",
      action: () => navigate("/shop?category=fashion")
    }
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 34, seconds: 22 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (num) => String(num).padStart(2, '0');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch categories
      const catRes = await fetch(`${API}/categories`);
      let cats = [];
      if (catRes.ok) {
        const catData = await catRes.json();
        cats = Array.isArray(catData) ? catData : (catData.data || []);
        setCategories(cats);
        setTopCategories(cats.slice(0, 6));
      }

      // 2. Build product query with optional filters
      let productUrl = `${API}/products?status=active&limit=50`;
      if (categoryFilter) {
        const matched = cats.find(c => c.slug === categoryFilter || c.name.toLowerCase() === categoryFilter.toLowerCase());
        if (matched) productUrl += `&category_id=${matched.id}`;
      }
      if (searchQuery) {
        productUrl += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const prodRes = await fetch(productUrl);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        const products = Array.isArray(prodData) ? prodData : (prodData.data || []);

        // Use first 4 as best sellers
        setBestSellers(products.slice(0, 4).map(p => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price) * (1 - parseFloat(p.discount || 0) / 100),
          originalPrice: parseFloat(p.price),
          discount: parseFloat(p.discount || 0),
          rating: 5,
          reviews: Math.floor(Math.random() * 150) + 50,
          image: p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
          rawProduct: p,
        })));

        // Use last product as deal of the day
        if (products.length > 4) {
          const d = products[products.length - 1];
          setDealProduct({
            id: d.id,
            name: d.name,
            price: parseFloat(d.price) * (1 - parseFloat(d.discount || 0) / 100),
            originalPrice: parseFloat(d.price),
            discount: parseFloat(d.discount || 0),
            image: d.images?.[0] || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
          });
        }
      }
    } catch (err) {
      console.warn('API unavailable, using fallback data', err);
      // Fallback static data
      setCategories([
        { id: 'cat-1', name: 'Electronics', slug: 'electronics' },
        { id: 'cat-2', name: 'Fashion & Apparel', slug: 'fashion-apparel' },
        { id: 'cat-3', name: 'Home & Kitchen', slug: 'home-kitchen' },
        { id: 'cat-4', name: 'Beauty & Health', slug: 'beauty-health' },
        { id: 'cat-5', name: 'Sports & Outdoors', slug: 'sports-outdoors' },
        { id: 'cat-6', name: 'Books & Stationery', slug: 'books-stationery' },
      ]);
      const fallback = [
        { id: 'prod-mock-1', name: 'Wireless Headphones', price: 1799, originalPrice: 3499, discount: 49, rating: 5, reviews: 98, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600' },
        { id: 'prod-mock-2', name: 'Vitamin C Glow Serum', price: 1104, originalPrice: 1299, discount: 15, rating: 5, reviews: 112, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600' },
        { id: 'prod-mock-3', name: 'Non-Slip Yoga Mat', price: 1439, originalPrice: 1799, discount: 20, rating: 5, reviews: 85, image: 'https://images.unsplash.com/photo-1601925228008-0f4b1ebc9c39?q=80&w=600' },
        { id: 'prod-mock-4', name: 'Vintage Leather Journal', price: 1169, originalPrice: 1299, discount: 10, rating: 5, reviews: 64, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600' },
      ];
      setBestSellers(fallback);
      setTopCategories([
        { id: 'cat-1', name: 'Electronics', slug: 'electronics' },
        { id: 'cat-2', name: 'Fashion & Apparel', slug: 'fashion-apparel' },
        { id: 'cat-3', name: 'Home & Kitchen', slug: 'home-kitchen' },
        { id: 'cat-4', name: 'Beauty & Health', slug: 'beauty-health' },
        { id: 'cat-5', name: 'Sports & Outdoors', slug: 'sports-outdoors' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCategoryClick = (cat) => {
    navigate(`/?category=${encodeURIComponent(cat.slug || cat.name)}`);
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    if (item.rawProduct) {
      dispatch(addToCart(item.rawProduct));
    } else {
      dispatch(addToCart({
        id: item.id,
        name: item.name,
        price: item.originalPrice || item.price,
        discount: item.discount || 0,
        sku: item.id,
        images: [item.image],
      }));
    }
    setAddedIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [item.id]: false })), 1500);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F] select-none">

      {/* Search result banner */}
      {(searchQuery || categoryFilter) && (
        <div className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-[#7A756B] font-sans">
            {searchQuery && <><SearchIcon size={12} className="inline mr-1" />Results for <strong className="text-[#2F2F2F]">"{searchQuery}"</strong></>}
            {categoryFilter && !searchQuery && <>Showing <strong className="text-[#2F2F2F]">{categoryFilter}</strong> products</>}
          </span>
          <button
            onClick={() => navigate('/')}
            className="text-[10px] text-[#8B5E3C] font-bold uppercase tracking-wider hover:underline cursor-pointer"
          >
            Clear Filter ×
          </button>
        </div>
      )}

      {/* 1. Category Sidebar and Hero Banner Row */}
      <div className="flex gap-8 items-stretch">
        {/* Left category list sidebar */}
        <div className="w-[240px] shrink-0 bg-[#FAF8F3] border border-[#2F2F2F]/15 flex flex-col justify-between p-2 rounded-sm select-none">
          <div className="divide-y divide-[#2F2F2F]/10">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.name);
              const isSelected = categoryFilter && (cat.slug === categoryFilter || cat.name.toLowerCase() === categoryFilter.toLowerCase());
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex items-center justify-between px-3 py-2.5 text-xs cursor-pointer transition-colors ${isSelected ? 'bg-[#8B5E3C]/10 text-[#8B5E3C] font-bold' : 'text-[#2F2F2F] hover:text-[#8B5E3C] hover:bg-[#2F2F2F]/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={14} className={isSelected ? 'text-[#8B5E3C]' : 'text-[#8B5E3C]'} />
                    <span className="font-semibold">{cat.name}</span>
                  </div>
                  <ChevronRight size={12} className="text-[#2F2F2F]/30" />
                </div>
              );
            })}
          </div>
          <div
            onClick={() => navigate('/shop')}
            className="border-t border-[#2F2F2F]/15 p-3 flex items-center justify-between text-xs font-bold text-[#8B5E3C] hover:text-[#2F2F2F] cursor-pointer transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight size={13} />
          </div>
        </div>

        {/* Hero banner section */}
        <div className="flex-1 bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm relative overflow-hidden flex flex-col lg:flex-row items-center justify-between">
          <div key={currentSlide} className="flex flex-col lg:flex-row items-center justify-between w-full h-full animate-fadeIn">
            <div className="p-8 lg:p-12 space-y-6 max-w-lg z-10 flex-1">
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-serif leading-tight font-extrabold tracking-wide">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-sm text-[#7A756B] leading-relaxed">
                  {slides[currentSlide].subtitle}
                </p>
              </div>
              <button
                onClick={slides[currentSlide].action}
                className="bg-[#6C4E31] hover:bg-[#8B5E3C] text-white px-8 py-3 text-xs uppercase tracking-widest font-bold rounded-sm transition-all duration-300 shadow-sm cursor-pointer"
              >
                {slides[currentSlide].buttonText}
              </button>
              <div className="flex gap-2 pt-6">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                    className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                      currentSlide === idx ? 'bg-[#2F2F2F]' : 'bg-[#2F2F2F]/20 hover:bg-[#2F2F2F]/50'
                    }`}
                  ></span>
                ))}
              </div>
            </div>
            <div className="relative w-full lg:w-1/2 h-[380px] lg:h-auto self-stretch select-none shrink-0 border-l border-[#2F2F2F]/15">
              <img
                src={slides[currentSlide].image}
                alt="Velora Hero Banner"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Features Highlights Bar */}
      <div className="bg-[#FAF8F3] border border-[#2F2F2F]/15 py-5 px-8 rounded-sm grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-[#2F2F2F]/10">
        <div className="flex items-center justify-center md:justify-start gap-4 p-2 md:p-0">
          <div className="w-10 h-10 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C] shrink-0">
            <Award size={18} />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#2F2F2F]">Free Delivery</h4>
            <p className="text-[10px] text-[#7A756B] mt-0.5">On orders above ₹499</p>
          </div>
        </div>
        <div className="flex items-center justify-center md:justify-start gap-4 pt-4 md:pt-0 md:pl-6">
          <div className="w-10 h-10 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C] shrink-0">
            <Shield size={18} />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#2F2F2F]">Secure Payment</h4>
            <p className="text-[10px] text-[#7A756B] mt-0.5">100% secure payments</p>
          </div>
        </div>
        <div className="flex items-center justify-center md:justify-start gap-4 pt-4 md:pt-0 md:pl-6">
          <div className="w-10 h-10 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C] shrink-0">
            <RefreshCw size={16} />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#2F2F2F]">Easy Returns</h4>
            <p className="text-[10px] text-[#7A756B] mt-0.5">7 days return policy</p>
          </div>
        </div>
        <div className="flex items-center justify-center md:justify-start gap-4 pt-4 md:pt-0 md:pl-6">
          <div className="w-10 h-10 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C] shrink-0">
            <Headphones size={18} />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#2F2F2F]">24/7 Support</h4>
            <p className="text-[10px] text-[#7A756B] mt-0.5">Always here to help</p>
          </div>
        </div>
      </div>

      {/* 3. Lower Grid Showcase */}
      <div id="best-sellers-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* A. Deal of the Day (Left: 3/12 cols) */}
        <div className="lg:col-span-3 bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-6 flex flex-col items-center text-center space-y-6">
          <div className="w-full flex justify-between items-center border-b border-[#2F2F2F]/10 pb-3">
            <h3 className="text-sm uppercase tracking-widest font-extrabold text-[#2F2F2F]">Deal of the Day</h3>
          </div>

          {/* Countdown Clock */}
          <div className="flex gap-2">
            {[{ label: 'Hours', val: timeLeft.hours }, { label: 'Mins', val: timeLeft.minutes }, { label: 'Secs', val: timeLeft.seconds }].map(({ label, val }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-10 h-10 border border-[#2F2F2F]/20 flex items-center justify-center font-mono text-base font-bold bg-white rounded-sm">
                  {formatTime(val)}
                </div>
                <span className="text-[8px] uppercase tracking-wider text-[#7A756B] mt-1">{label}</span>
              </div>
            ))}
          </div>

          {/* Deal product image */}
          <div
            onClick={() => dealProduct && navigate(`/product/${dealProduct.id}`)}
            className={`w-36 h-36 bg-white border border-[#2F2F2F]/10 p-2 overflow-hidden flex items-center justify-center ${dealProduct ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
          >
            <img
              src={dealProduct?.image || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600'}
              alt={dealProduct?.name || 'Deal Product'}
              className="object-contain h-full"
            />
          </div>

          {/* Deal Info */}
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-bold text-[#2F2F2F]">{dealProduct?.name || 'Analog Watch'}</h4>
            <div className="flex justify-center items-baseline gap-2 pt-1">
              <span className="text-[#8B5E3C] text-lg font-bold">₹{(dealProduct?.price || 1299).toLocaleString('en-IN')}</span>
              <span className="text-xs text-[#7A756B] line-through">₹{(dealProduct?.originalPrice || 2499).toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8B5E3C]">
              {dealProduct?.discount || 48}% OFF
            </div>
          </div>

          <button
            onClick={() => dealProduct && navigate(`/product/${dealProduct.id}`)}
            className="w-full bg-[#6C4E31] hover:bg-[#8B5E3C] text-white py-2.5 text-xs uppercase tracking-widest font-bold rounded-sm transition-colors cursor-pointer"
          >
            Shop Now
          </button>
        </div>

        {/* B. Best Sellers Grid (Center: 6/12 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#2F2F2F]/10 pb-3">
            <h3 className="text-sm uppercase tracking-widest font-extrabold text-[#2F2F2F] cursor-pointer hover:text-[#8B5E3C] transition-colors" onClick={() => navigate('/shop?sort=best_sellers')}>Best Sellers</h3>
            <span
              onClick={() => navigate('/shop?sort=best_sellers')}
              className="text-xs font-bold text-[#8B5E3C] hover:text-[#2F2F2F] cursor-pointer transition-colors flex items-center gap-1"
            >
              View All <ChevronRight size={13} />
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-4 animate-pulse">
                  <div className="aspect-square bg-[#2F2F2F]/10 rounded-sm mb-3"></div>
                  <div className="h-3 bg-[#2F2F2F]/10 rounded mb-2"></div>
                  <div className="h-2 bg-[#2F2F2F]/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {bestSellers.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-4 relative flex flex-col justify-between group hover:shadow-md hover:border-[#8B5E3C]/30 transition-all duration-300 cursor-pointer"
                >
                  {/* Heart wishlist */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleWishlist(item.rawProduct || {
                        id: item.id,
                        name: item.name,
                        price: item.originalPrice || item.price,
                        discount: item.discount || 0,
                        sku: item.id,
                        images: [item.image],
                      }));
                    }}
                    className="absolute top-3 right-3 text-[#7A756B] hover:text-red-500 cursor-pointer z-10 transition-colors"
                  >
                    <Heart size={15} fill={isWishlisted(item.id) ? "#EF4444" : "none"} className={isWishlisted(item.id) ? "text-red-500" : "text-[#7A756B]"} />
                  </button>

                  {/* Card content */}
                  <div className="space-y-3">
                    <div className="aspect-square bg-white border border-[#2F2F2F]/10 p-2 overflow-hidden flex items-center justify-center rounded-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-contain h-full group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'; }}
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <h4 className="font-serif text-sm font-bold text-[#2F2F2F] group-hover:text-[#8B5E3C] transition-colors leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                      {/* Pricing */}
                      <div className="flex items-baseline gap-1.5 pt-0.5 flex-wrap">
                        <span className="text-[#8B5E3C] text-xs font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-[9px] text-[#7A756B] line-through">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                        {item.discount > 0 && (
                          <span className="text-[8px] uppercase tracking-wider font-semibold text-[#8B5E3C]">({item.discount}% OFF)</span>
                        )}
                      </div>
                      {/* Stars */}
                      <div className="flex items-center gap-1 pt-0.5">
                        <div className="flex gap-0.5 text-amber-500">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                        </div>
                        <span className="text-[9px] text-[#7A756B]">({item.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={(e) => handleAddToCart(e, item)}
                    className={`mt-3 w-full py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-sm transition-all cursor-pointer border ${
                      addedIds[item.id]
                        ? 'bg-green-700 text-white border-green-700'
                        : 'border-[#2F2F2F]/20 text-[#2F2F2F] hover:bg-[#6C4E31] hover:text-white hover:border-[#6C4E31]'
                    }`}
                  >
                    {addedIds[item.id] ? '✓ Added' : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* C. Top Categories (Right: 3/12 cols) */}
        <div className="lg:col-span-3 bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-6 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-[#2F2F2F]/10 pb-3">
            <h3 className="text-sm uppercase tracking-widest font-extrabold text-[#2F2F2F] cursor-pointer hover:text-[#8B5E3C] transition-colors" onClick={() => navigate('/shop')}>Top Categories</h3>
            <span
              onClick={() => navigate('/shop')}
              className="text-xs font-bold text-[#8B5E3C] hover:text-[#2F2F2F] cursor-pointer transition-colors flex items-center gap-1"
            >
              View All <ChevronRight size={13} />
            </span>
          </div>

          <div className="divide-y divide-[#2F2F2F]/10">
            {topCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.name);
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className="flex items-center gap-4 py-3.5 hover:bg-[#2F2F2F]/5 px-2 rounded-sm cursor-pointer transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-[#2F2F2F]/5 flex items-center justify-center text-[#8B5E3C] shrink-0 border border-[#2F2F2F]/10">
                    <Icon size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#2F2F2F]">{cat.name}</span>
                    <span className="text-[9px] text-[#7A756B] uppercase tracking-wider mt-0.5">Explore Products</span>
                  </div>
                  <ChevronRight size={12} className="ml-auto text-[#2F2F2F]/30" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;

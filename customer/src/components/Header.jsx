import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag, Search, User, LogOut, Heart, MapPin, Menu,
  Package, HelpCircle, ChevronRight, LayoutDashboard, Shield
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import supabase from '../config/supabase';

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  // Live Clock ticking state
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentTime = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const currentDate = time.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    supabase.auth.signOut().catch(console.error);
    dispatch(logout());
    setShowProfileMenu(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const goTo = (path) => {
    setShowProfileMenu(false);
    navigate(path);
  };

  const isActive = (path, searchKey = null, searchValue = null) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (location.pathname !== '/shop') {
      return location.pathname === path;
    }
    const params = new URLSearchParams(location.search);
    if (searchKey && searchValue) {
      return params.get(searchKey) === searchValue;
    }
    if (path === '/shop') {
      const hasOtherActiveTabs = 
        params.get('sort') === 'best_sellers' ||
        params.get('sort') === 'new' ||
        params.get('filter') === 'deals' ||
        params.get('filter') === 'offers';
      return !hasOtherActiveTabs;
    }
    return false;
  };

  const accountMenuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      desc: 'Overview of your account',
      path: '/profile',
      accent: '#8B5E3C',
    },
    {
      icon: Package,
      label: 'My Orders',
      desc: 'Track and manage orders',
      path: '/orders',
      accent: '#2563eb',
    },
    {
      icon: Heart,
      label: 'My Wishlist',
      desc: 'View saved products',
      path: '/wishlist',
      accent: '#e11d48',
    },
    {
      icon: MapPin,
      label: 'Shipping Address',
      desc: 'Manage delivery addresses',
      path: '/profile',
      accent: '#059669',
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      desc: 'FAQs and contact us',
      path: '/help',
      accent: '#7c3aed',
    },
    {
      icon: Shield,
      label: 'Security & Settings',
      desc: 'Password and preferences',
      path: '/profile',
      accent: '#d97706',
    },
  ];

  return (
    <header className="bg-[#FAF8F3] text-[#2F2F2F] select-none flex flex-col z-20 sticky top-0 border-b border-[#2F2F2F]/15">
      {/* 1. Top Bar */}
      <div className="hidden md:block bg-[#F5F1E8] border-b border-[#2F2F2F]/10 py-2.5 px-6">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center text-[10px] uppercase tracking-widest font-medium text-[#7A756B]">
          <div>Welcome to Velora</div>
          <div>Simple. Smart. Shopping.</div>
          <div className="flex items-center gap-4">
            <Link to="/orders" className="hover:text-[#8B5E3C] transition-colors">My Orders</Link>
            <span className="text-[#2F2F2F]/20">|</span>
            <Link to="/help" className="hover:text-[#8B5E3C] transition-colors cursor-pointer">Help &amp; Support</Link>
            <span className="text-[#2F2F2F]/20">|</span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-[#8B5E3C] transition-colors">
              <MapPin size={11} className="text-[#8B5E3C]" /> Deliver to India
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div className="py-4 px-4 md:px-6 border-b border-[#2F2F2F]/10">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Logo & Mobile Actions Wrapper */}
          <div className="w-full md:w-auto flex justify-between items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2F2F2F" strokeWidth="1.2" />
                <circle cx="50" cy="50" r="41" fill="none" stroke="#2F2F2F" strokeWidth="0.6" strokeDasharray="2 1.5" />
                <path id="headerLogoPathTop" d="M 22 50 A 28 28 0 0 1 78 50" fill="none" />
                <text className="font-serif text-[10px] tracking-[0.25em] fill-[#2F2F2F] font-bold" textAnchor="middle">
                  <textPath href="#headerLogoPathTop" startOffset="50%">VELORA</textPath>
                </text>
                <path id="headerLogoPathBottom" d="M 78 50 A 28 28 0 0 1 22 50" fill="none" />
                <text className="font-sans text-[4.5px] tracking-[0.12em] fill-[#7A756B] font-bold" textAnchor="middle">
                  <textPath href="#headerLogoPathBottom" startOffset="50%">SIMPLE • SMART • SHOPPING</textPath>
                </text>
                <text x="49" y="58" className="font-serif text-2xl font-black fill-[#2F2F2F]" textAnchor="middle">V</text>
                <path d="M 57 58 C 57 54 54 50 55 46 M 55 46 C 57 44 60 44 61 46 M 55 49 C 53 48 52 46 53 45 M 56 53 C 58 52 60 50 59 49 M 57 56 C 55 54 54 52 56 51"
                      fill="none" stroke="#8B5E3C" strokeWidth="0.8" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col text-left">
                <span className="font-serif text-base md:text-lg font-bold uppercase tracking-wider leading-none">VELORA</span>
                <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-semibold text-[#8B5E3C] mt-1 md:mt-1.5">Simple. Smart. Shopping.</span>
              </div>
            </Link>

            {/* Mobile Touch Action Icons (Visible only on mobile/tablet screens) */}
            <div className="flex items-center gap-4 md:hidden">
              {/* Wishlist */}
              <button
                onClick={() => navigate('/wishlist')}
                className="relative p-1.5 text-[#2F2F2F] hover:text-[#8B5E3C] transition-colors"
              >
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate('/checkout')}
                className="relative p-1.5 text-[#2F2F2F] hover:text-[#8B5E3C] transition-colors"
              >
                <ShoppingBag size={20} />
                {totalItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#8B5E3C] text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold">
                    {totalItemsCount > 99 ? '99+' : totalItemsCount}
                  </span>
                )}
              </button>

              {/* Profile Avatar / Login */}
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs bg-[#6C4E31]"
                >
                  {(user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'U')[0].toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="p-1.5 text-[#2F2F2F] hover:text-[#8B5E3C] transition-colors"
                >
                  <User size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md lg:max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, categories, brands..."
              className="w-full bg-white border border-[#2F2F2F]/20 px-4 py-2.5 text-xs placeholder-[#7A756B]/60 focus:outline-none focus:border-[#8B5E3C] rounded-sm pr-10 font-sans text-[#2F2F2F] transition-all"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-[#2F2F2F]/60 hover:text-[#8B5E3C] transition-colors cursor-pointer">
              <Search size={16} />
            </button>
          </form>

          {/* Desktop Action Icons (Hidden on mobile/tablet) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
            {/* Live Header Clock */}
            <div className="hidden lg:flex flex-col items-end border-r border-[#2F2F2F]/15 pr-4 mr-2">
              <span className="font-mono text-[11px] font-bold text-[#2F2F2F] tracking-wide leading-none">{currentTime}</span>
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#8B5E3C] mt-1">{currentDate}</span>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => navigate('/wishlist')}
              className="flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#2F2F2F] hover:text-[#8B5E3C] transition-colors cursor-pointer relative"
            >
              <Heart size={18} />
              <span>Wishlist</span>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Account */}
            <div className="relative" ref={profileRef}>
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer text-[#2F2F2F] hover:text-[#8B5E3C]"
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs bg-[#6C4E31] hover:bg-[#8B5E3C] transition-all">
                      {(user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'U')[0].toUpperCase()}
                    </div>
                    <span className="max-w-[70px] truncate">
                      {user?.fullName?.split(' ')[0] || user?.email?.split('@')[0]}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#2F2F2F] hover:text-[#8B5E3C] transition-colors cursor-pointer"
                >
                  <User size={18} />
                  <span>Account</span>
                </button>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => navigate('/checkout')}
              className="flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#2F2F2F] hover:text-[#8B5E3C] transition-colors cursor-pointer relative"
            >
              <ShoppingBag size={18} />
              <span>Cart</span>
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#8B5E3C] text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm">
                  {totalItemsCount > 99 ? '99+' : totalItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* 3. Sub Navigation */}
      <div className="hidden lg:block bg-[#FAF8F3]">
        <div className="max-w-screen-2xl mx-auto flex items-center">
          <div className="w-[240px] shrink-0 border-r border-[#2F2F2F]/10">
            <Link to="/shop" className="w-full flex items-center gap-3 bg-[#6C4E31] hover:bg-[#8B5E3C] text-[#FAF8F3] px-6 py-3.5 text-xs uppercase tracking-widest font-semibold font-sans transition-colors cursor-pointer">
              <Menu size={15} />
              <span>All Categories</span>
            </Link>
          </div>
          <nav className="flex gap-6 items-center text-[11px] uppercase tracking-widest font-bold font-sans pl-8 py-3.5">
            <Link to="/" className={`hover:text-[#8B5E3C] transition-colors pb-0.5 border-b-2 ${isActive('/') ? 'border-[#8B5E3C] text-[#8B5E3C]' : 'border-transparent text-[#2F2F2F]'}`}>Home</Link>
            <Link to="/shop" className={`hover:text-[#8B5E3C] transition-colors pb-0.5 border-b-2 ${isActive('/shop') ? 'border-[#8B5E3C] text-[#8B5E3C]' : 'border-transparent text-[#2F2F2F]'}`}>Shop</Link>
            <Link to="/shop?sort=best_sellers" className={`hover:text-[#8B5E3C] transition-colors pb-0.5 border-b-2 ${isActive('/shop', 'sort', 'best_sellers') ? 'border-[#8B5E3C] text-[#8B5E3C]' : 'border-transparent text-[#2F2F2F]'}`}>Best Sellers</Link>
            <Link to="/shop?sort=new" className={`hover:text-[#8B5E3C] transition-colors pb-0.5 border-b-2 ${isActive('/shop', 'sort', 'new') ? 'border-[#8B5E3C] text-[#8B5E3C]' : 'border-transparent text-[#2F2F2F]'}`}>New Arrivals</Link>
            <Link to="/shop?filter=deals" className={`hover:text-[#8B5E3C] transition-colors pb-0.5 border-b-2 ${isActive('/shop', 'filter', 'deals') ? 'border-[#8B5E3C] text-[#8B5E3C]' : 'border-transparent text-[#2F2F2F]'}`}>Today's Deals</Link>
            <Link to="/shop?filter=offers" className={`hover:text-[#8B5E3C] transition-colors pb-0.5 border-b-2 ${isActive('/shop', 'filter', 'offers') ? 'border-[#8B5E3C] text-[#8B5E3C]' : 'border-transparent text-[#2F2F2F]'}`}>Offers</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

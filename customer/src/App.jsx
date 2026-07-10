import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from './components/Header';
import CatalogPage from './features/catalog/CatalogPage';
import ProductDetailPage from './features/catalog/ProductDetailPage';
import CheckoutPage from './features/checkout/CheckoutPage';
import LoginPage from './features/auth/LoginPage';
import OrdersPage from './features/orders/OrdersPage';
import RegisterPage from './features/auth/RegisterPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import WishlistPage from './features/wishlist/WishlistPage';
import HelpSupportPage from './features/support/HelpSupportPage';
import ShopPage from './features/shop/ShopPage';
import StaticInfoPage from './features/static/StaticInfoPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { PaymentPage } from './features/payment/PaymentPage';
import { loginSuccess } from './store/slices/authSlice';
import supabase from './config/supabase';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/reset-password';

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch(loginSuccess({
          token: session.access_token,
          user: {
            id: session.user.id,
            email: session.user.email,
            role: 'customer',
            fullName: session.user.user_metadata?.full_name || session.user.email.split('@')[0]
          }
        }));
      }
    });

    // 2. Listen to active auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        dispatch(loginSuccess({
          token: session.access_token,
          user: {
            id: session.user.id,
            email: session.user.email,
            role: 'customer',
            fullName: session.user.user_metadata?.full_name || session.user.email.split('@')[0]
          }
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col font-sans">
      {!isAuthPage && <Header />}
      
      <main className={`flex-1 ${isAuthPage ? '' : 'max-w-screen-2xl w-full mx-auto px-6 py-12'}`}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/track" element={<Navigate to="/orders" replace />} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><HelpSupportPage /></ProtectedRoute>} />
          <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
          <Route path="/info/:slug" element={<ProtectedRoute><StaticInfoPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Redesigned Premium Footer matching mockup layout */}
      {!isAuthPage && (
        <footer className="border-t border-[#2F2F2F]/15 bg-[#FAF8F3] text-[#2F2F2F] py-12 px-6">
          <div className="max-w-screen-2xl mx-auto space-y-12">
            {/* Top Footer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
              {/* Shop Column */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-extrabold text-[#2F2F2F]">Shop</h4>
                <ul className="space-y-2 text-xs text-[#7A756B]">
                  <li><Link to="/shop" className="hover:text-[#8B5E3C] transition-colors">All Products</Link></li>
                  <li><Link to="/shop?sort=best_sellers" className="hover:text-[#8B5E3C] transition-colors">Best Sellers</Link></li>
                  <li><Link to="/shop?sort=new" className="hover:text-[#8B5E3C] transition-colors">New Arrivals</Link></li>
                  <li><Link to="/shop?filter=deals" className="hover:text-[#8B5E3C] transition-colors">Today's Deals</Link></li>
                  <li><Link to="/shop?filter=offers" className="hover:text-[#8B5E3C] transition-colors">Offers</Link></li>
                </ul>
              </div>
 
              {/* Customer Service Column */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-extrabold text-[#2F2F2F]">Customer Service</h4>
                <ul className="space-y-2 text-xs text-[#7A756B]">
                  <li><Link to="/orders" className="hover:text-[#8B5E3C] transition-colors">My Orders</Link></li>
                  <li><Link to="/info/shipping" className="hover:text-[#8B5E3C] transition-colors">Shipping Policy</Link></li>
                  <li><Link to="/info/returns" className="hover:text-[#8B5E3C] transition-colors">Return Policy</Link></li>
                  <li><Link to="/help" className="hover:text-[#8B5E3C] transition-colors">FAQ</Link></li>
                  <li><Link to="/help" className="hover:text-[#8B5E3C] transition-colors">Contact Us</Link></li>
                </ul>
              </div>

              {/* Logo & Social Links Column */}
              <div className="flex flex-col items-start space-y-4">
                <Link to="/" className="flex items-center gap-2.5">
                  <svg viewBox="0 0 100 100" className="w-8 h-8">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#2F2F2F" strokeWidth="1.2" />
                    <circle cx="50" cy="50" r="41" fill="none" stroke="#2F2F2F" strokeWidth="0.6" strokeDasharray="2 1.5" />
                    <path id="footerLogoPathTop" d="M 22 50 A 28 28 0 0 1 78 50" fill="none" />
                    <text className="font-serif text-[10px] tracking-[0.25em] fill-[#2F2F2F] font-bold" textAnchor="middle">
                      <textPath href="#footerLogoPathTop" startOffset="50%">VELORA</textPath>
                    </text>
                    <path id="footerLogoPathBottom" d="M 78 50 A 28 28 0 0 1 22 50" fill="none" />
                    <text className="font-sans text-[4.5px] tracking-[0.12em] fill-[#7A756B] font-bold" textAnchor="middle">
                      <textPath href="#footerLogoPathBottom" startOffset="50%">SIMPLE • SMART • SHOPPING</textPath>
                    </text>
                    <text x="49" y="58" className="font-serif text-2xl font-black fill-[#2F2F2F]" textAnchor="middle">V</text>
                    <path d="M 57 58 C 57 54 54 50 55 46 M 55 46 C 57 44 60 44 61 46 M 55 49 C 53 48 52 46 53 45 M 56 53 C 58 52 60 50 59 49 M 57 56 C 55 54 54 52 56 51"
                          fill="none" stroke="#8B5E3C" strokeWidth="0.8" strokeLinecap="round" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="font-serif text-sm font-bold uppercase tracking-wider leading-none">VELORA</span>
                    <span className="text-[8px] uppercase tracking-widest font-semibold text-[#8B5E3C] mt-1.5">Simple. Smart. Shopping.</span>
                  </div>
                </Link>
                {/* Social icons */}
                <div className="flex gap-2">
                  {['f', 'i', 't', 'p'].map((social) => (
                    <span
                      key={social}
                      className="w-6 h-6 rounded-full border border-[#2F2F2F]/20 flex items-center justify-center text-[10px] font-bold uppercase hover:bg-[#8B5E3C] hover:text-[#FAF8F3] hover:border-transparent transition-colors cursor-pointer"
                    >
                      {social}
                    </span>
                  ))}
                </div>
              </div>

              {/* About Us Column */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-extrabold text-[#2F2F2F]">About Us</h4>
                <ul className="space-y-2 text-xs text-[#7A756B]">
                  <li><Link to="/info/about" className="hover:text-[#8B5E3C] transition-colors">Our Story</Link></li>
                  <li><Link to="/info/privacy" className="hover:text-[#8B5E3C] transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/info/terms" className="hover:text-[#8B5E3C] transition-colors">Terms & Conditions</Link></li>
                  <li><Link to="/info/careers" className="hover:text-[#8B5E3C] transition-colors">Careers</Link></li>
                  <li><Link to="/info/blog" className="hover:text-[#8B5E3C] transition-colors">Blog</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer Section */}
            <div className="border-t border-[#2F2F2F]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-wider text-[#7A756B] font-medium">
              <div>© 2024 Velora. All Rights Reserved.</div>
              <div className="flex items-center gap-3">
                <span>We Accept</span>
                <span className="px-2 py-0.5 border border-[#2F2F2F]/20 rounded-sm font-bold bg-white text-[8px]">Visa</span>
                <span className="px-2 py-0.5 border border-[#2F2F2F]/20 rounded-sm font-bold bg-white text-[8px]">Mastercard</span>
                <span className="px-2 py-0.5 border border-[#2F2F2F]/20 rounded-sm font-bold bg-white text-[8px]">UPI</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

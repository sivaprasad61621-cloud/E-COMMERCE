import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tags, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu 
} from 'lucide-react';

export const Layout = ({ children }) => {
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const user = useSelector((state) => state.auth.user);
  const { storeName } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Live Clock ticking state
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentTime = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const currentDate = time.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const firstLetter = storeName ? storeName.charAt(0) : 'S';
  const restOfName = storeName ? storeName.slice(1) : '';

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: ShoppingBag },
    { name: 'Categories', path: '/categories', icon: Tags },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex text-[#2F2F2F] font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 bg-[#FAF8F3] border-editorial-r z-30 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-editorial-b">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 w-full select-none cursor-pointer animate-fadeIn text-left" onClick={() => navigate('/')}>
              <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2F2F2F" strokeWidth="1.2" />
                <circle cx="50" cy="50" r="41" fill="none" stroke="#2F2F2F" strokeWidth="0.6" strokeDasharray="2 1.5" />
                <path id="adminLogoPathTop" d="M 22 50 A 28 28 0 0 1 78 50" fill="none" />
                <text className="font-serif text-[10px] tracking-[0.25em] fill-[#2F2F2F] font-bold" textAnchor="middle">
                  <textPath href="#adminLogoPathTop" startOffset="50%">VELORA</textPath>
                </text>
                <path id="adminLogoPathBottom" d="M 78 50 A 28 28 0 0 1 22 50" fill="none" />
                <text className="font-sans text-[4.5px] tracking-[0.12em] fill-[#7A756B] font-bold" textAnchor="middle">
                  <textPath href="#adminLogoPathBottom" startOffset="50%">SIMPLE • SMART • SHOPPING</textPath>
                </text>
                <text x="49" y="58" className="font-serif text-2xl font-black fill-[#2F2F2F]" textAnchor="middle">V</text>
                <path d="M 57 58 C 57 54 54 50 55 46 M 55 46 C 57 44 60 44 61 46 M 55 49 C 53 48 52 46 53 45 M 56 53 C 58 52 60 50 59 49 M 57 56 C 55 54 54 52 56 51"
                      fill="none" stroke="#8B5E3C" strokeWidth="0.8" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col">
                <span className="font-serif text-sm font-bold uppercase tracking-wider leading-none">VELORA</span>
                <span className="text-[8px] uppercase tracking-widest font-semibold text-[#8B5E3C] mt-1">ADMINISTRATOR</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center w-full cursor-pointer" onClick={() => navigate('/')}>
              <svg viewBox="0 0 100 100" className="w-9 h-9">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2F2F2F" strokeWidth="1.2" />
                <circle cx="50" cy="50" r="41" fill="none" stroke="#2F2F2F" strokeWidth="0.6" strokeDasharray="2 1.5" />
                <path id="adminLogoPathTopMini" d="M 22 50 A 28 28 0 0 1 78 50" fill="none" />
                <text className="font-serif text-[10px] tracking-[0.25em] fill-[#2F2F2F] font-bold" textAnchor="middle">
                  <textPath href="#adminLogoPathTopMini" startOffset="50%">VELORA</textPath>
                </text>
                <path id="adminLogoPathBottomMini" d="M 78 50 A 28 28 0 0 1 22 50" fill="none" />
                <text className="font-sans text-[4.5px] tracking-[0.12em] fill-[#7A756B] font-bold" textAnchor="middle">
                  <textPath href="#adminLogoPathBottomMini" startOffset="50%">SIMPLE • SMART • SHOPPING</textPath>
                </text>
                <text x="49" y="58" className="font-serif text-2xl font-black fill-[#2F2F2F]" textAnchor="middle">V</text>
                <path d="M 57 58 C 57 54 54 50 55 46 M 55 46 C 57 44 60 44 61 46 M 55 49 C 53 48 52 46 53 45 M 56 53 C 58 52 60 50 59 49 M 57 56 C 55 54 54 52 56 51"
                      fill="none" stroke="#8B5E3C" strokeWidth="0.8" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/dashboard');
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all duration-200 text-sm font-medium ${
                  isActive 
                    ? 'bg-[#8B5E3C] text-[#FAF8F3]' 
                    : 'text-[#2F2F2F] hover:bg-[#2F2F2F]/5'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#FAF8F3]' : 'text-[#8B5E3C]'} />
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-editorial-t">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm hover:bg-[#2F2F2F]/5 text-sm font-medium text-[#2F2F2F]`}
          >
            <LogOut size={18} className="text-[#8B5E3C]" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'pl-64' : 'pl-20'
        }`}
      >
        {/* Top Navbar */}
        <header className="h-20 bg-[#FAF8F3] border-editorial-b flex items-center justify-between px-8 sticky top-0 z-20">
          <button 
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 hover:bg-[#2F2F2F]/5 rounded-sm border-editorial cursor-pointer"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            {/* Live Operational Clock */}
            <div className="hidden md:flex flex-col items-end border-r border-[#2F2F2F]/15 pr-4 mr-2">
              <span className="font-mono text-sm font-bold text-[#2F2F2F] tracking-wide leading-none">{currentTime}</span>
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#8B5E3C] mt-1">{currentDate}</span>
            </div>

            <span className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
              Role: {user?.role || 'Admin'}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#8B5E3C] text-[#FAF8F3] flex items-center justify-center font-serif font-bold text-sm">
              {(user?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveProfile, clearProfile } from '../../store/slices/profileSlice';
import { logout } from '../../store/slices/authSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import supabase from '../../config/supabase';
import {
  User, MapPin, Phone, Mail, Save, Trash2,
  CheckCircle, ArrowLeft, Edit3, Home, ShoppingBag,
  Package, HelpCircle, ChevronRight, LayoutDashboard, Shield, LogOut,
  Calendar, Star, Heart, Zap, Truck, Award
} from 'lucide-react';

const API = 'http://localhost:5000/api';

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { address, hasAddress } = useSelector((state) => state.profile);
  const cartItems = useSelector((state) => state.cart.items);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  
  // Detail Order view inside orders tab
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Address edit state
  const [editingAddress, setEditingAddress] = useState(!hasAddress);
  const [addressForm, setAddressForm] = useState({ ...address });
  const [addressSaved, setAddressSaved] = useState(false);

  // Cancellation state
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelReasonSelect, setCancelReasonSelect] = useState('');
  const [cancelReasonText, setCancelReasonText] = useState('');

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    if (!user?.email) return;
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const res = await fetch(`${API}/orders?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.data || []);
      } else {
        throw new Error('Failed to retrieve order history.');
      }
    } catch (err) {
      setOrdersError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  }, [user?.email]);

  const fetchOrderDetail = useCallback(async (id) => {
    try {
      setDetailLoading(true);
      setDetailError(null);
      const res = await fetch(`${API}/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data);
      } else {
        throw new Error('Order details could not be retrieved.');
      }
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleLogout = () => {
    supabase.auth.signOut().catch(console.error);
    dispatch(logout());
    navigate('/');
  };

  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    if (!cancelReasonSelect) {
      alert('Please select a cancellation reason.');
      return;
    }
    const finalReason = cancelReasonSelect === 'Other' ? cancelReasonText : cancelReasonSelect + (cancelReasonText ? `: ${cancelReasonText}` : '');
    
    try {
      setDetailLoading(true);
      const res = await fetch(`${API}/orders/${cancellingOrderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'cancelled',
          cancellation_reason: finalReason
        })
      });
      if (res.ok) {
        alert('Order has been cancelled successfully.');
        setCancellingOrderId(null);
        setCancelReasonSelect('');
        setCancelReasonText('');
        // Refresh details
        if (selectedOrder && selectedOrder.id === cancellingOrderId) {
          fetchOrderDetail(selectedOrder.id);
        }
        // Refresh list
        fetchOrders();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to cancel the order.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.first_name || !addressForm.city || !addressForm.address_line1 || !addressForm.postal_code) {
      alert('Please fill in the required fields: Name, Address, City, and Pincode.');
      return;
    }
    dispatch(saveProfile(addressForm));
    setEditingAddress(false);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);
  };

  const handleClearAddress = () => {
    if (window.confirm('Are you sure you want to remove your saved address?')) {
      dispatch(clearProfile());
      setAddressForm({
        first_name: '', last_name: '', phone: '', address_line1: '',
        address_line2: '', city: '', state: '', postal_code: '', country: 'India'
      });
      setEditingAddress(true);
    }
  };

  const finalPrice = (p) => {
    const orig = parseFloat(p.price || 0);
    const disc = parseFloat(p.discount || 0);
    return orig - (orig * (disc / 100));
  };

  // Get status badge colors
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'packed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-[#F5F1E8] text-[#7A756B] border-[#2F2F2F]/10';
    }
  };

  const getStatusStepClass = (stepName) => {
    if (!selectedOrder) return 'text-[#7A756B] opacity-40';
    const statusMap = { 'pending': 0, 'packed': 1, 'shipped': 2, 'delivered': 3, 'cancelled': -1 };
    const currentStep = statusMap[selectedOrder.status];
    const targetStep = statusMap[stepName];

    if (selectedOrder.status === 'cancelled') {
      return stepName === 'pending' ? 'text-red-700 font-semibold' : 'text-[#7A756B] opacity-20';
    }
    if (currentStep >= targetStep) return 'text-green-800 font-semibold';
    if (currentStep === targetStep - 1) return 'text-[#8B5E3C] font-semibold animate-pulse';
    return 'text-[#7A756B] opacity-40';
  };

  // Menu items config matching the user dropdown
  const sidebarMenuItems = [
    { id: 'dashboard', label: 'Dashboard', desc: 'Overview of your account', icon: LayoutDashboard, accent: '#8B5E3C' },
    { id: 'orders', label: 'My Orders', desc: 'Track and manage orders', icon: Package, accent: '#2563eb' },
    { id: 'wishlist', label: 'My Wishlist', desc: 'View saved products', icon: Heart, accent: '#e11d48' },
    { id: 'address', label: 'Shipping Address', desc: 'Manage delivery addresses', icon: MapPin, accent: '#059669' },
    { id: 'help', label: 'Help & Support', desc: 'FAQs and contact us', icon: HelpCircle, accent: '#7c3aed' },
    { id: 'settings', label: 'Security & Settings', desc: 'Password and preferences', icon: Shield, accent: '#d97706' }
  ];

  const initials = (user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'U')[0].toUpperCase();
  const userName = user?.fullName || user?.email?.split('@')[0] || 'Customer';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-[#2F2F2F]">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#7A756B] hover:text-[#2F2F2F] transition-colors cursor-pointer mb-6"
      >
        <ArrowLeft size={12} /> Back to Shopping
      </button>

      {/* Main Profile Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column: Sidebar Card (Matches User Dropdown Panel Styling) */}
        <div className="w-full lg:w-80 shrink-0 bg-white border border-[#2F2F2F]/15 rounded-xl shadow-lg overflow-hidden">
          
          {/* Brown Header Block */}
          <div className="bg-gradient-to-br from-[#6C4E31] to-[#8B5E3C] px-5 py-5 text-white">
            <div className="flex items-center gap-4 text-left">
              {/* White Border Avatar */}
              <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-2xl shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-serif font-bold text-lg leading-tight truncate">{userName}</p>
                <p className="text-white/70 text-xs truncate mt-0.5">{user?.email}</p>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-1 mt-5 pt-4 border-t border-white/20 text-center">
              <button 
                onClick={() => navigate('/checkout')}
                className="hover:bg-white/10 rounded-lg py-1.5 transition-colors cursor-pointer"
              >
                <p className="font-bold text-xl leading-none">{totalItemsCount}</p>
                <p className="text-[9px] text-white/75 uppercase tracking-wider mt-1.5">Cart</p>
              </button>
              <button 
                onClick={() => setActiveTab('wishlist')}
                className={`rounded-lg py-1.5 transition-colors cursor-pointer ${activeTab === 'wishlist' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                <p className="font-bold text-xl leading-none">{wishlistItems.length}</p>
                <p className="text-[9px] text-white/75 uppercase tracking-wider mt-1.5">Wishlist</p>
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`rounded-lg py-1.5 transition-colors cursor-pointer ${activeTab === 'orders' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                <p className="font-bold text-xl leading-none">{orders.length}</p>
                <p className="text-[9px] text-white/75 uppercase tracking-wider mt-1.5">Orders</p>
              </button>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="py-2 bg-white">
            {sidebarMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedOrder(null);
                  }}
                  className={`w-full flex items-center gap-3.5 px-5 py-3 transition-colors group text-left border-l-4 ${
                    isActive 
                      ? 'bg-[#FAF8F3] border-[#8B5E3C] text-[#8B5E3C]' 
                      : 'border-transparent hover:bg-[#FAF8F3]/60 text-[#2F2F2F]'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                    style={{ backgroundColor: isActive ? `${item.accent}20` : `${item.accent}12` }}
                  >
                    <Icon size={16} style={{ color: item.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold leading-tight ${isActive ? 'text-[#8B5E3C]' : 'text-[#2F2F2F]'}`}>{item.label}</p>
                    <p className="text-[10px] text-[#7A756B] leading-tight mt-0.5 truncate">{item.desc}</p>
                  </div>
                  <ChevronRight size={13} className={`transition-colors shrink-0 ${isActive ? 'text-[#8B5E3C]' : 'text-[#2F2F2F]/20 group-hover:text-[#8B5E3C]'}`} />
                </button>
              );
            })}
          </div>

          {/* Sign Out Section */}
          <div className="border-t border-[#2F2F2F]/10 p-4 bg-[#FAF8F3]/40">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-50 hover:bg-red-100/80 text-red-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-red-200/50"
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Right Column: Tab View Content */}
        <div className="flex-1 w-full bg-white border border-[#2F2F2F]/15 rounded-xl shadow-sm p-6 min-h-[500px]">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-[#2F2F2F]/10 pb-4">
                <h1 className="text-2xl font-serif font-bold">Welcome Back, {userName}!</h1>
                <p className="text-xs text-[#7A756B] mt-1">Access your customer ledger profile and manage active shipments.</p>
              </div>

              {/* Badges and Main info */}
              <div className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-lg p-5 flex flex-col md:flex-row items-center gap-5 justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#8B5E3C]/10 border border-[#8B5E3C]/20 flex items-center justify-center shrink-0">
                    <User size={24} className="text-[#8B5E3C]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg leading-tight">{userName}</h3>
                    <p className="text-xs text-[#7A756B] flex items-center gap-1.5 mt-1 font-mono">
                      <Mail size={11} /> {user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                  <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-extrabold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                    <CheckCircle size={10} fill="currentColor" className="text-green-700 fill-white" /> Verified Customer
                  </span>
                  <p className="text-[10px] text-[#7A756B] font-mono">Member Since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
                </div>
              </div>

              {/* Action grid summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Shipping address box */}
                <div className="border border-[#2F2F2F]/15 rounded-lg p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin size={16} className="text-green-700" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Default Address</h4>
                    </div>
                    {hasAddress ? (
                      <div className="text-xs space-y-1 text-[#7A756B] pl-6">
                        <p className="font-bold text-[#2F2F2F]">{address.first_name} {address.last_name}</p>
                        <p>{address.address_line1}</p>
                        <p>{address.city}, {address.state} - {address.postal_code}</p>
                        <p>{address.phone}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-[#7A756B] pl-6 italic">No address details saved yet.</p>
                    )}
                  </div>
                  <button 
                    onClick={() => setActiveTab('address')} 
                    className="text-[10px] font-bold text-[#8B5E3C] hover:underline uppercase tracking-wider mt-4 text-left self-start"
                  >
                    {hasAddress ? 'Edit Address' : 'Add Address'} &rarr;
                  </button>
                </div>

                {/* Latest orders box */}
                <div className="border border-[#2F2F2F]/15 rounded-lg p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Package size={16} className="text-blue-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Active Shipments</h4>
                    </div>
                    {orders.length > 0 ? (
                      <div className="text-xs space-y-2 pl-6">
                        {orders.slice(0, 2).map(order => (
                          <div key={order.id} className="flex justify-between items-center py-1 border-b border-[#2F2F2F]/5 last:border-0">
                            <div>
                              <p className="font-mono font-bold text-[#2F2F2F]">{order.id.slice(0, 8)}...</p>
                              <p className="text-[10px] text-[#7A756B]">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                            </div>
                            <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border ${getStatusBadgeClass(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#7A756B] pl-6 italic">No orders logged yet.</p>
                    )}
                  </div>
                  <button 
                    onClick={() => setActiveTab('orders')} 
                    className="text-[10px] font-bold text-[#8B5E3C] hover:underline uppercase tracking-wider mt-4 text-left self-start"
                  >
                    View All Orders &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS LIST AND DETAIL TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn text-left">
              {selectedOrder ? (
                /* DETAIL TRACKING VIEW */
                <div className="space-y-5">
                  <button 
                    onClick={() => setSelectedOrder(null)} 
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#7A756B] hover:text-[#2F2F2F] transition-colors cursor-pointer mb-2"
                  >
                    <ArrowLeft size={12} /> Back to My Orders
                  </button>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[#2F2F2F]/10 pb-3">
                    <h2 className="text-xl font-serif font-bold">Order Tracking: <span className="font-mono text-sm">{selectedOrder.id}</span></h2>
                    <span className="text-xs text-[#7A756B] font-mono">
                      Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                    </span>
                  </div>

                  {detailLoading ? (
                    <p className="text-sm italic text-[#7A756B] text-center py-12">Retrieving tracking records...</p>
                  ) : detailError ? (
                    <div className="text-center py-12">
                      <p className="text-sm text-red-700">Error: {detailError}</p>
                      <button onClick={() => fetchOrderDetail(selectedOrder.id)} className="mt-4 text-xs bg-[#8B5E3C] text-white px-4 py-2 font-bold uppercase tracking-wider">Retry</button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Step progress bar */}
                      <div className="bg-[#FAF8F3] border border-[#2F2F2F]/10 rounded p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2F2F] mb-4">Logistics Progress Status</h4>
                        {selectedOrder.status === 'cancelled' ? (
                          <div className="text-center py-4 border border-red-200 bg-red-50 text-red-800 rounded-sm">
                            <span className="font-serif text-base font-bold block">ORDER CANCELLED</span>
                            {selectedOrder.cancellation_reason ? (
                              <span className="text-[11px] block mt-1.5">Reason: <strong className="text-red-950 font-semibold">{selectedOrder.cancellation_reason}</strong></span>
                            ) : (
                              <span className="text-[11px] block mt-1.5">This order dispatch has been cancelled and voided.</span>
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 gap-2 py-4 relative">
                            <div className={`flex flex-col items-center gap-1.5 text-center ${getStatusStepClass('pending')}`}>
                              <CheckCircle size={20} />
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider block">1. Placed</span>
                              </div>
                            </div>
                            <div className={`flex flex-col items-center gap-1.5 text-center ${getStatusStepClass('packed')}`}>
                              <Package size={20} />
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider block">2. Packed</span>
                              </div>
                            </div>
                            <div className={`flex flex-col items-center gap-1.5 text-center ${getStatusStepClass('shipped')}`}>
                              <Truck size={20} className="transform scale-x-[-1]" />
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider block">3. Shipped</span>
                              </div>
                            </div>
                            <div className={`flex flex-col items-center gap-1.5 text-center ${getStatusStepClass('delivered')}`}>
                              <Award size={20} />
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider block">4. Delivered</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Item list */}
                      <div className="border border-[#2F2F2F]/10 rounded overflow-hidden">
                        <div className="bg-[#FAF8F3] border-b border-[#2F2F2F]/10 px-4 py-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider">Cart Ledger</h4>
                        </div>
                        <div className="divide-y divide-[#2F2F2F]/10">
                          {selectedOrder.order_items?.map((item) => (
                            <div key={item.id} className="p-4 flex gap-4 items-center">
                              {item.product?.images?.[0] && (
                                <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-contain bg-white border rounded p-1" />
                              )}
                              <div className="flex-1 min-w-0 flex flex-col text-left">
                                <h5 className="font-serif font-bold text-xs truncate text-[#2F2F2F]">{item.product?.name || 'Unlisted Product'}</h5>
                                <p className="text-[10px] text-[#7A756B] mt-0.5">SKU: {item.product?.sku || 'N/A'} | Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold">₹{parseFloat(item.total_price).toLocaleString('en-IN')}</p>
                                {parseFloat(item.discount_amount) > 0 && (
                                  <p className="text-[9px] text-[#8B5E3C]">Saved ₹{parseFloat(item.discount_amount).toLocaleString('en-IN')}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-[#FAF8F3] border-t border-[#2F2F2F]/10 p-4 flex flex-col items-end text-xs space-y-1">
                          <div className="flex justify-between w-64 text-[#7A756B]">
                            <span>Subtotal</span>
                            <span>₹{(parseFloat(selectedOrder.total_amount) - parseFloat(selectedOrder.shipping_amount) - parseFloat(selectedOrder.tax_amount)).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between w-64 text-[#7A756B]">
                            <span>Shipping</span>
                            <span>₹{parseFloat(selectedOrder.shipping_amount).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between w-64 text-[#7A756B]">
                            <span>Tax Allocation</span>
                            <span>₹{parseFloat(selectedOrder.tax_amount).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between w-64 font-serif font-bold text-sm text-[#2F2F2F] pt-2 border-t border-[#2F2F2F]/10 mt-1">
                            <span>Grand Total</span>
                            <span className="text-[#8B5E3C]">₹{parseFloat(selectedOrder.total_amount).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Cancel Order Button Section */}
                      {['pending', 'packed'].includes(selectedOrder.status) && (
                        <div className="bg-red-50/50 border border-red-200/50 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-red-800">Need to cancel this order?</h4>
                            <p className="text-[11px] text-red-700/80 mt-0.5">You can request cancellation before your items are shipped.</p>
                          </div>
                          <button
                            onClick={() => {
                              setCancellingOrderId(selectedOrder.id);
                              setCancelReasonSelect('');
                              setCancelReasonText('');
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-2 px-5 rounded transition-colors cursor-pointer shrink-0 animate-pulse hover:animate-none"
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* HISTORY LIST VIEW */
                <div className="space-y-4">
                  <div className="border-b border-[#2F2F2F]/10 pb-4">
                    <h2 className="text-xl font-serif font-bold">My Orders</h2>
                    <p className="text-xs text-[#7A756B] mt-0.5">Review and track your purchase history.</p>
                  </div>

                  {ordersLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map(i => <div key={i} className="h-20 bg-[#FAF8F3] border border-[#2F2F2F]/10 rounded animate-pulse" />)}
                    </div>
                  ) : ordersError ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-red-700">Error: {ordersError}</p>
                      <button onClick={fetchOrders} className="mt-3 text-xs bg-[#8B5E3C] text-white px-4 py-2 font-bold uppercase tracking-wider rounded-sm">Retry</button>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center gap-4 bg-[#FAF8F3] border border-[#2F2F2F]/10 rounded p-6">
                      <ShoppingBag size={24} className="text-[#8B5E3C]" />
                      <div>
                        <h4 className="font-bold text-xs">No Orders Found</h4>
                        <p className="text-[11px] text-[#7A756B] mt-0.5">You haven't checked out any baskets yet.</p>
                      </div>
                      <button onClick={() => navigate('/shop')} className="bg-[#6C4E31] text-white px-5 py-2 text-[10px] uppercase font-bold tracking-wider rounded-sm">Start Shopping</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => fetchOrderDetail(item.id)}
                          className="bg-[#FAF8F3] border border-[#2F2F2F]/15 hover:border-[#8B5E3C]/30 hover:shadow-sm transition-all duration-300 rounded-lg p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-[#2F2F2F]">{item.id.slice(0, 16)}...</span>
                              <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border ${getStatusBadgeClass(item.status)}`}>
                                {item.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] text-[#7A756B]">
                              <span className="flex items-center gap-1">
                                <Calendar size={10} className="text-[#8B5E3C]" />
                                {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                              <span>Total: <strong className="text-[#2F2F2F]">₹{parseFloat(item.total_amount).toLocaleString('en-IN')}</strong></span>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); fetchOrderDetail(item.id); }}
                            className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-[#8B5E3C] hover:text-[#2F2F2F] cursor-pointer"
                          >
                            Track &rarr;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#2F2F2F]/10 pb-4 text-left">
                <h2 className="text-xl font-serif font-bold">My Wishlist</h2>
                <p className="text-xs text-[#7A756B] mt-0.5">Explore your bookmarked items and move them to cart.</p>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4 bg-[#FAF8F3] border border-[#2F2F2F]/10 rounded p-6">
                  <Heart size={24} className="text-red-500" />
                  <div>
                    <h4 className="font-bold text-xs">Your Wishlist is Empty</h4>
                    <p className="text-[11px] text-[#7A756B] mt-0.5">Start adding products you love to save them here.</p>
                  </div>
                  <button onClick={() => navigate('/shop')} className="bg-[#6C4E31] text-white px-5 py-2 text-[10px] uppercase font-bold tracking-wider rounded-sm">Explore Shop</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistItems.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="bg-[#FAF8F3] border border-[#2F2F2F]/15 hover:border-[#8B5E3C]/30 transition-all rounded p-4 relative flex flex-col group cursor-pointer text-left"
                    >
                      <button
                        onClick={e => { e.stopPropagation(); dispatch(toggleWishlist(item)); }}
                        className="absolute top-2 right-2 text-red-500 hover:text-[#7A756B] z-10 cursor-pointer"
                      >
                        <Heart size={14} fill="#EF4444" />
                      </button>
                      <div className="aspect-square bg-white border rounded p-2 mb-3 flex items-center justify-center overflow-hidden h-36">
                        <img src={item.images?.[0]} alt={item.name} className="object-contain h-full group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <h4 className="text-xs font-bold truncate text-[#2F2F2F] group-hover:text-[#8B5E3C]">{item.name}</h4>
                      <p className="text-[10px] text-[#8B5E3C] font-bold mt-1">₹{finalPrice(item).toLocaleString('en-IN')}</p>
                      
                      {/* Action buttons */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          dispatch(addToCart(item));
                          alert('Added to Cart!');
                        }}
                        className="w-full mt-3 py-1 text-[9px] uppercase font-bold tracking-wider rounded border border-[#2F2F2F]/20 text-[#2F2F2F] hover:bg-[#8B5E3C] hover:text-white hover:border-[#8B5E3C] transition-colors cursor-pointer text-center"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SHIPPING ADDRESS (ORIGINAL ProfilePage Form) */}
          {activeTab === 'address' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#2F2F2F]/10 pb-4 flex justify-between items-center flex-wrap gap-2 text-left">
                <div>
                  <h2 className="text-xl font-serif font-bold">Shipping Address</h2>
                  <p className="text-xs text-[#7A756B] mt-0.5">Manage your delivery destination records.</p>
                </div>
                {hasAddress && !editingAddress && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingAddress(true)}
                      className="flex items-center gap-1 px-3 py-1.5 text-[9px] uppercase font-bold border border-[#2F2F2F]/20 rounded-sm hover:border-[#8B5E3C] hover:text-[#8B5E3C] transition-all cursor-pointer bg-white"
                    >
                      <Edit3 size={11} /> Edit
                    </button>
                    <button
                      onClick={handleClearAddress}
                      className="flex items-center gap-1 px-3 py-1.5 text-[9px] uppercase font-bold border border-red-200 text-red-600 rounded-sm hover:bg-red-50 transition-all cursor-pointer bg-white"
                    >
                      <Trash2 size={11} /> Remove
                    </button>
                  </div>
                )}
              </div>

              {hasAddress && !editingAddress ? (
                /* Display Saved Address */
                <div className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-lg p-5">
                  <div className="flex items-start gap-4 text-left">
                    <div className="w-9 h-9 rounded-sm bg-[#8B5E3C]/10 flex items-center justify-center shrink-0">
                      <Home size={16} className="text-[#8B5E3C]" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif font-bold text-base">{address.first_name} {address.last_name}</p>
                      <p className="text-xs text-[#2F2F2F]">{address.address_line1}</p>
                      {address.address_line2 && <p className="text-xs text-[#7A756B]">{address.address_line2}</p>}
                      <p className="text-xs text-[#2F2F2F]">
                        {address.city}{address.state ? `, ${address.state}` : ''} — {address.postal_code}
                      </p>
                      <p className="text-xs text-[#7A756B]">{address.country}</p>
                      {address.phone && (
                        <p className="text-xs text-[#7A756B] flex items-center gap-1.5 pt-1.5">
                          <Phone size={10} /> {address.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  {addressSaved && (
                    <span className="mt-4 inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                      <CheckCircle size={10} /> Address Saved!
                    </span>
                  )}
                </div>
              ) : (
                /* Edit Address Form */
                <form onSubmit={handleSaveAddress} className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-[#7A756B] mb-1">First Name *</label>
                      <input
                        name="first_name"
                        value={addressForm.first_name || ''}
                        onChange={handleAddressChange}
                        placeholder="Priya"
                        required
                        className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-[#7A756B] mb-1">Last Name</label>
                      <input
                        name="last_name"
                        value={addressForm.last_name || ''}
                        onChange={handleAddressChange}
                        placeholder="Sharma"
                        className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-[#7A756B] mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone size={12} className="absolute left-3 top-2.5 text-[#7A756B]" />
                      <input
                        name="phone"
                        value={addressForm.phone || ''}
                        onChange={handleAddressChange}
                        placeholder="9876543210"
                        className="w-full bg-white border border-[#2F2F2F]/20 pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-[#7A756B] mb-1">Address Line 1 *</label>
                    <input
                      name="address_line1"
                      value={addressForm.address_line1 || ''}
                      onChange={handleAddressChange}
                      placeholder="House No., Street, Area"
                      required
                      className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-[#7A756B] mb-1">Address Line 2 (Optional)</label>
                    <input
                      name="address_line2"
                      value={addressForm.address_line2 || ''}
                      onChange={handleAddressChange}
                      placeholder="Landmark, flat, colony"
                      className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-[#7A756B] mb-1">City *</label>
                      <input
                        name="city"
                        value={addressForm.city || ''}
                        onChange={handleAddressChange}
                        placeholder="Mumbai"
                        required
                        className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-[#7A756B] mb-1">State</label>
                      <select
                        name="state"
                        value={addressForm.state || ''}
                        onChange={handleAddressChange}
                        className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                      >
                        <option value="">Select State</option>
                        {INDIA_STATES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-[#7A756B] mb-1">Pincode *</label>
                      <input
                        name="postal_code"
                        value={addressForm.postal_code || ''}
                        onChange={handleAddressChange}
                        placeholder="400001"
                        required
                        maxLength={6}
                        className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-[#7A756B] mb-1">Country</label>
                      <input
                        name="country"
                        value={addressForm.country || 'India'}
                        onChange={handleAddressChange}
                        className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F] bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2 text-[10px] uppercase font-bold tracking-wider bg-[#8B5E3C] text-white hover:bg-[#6C4E31] rounded-sm transition-all cursor-pointer"
                    >
                      <Save size={12} /> Save Address
                    </button>
                    {hasAddress && (
                      <button
                        type="button"
                        onClick={() => { setEditingAddress(false); setAddressForm({ ...address }); }}
                        className="px-5 py-2 text-[10px] uppercase font-bold tracking-wider border border-[#2F2F2F]/20 text-[#2F2F2F] hover:bg-gray-50 rounded-sm transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: HELP & SUPPORT */}
          {activeTab === 'help' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-[#2F2F2F]/10 pb-4">
                <h2 className="text-xl font-serif font-bold">Help & Support</h2>
                <p className="text-xs text-[#7A756B] mt-0.5">Reach out to our representatives or read common documentation.</p>
              </div>

              {/* FAQ Accordion */}
              <div className="space-y-3 bg-[#FAF8F3] border border-[#2F2F2F]/10 rounded p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Frequently Asked Questions</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <h5 className="font-bold text-[#2F2F2F]">How long will dispatch take?</h5>
                    <p className="text-[#7A756B] mt-0.5">Orders are generally dispatched from our hubs within 24 to 48 hours of verification.</p>
                  </div>
                  <div className="border-t border-[#2F2F2F]/5 pt-3">
                    <h5 className="font-bold text-[#2F2F2F]">Can I change my shipment destination?</h5>
                    <p className="text-[#7A756B] mt-0.5">Once dispatched to our third-party logistics courier, address rerouting is not supported.</p>
                  </div>
                  <div className="border-t border-[#2F2F2F]/5 pt-3">
                    <h5 className="font-bold text-[#2F2F2F]">How can I cancel a pending cart checkout?</h5>
                    <p className="text-[#7A756B] mt-0.5">Contact customer dispatch hotlines immediately. Once packed or shipped, cancellation is voided.</p>
                  </div>
                </div>
              </div>

              <div className="border border-[#2F2F2F]/10 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Still Need Assistance?</h4>
                  <p className="text-xs text-[#7A756B] mt-0.5">Open a chat ticket with our support desk team.</p>
                </div>
                <button 
                  onClick={() => alert('Support ticket system offline. Please call hotlines.')} 
                  className="bg-[#8B5E3C] text-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-wider rounded-sm hover:bg-[#6C4E31]"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-[#2F2F2F]/10 pb-4">
                <h2 className="text-xl font-serif font-bold">Security & Settings</h2>
                <p className="text-xs text-[#7A756B] mt-0.5">Configure access logs and check security badges.</p>
              </div>

              <div className="space-y-4">
                {/* Account info read-only */}
                <div className="bg-[#FAF8F3] border border-[#2F2F2F]/10 rounded p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#7A756B] block">Email Address</span>
                      <span className="font-bold text-[#2F2F2F]">{user?.email}</span>
                    </div>
                    <div>
                      <span className="text-[#7A756B] block">Registered Role</span>
                      <span className="font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-sm inline-block mt-0.5">CUSTOMER</span>
                    </div>
                  </div>
                </div>

                {/* Password reset trigger mock */}
                <div className="border border-[#2F2F2F]/10 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Credentials Reset</h4>
                    <p className="text-xs text-[#7A756B] mt-0.5">Trigger a password reset email link to update login keys.</p>
                  </div>
                  <button 
                    onClick={() => alert(`Reset instructions sent to ${user?.email}`)}
                    className="border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C]/10 px-5 py-2 text-[10px] uppercase font-bold tracking-wider rounded-sm"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Cancellation Modal Overlay */}
      {cancellingOrderId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#2F2F2F]/10 animate-fadeIn text-left">
            <h3 className="font-serif font-bold text-lg mb-2 text-[#2F2F2F]">Cancel Order</h3>
            <p className="text-xs text-[#7A756B] mb-4">
              Please let us know why you are cancelling order <strong className="font-mono text-[#2F2F2F]">{cancellingOrderId.slice(0, 16)}...</strong>. Your feedback helps us improve.
            </p>
            
            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-[#7A756B] mb-1">Reason for Cancellation *</label>
                <select
                  value={cancelReasonSelect}
                  onChange={e => {
                    setCancelReasonSelect(e.target.value);
                    if (e.target.value !== 'Other') {
                      setCancelReasonText('');
                    }
                  }}
                  required
                  className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                >
                  <option value="">Select a reason</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                  <option value="Delivery time is too long">Delivery time is too long</option>
                  <option value="Want to change shipping address">Want to change shipping address</option>
                  <option value="Other">Other (please specify below)</option>
                </select>
              </div>

              {(cancelReasonSelect === 'Other' || cancelReasonSelect === '') && (
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-[#7A756B] mb-1">Additional details (Optional if reason selected)</label>
                  <textarea
                    value={cancelReasonText}
                    onChange={e => setCancelReasonText(e.target.value)}
                    placeholder="Provide additional details..."
                    rows={3}
                    required={cancelReasonSelect === 'Other'}
                    className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingOrderId(null)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-[#2F2F2F]/20 rounded-sm hover:bg-gray-50 transition-colors"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

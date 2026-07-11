import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import { 
  Search, CheckCircle, Package, Truck, Award, MapPin,
  ArrowLeft, Calendar, ChevronRight, ShoppingBag, Eye 
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const queryOrderId = searchParams.get('id') || '';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Fetch orders list for this user
  const fetchOrders = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/orders?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.data || []);
      } else {
        throw new Error('Failed to retrieve your order archives.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  // Fetch individual order details
  const fetchOrderDetail = useCallback(async (id) => {
    try {
      setDetailLoading(true);
      setDetailError(null);
      const res = await fetch(`${API}/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data);
      } else {
        throw new Error('Order details could not be retrieved from the archives.');
      }
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (queryOrderId) {
      fetchOrderDetail(queryOrderId);
    } else {
      setSelectedOrder(null);
      fetchOrders();
    }
  }, [queryOrderId, fetchOrders, fetchOrderDetail]);

  const handleSelectOrder = (id) => {
    setSearchParams({ id });
  };

  const handleClearSelected = () => {
    setSearchParams({});
  };

  const getStatusStepClass = (stepName) => {
    if (!selectedOrder) return 'text-[#7A756B] opacity-40';
    const statusMap = {
      'pending':          0,
      'packed':           1,
      'shipped':          2,
      'out_for_delivery': 3,
      'delivered':        4,
      'cancelled':        -1,
    };
    const currentStep = statusMap[selectedOrder.status];
    const targetStep = statusMap[stepName];

    if (selectedOrder.status === 'cancelled') {
      return stepName === 'pending' ? 'text-red-700 font-semibold' : 'text-[#7A756B] opacity-20';
    }

    if (currentStep >= targetStep) {
      return 'text-green-800 font-semibold';
    }
    if (currentStep === targetStep - 1) {
      return 'text-[#8B5E3C] font-semibold animate-pulse';
    }
    return 'text-[#7A756B] opacity-40';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':        return 'bg-green-100 text-green-800 border-green-200';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'shipped':          return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'packed':           return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':        return 'bg-red-100 text-red-800 border-red-200';
      default:                 return 'bg-[#F5F1E8] text-[#7A756B] border-[#2F2F2F]/10';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F]">
      
      {selectedOrder ? (
        /* DETAIL VIEW & TRACKER */
        <div className="space-y-6">
          <div className="border-editorial-b pb-5">
            <button 
              onClick={handleClearSelected} 
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#7A756B] hover:text-[#2F2F2F] transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft size={12} /> Back to My Orders
            </button>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h2 className="text-3xl font-serif font-bold tracking-wide">
                Order Tracking: {selectedOrder.id}
              </h2>
              <span className="text-xs text-[#7A756B] font-mono">
                Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
              </span>
            </div>
          </div>

          {detailLoading ? (
            <p className="text-sm italic text-[#7A756B] text-center py-12">Retrieving tracking records...</p>
          ) : detailError ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-700">Error: {detailError}</p>
              <Button onClick={() => fetchOrderDetail(queryOrderId)} className="mt-4 text-xs">Retry</Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Tracker Progress Bar */}
              <Card title="Logistics Progress Status" className="shadow-sm">
                {selectedOrder.status === 'cancelled' ? (
                  <div className="text-center py-6 border border-red-200 bg-red-50 text-red-800 rounded-sm">
                    <span className="font-serif text-lg font-bold block">ORDER CANCELLED</span>
                    <span className="text-xs">This order dispatch has been cancelled and voided.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-2 py-8 relative">
                    {/* Placed */}
                    <div className={`flex flex-col items-center gap-2 text-center ${getStatusStepClass('pending')}`}>
                      <CheckCircle size={24} />
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider block">1. Placed</span>
                        <span className="text-[9px] text-[#7A756B] block">Order recorded</span>
                      </div>
                    </div>

                    {/* Packed */}
                    <div className={`flex flex-col items-center gap-2 text-center ${getStatusStepClass('packed')}`}>
                      <Package size={24} />
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider block">2. Packed</span>
                        <span className="text-[9px] text-[#7A756B] block">Fulfillment verified</span>
                      </div>
                    </div>

                    {/* Shipped */}
                    <div className={`flex flex-col items-center gap-2 text-center ${getStatusStepClass('shipped')}`}>
                      <Truck size={24} />
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider block">3. Shipped</span>
                        <span className="text-[9px] text-[#7A756B] block">Dispatched to courier</span>
                      </div>
                    </div>

                    {/* Out for Delivery */}
                    <div className={`flex flex-col items-center gap-2 text-center ${getStatusStepClass('out_for_delivery')}`}>
                      <MapPin size={24} />
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider block">4. Out for Delivery</span>
                        <span className="text-[9px] text-[#7A756B] block">On the way to you</span>
                      </div>
                    </div>

                    {/* Delivered */}
                    <div className={`flex flex-col items-center gap-2 text-center ${getStatusStepClass('delivered')}`}>
                      <Award size={24} />
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider block">5. Delivered</span>
                        <span className="text-[9px] text-[#7A756B] block">Signed for delivery</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tracking metadata details */}
                <div className="border-editorial-t border-opacity-20 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#7A756B]">
                  <div>
                    <span className="font-semibold uppercase tracking-widest text-[#2F2F2F] block mb-1">Status Index</span>
                    <span className="uppercase text-[#8B5E3C] font-bold">{selectedOrder.status}</span>
                  </div>
                  {selectedOrder.tracking_number && (
                    <div>
                      <span className="font-semibold uppercase tracking-widest text-[#2F2F2F] block mb-1">Tracking ID</span>
                      <span className="font-mono text-[#2F2F2F] font-bold">{selectedOrder.tracking_number}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Invoice Summary */}
              <Card title={`Invoice ledger - ${selectedOrder.id}`} className="shadow-sm">
                <Table headers={['Product Name', 'SKU', 'Unit Price', 'Quantity', 'Reduction', 'Net Subtotal']}>
                  {selectedOrder.order_items?.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4">
                        <span className="font-serif font-medium text-base text-[#2F2F2F]">{item.product?.name || 'Unlisted Item'}</span>
                      </td>
                      <td className="py-4 font-mono text-xs text-[#7A756B]">{item.product?.sku || 'N/A'}</td>
                      <td className="py-4 text-sm">₹{parseFloat(item.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 text-sm font-semibold">{item.quantity}</td>
                      <td className="py-4 text-sm text-[#8B5E3C]">₹{parseFloat(item.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-4 text-sm font-semibold">₹{parseFloat(item.total_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </Table>

                <div className="flex justify-end border-editorial-t border-opacity-20 pt-6 mt-6">
                  <div className="w-full md:w-80 space-y-3 text-sm text-[#7A756B]">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-semibold text-[#2F2F2F]">₹{(parseFloat(selectedOrder.total_amount) - parseFloat(selectedOrder.shipping_amount) - parseFloat(selectedOrder.tax_amount)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Charges</span>
                      <span className="font-semibold text-[#2F2F2F]">₹{parseFloat(selectedOrder.shipping_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>18% GST Allocation</span>
                      <span className="font-semibold text-[#2F2F2F]">₹{parseFloat(selectedOrder.tax_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</span>
                    </div>
                    <div className="flex justify-between border-editorial-t border-opacity-40 pt-2 text-base font-serif font-bold text-[#2F2F2F]">
                      <span>Total Amount Due</span>
                      <span className="text-[#8B5E3C]">₹{parseFloat(selectedOrder.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      ) : (
        /* HISTORY LIST VIEW */
        <div className="space-y-6">
          <div className="border-editorial-b pb-5">
            <h2 className="text-3xl font-serif font-bold tracking-wide">My Orders</h2>
            <p className="text-xs text-[#7A756B] mt-1.5 font-sans">
              Review and track your purchase history with Velora.
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-700">Error: {error}</p>
              <Button onClick={fetchOrders} className="mt-4 text-xs">Retry Search</Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-5 bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm">
              <div className="w-16 h-16 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center">
                <ShoppingBag size={28} className="text-[#8B5E3C]" strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-[#2F2F2F]">No Orders Found</h3>
                <p className="text-xs text-[#7A756B] max-w-sm leading-relaxed">
                  It seems you haven't placed any orders yet. Start exploring our curated collections.
                </p>
              </div>
              <button
                onClick={() => navigate('/shop')}
                className="bg-[#6C4E31] hover:bg-[#8B5E3C] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-bold rounded-sm transition-all cursor-pointer mt-2"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectOrder(item.id)}
                  className="bg-[#FAF8F3] border border-[#2F2F2F]/15 hover:border-[#8B5E3C]/30 hover:shadow-sm transition-all duration-300 rounded-sm p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#2F2F2F] tracking-wide">{item.id}</span>
                      <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-sm border ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-[#7A756B] font-sans">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#8B5E3C]" />
                        {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span>Total Amount: <strong className="text-[#2F2F2F]">₹{parseFloat(item.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</strong></span>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); handleSelectOrder(item.id); }}
                    className="flex items-center gap-1.5 self-start md:self-auto text-[10px] uppercase tracking-widest font-extrabold text-[#8B5E3C] hover:text-[#2F2F2F] cursor-pointer transition-colors"
                  >
                    Track Dispatch <ChevronRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

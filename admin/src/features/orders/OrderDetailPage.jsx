import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById, updateOrderStatus, clearOrderDetail } from '../../store/slices/orderSlice';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import { ArrowLeft, Printer, Truck } from 'lucide-react';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrderDetail, loading, error } = useSelector((state) => state.orders);

  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    dispatch(fetchOrderById(id));
    return () => {
      dispatch(clearOrderDetail());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentOrderDetail) {
      setStatus(currentOrderDetail.status);
      setTrackingNumber(currentOrderDetail.tracking_number || '');
    }
  }, [currentOrderDetail]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateOrderStatus({ id, status, tracking_number: trackingNumber })).unwrap();
      alert('Fulfillment ledger updated successfully.');
    } catch (err) {
      alert(`Failed to update order status: ${err}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <p className="text-sm italic text-[#7A756B]">Loading invoice records...</p>;
  if (error) return <p className="text-sm text-red-700">Error: {error}</p>;
  if (!currentOrderDetail) return <p className="text-sm italic text-[#7A756B]">No invoice selected.</p>;

  const customer = currentOrderDetail.customer || {};
  const items = currentOrderDetail.order_items || [];

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F] print:p-0 print:bg-white">
      {/* Top Navbar Actions (Hidden in Print) */}
      <div className="flex justify-between items-center gap-4 border-editorial-b pb-6 print:hidden">
        <button 
          onClick={() => navigate('/orders')} 
          className="flex items-center gap-2 text-sm uppercase tracking-widest font-semibold text-[#7A756B] hover:text-[#2F2F2F] cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Ledger
        </button>

        <Button onClick={handlePrint} variant="secondary" className="flex items-center gap-2 cursor-pointer">
          <Printer size={16} /> Print Invoice
        </Button>
      </div>

      {/* Main Invoice Card */}
      <Card className="border-[0.5px] border-[#2F2F2F]/20 p-8 md:p-12 print:border-none print:shadow-none bg-[#FAF8F3]">
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between border-editorial-b pb-8 gap-6">
          <div className="space-y-3">
            <span className="font-serif text-5xl font-bold tracking-widest leading-none">S</span>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8B5E3C] block">For Shopping</span>
            <p className="text-xs italic text-[#7A756B]">Vintage Editorial E-commerce platform.</p>
          </div>
          <div className="text-left md:text-right space-y-1 md:self-end">
            <div className="flex flex-col md:items-end gap-1.5">
              <h1 className="text-2xl font-serif uppercase tracking-widest text-[#2F2F2F]">Invoice</h1>
              <span className={`px-2 py-0.5 border-[0.5px] rounded-full text-[10px] uppercase font-semibold tracking-wider ${
                currentOrderDetail.status === 'pending' ? 'border-amber-300 text-amber-800 bg-amber-50' :
                currentOrderDetail.status === 'packed' ? 'border-blue-300 text-blue-800 bg-blue-50' :
                currentOrderDetail.status === 'shipped' ? 'border-indigo-300 text-indigo-800 bg-indigo-50' :
                currentOrderDetail.status === 'delivered' ? 'border-green-300 text-green-800 bg-green-50' :
                'border-red-300 text-red-800 bg-red-50'
              }`}>
                {currentOrderDetail.status}
              </span>
            </div>
            <p className="font-mono text-xs font-semibold text-[#7A756B] mt-2">No. {currentOrderDetail.id}</p>
            <p className="text-xs text-[#7A756B]">
              Date:{' '}
              {new Date(currentOrderDetail.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Client & Shipping Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-editorial-b">
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#7A756B] mb-3">Customer Directory</h4>
            <p className="font-serif text-lg font-medium">
              {customer.first_name} {customer.last_name}
            </p>
            <p className="text-sm text-[#7A756B] mt-1">{customer.email}</p>
            {customer.phone && <p className="text-sm text-[#7A756B]">{customer.phone}</p>}
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#7A756B] mb-3">Shipping Allocation</h4>
            <p className="text-sm leading-relaxed text-[#2F2F2F]">
              {customer.address_line1}
              {customer.address_line2 && <span className="block">{customer.address_line2}</span>}
              <span className="block">
                {customer.city}, {customer.state} {customer.postal_code}
              </span>
              <span className="block font-medium tracking-wide">{customer.country}</span>
            </p>
          </div>
        </div>

        {/* Cancellation Reason Log */}
        {currentOrderDetail.status === 'cancelled' && currentOrderDetail.cancellation_reason && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-sm mt-4 text-xs text-left animate-fadeIn">
            <span className="font-bold block uppercase tracking-wider mb-1">Customer Cancellation Feed</span>
            <p className="italic">" {currentOrderDetail.cancellation_reason} "</p>
          </div>
        )}

        {/* Invoice Ledger Items Table */}
        <div className="py-8">
          <Table headers={['Product Description', 'SKU', 'Unit Price', 'Quantity', 'Reduction', 'Net Subtotal']}>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-4">
                  <span className="font-serif font-medium text-base text-[#2F2F2F]">
                    {item.product?.name || 'Unlisted Item'}
                  </span>
                </td>
                <td className="py-4 font-mono text-xs text-[#7A756B]">{item.product?.sku || 'N/A'}</td>
                <td className="py-4 text-sm">₹{parseFloat(item.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="py-4 text-sm font-medium">{item.quantity}</td>
                <td className="py-4 text-sm text-[#8B5E3C]">₹{parseFloat(item.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="py-4 text-sm font-semibold">₹{parseFloat(item.total_price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </Table>
        </div>

        {/* Financial Subtotals summary */}
        <div className="flex justify-end pt-6 border-editorial-t">
          <div className="w-full md:w-80 space-y-3 text-sm">
            <div className="flex justify-between text-[#7A756B]">
              <span>Cart Subtotal</span>
              <span>
                ₹
                {(
                  parseFloat(currentOrderDetail.total_amount) -
                  parseFloat(currentOrderDetail.shipping_amount) -
                  parseFloat(currentOrderDetail.tax_amount)
                ).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-[#7A756B]">
              <span>Shipping & Handling</span>
              <span>₹{parseFloat(currentOrderDetail.shipping_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-[#7A756B]">
              <span>Value-Added Tax (VAT)</span>
              <span>₹{parseFloat(currentOrderDetail.tax_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-base font-serif font-semibold border-editorial-t pt-3 text-[#2F2F2F]">
              <span>Total LTV Ledger</span>
              <span className="text-[#8B5E3C] text-lg">₹{parseFloat(currentOrderDetail.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Status updates Form (Hidden in print) */}
      <Card title="Fulfillment Control Panel" className="print:hidden shadow-sm">
        <form onSubmit={handleUpdateStatus} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
              Fulfillment Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-transparent border-editorial border-opacity-40 p-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F] cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B] flex items-center gap-1.5">
              <Truck size={14} className="text-[#8B5E3C]" /> Shipping Tracking Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="bg-transparent border-editorial border-opacity-40 p-2 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm font-mono text-[#2F2F2F]"
              placeholder="e.g. TRK-1234567"
            />
          </div>

          <Button type="submit" variant="primary" className="py-2.5 cursor-pointer">
            Commit Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default OrderDetailPage;

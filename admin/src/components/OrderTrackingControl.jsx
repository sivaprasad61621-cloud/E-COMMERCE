import React, { useState } from 'react';
import { Truck, Send, CheckCircle2, Clock } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Order Placed (Pending)' },
  { value: 'packed', label: 'Picked & Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function OrderTrackingControl({ orders = [], onStatusUpdate }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});

  const handleStatusChange = async (orderId) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) return;

    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        if (onStatusUpdate) onStatusUpdate(orderId, newStatus);
      }
    } catch (err) {
      console.error('Update order status error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Order Tracking & Fulfillment Dispatch</h3>
          <p className="text-xs text-slate-500">Update order status and trigger instant transactional email notifications</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Tracking Code</th>
              <th className="py-3 px-4">Current Status</th>
              <th className="py-3 px-4 text-right">Dispatch Status Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.slice(0, 10).map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{o.id}</td>
                <td className="py-3.5 px-4 text-slate-600">{o.customer?.email || 'customer@sshopping.com'}</td>
                <td className="py-3.5 px-4 font-mono text-xs text-amber-900 font-semibold">{o.tracking_number || 'TRK-9876543'}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full uppercase tracking-wider">
                    {o.status || 'pending'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <select
                      defaultValue={o.status || 'pending'}
                      onChange={(e) => setSelectedStatus({ ...selectedStatus, [o.id]: e.target.value })}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleStatusChange(o.id)}
                      disabled={updatingId === o.id}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-sm flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Notify</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderTrackingControl;

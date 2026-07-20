import React from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';

const TRACKING_STEPS = [
  { key: 'pending', label: 'Order Placed', desc: 'We received your order request.' },
  { key: 'packed', label: 'Packed & Processing', desc: 'Product verified & packaged in warehouse.' },
  { key: 'shipped', label: 'Shipped', desc: 'Handed over to logistics carrier.' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Delivery agent is heading your way.' },
  { key: 'delivered', label: 'Delivered', desc: 'Successfully delivered to your doorstep.' },
];

export function OrderTrackerModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const currentStatus = order.status || 'pending';
  const activeStepIdx = TRACKING_STEPS.findIndex(s => s.key === currentStatus);
  const effectiveIdx = activeStepIdx >= 0 ? activeStepIdx : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif">Order Status & Tracking</h3>
              <p className="text-slate-400 text-xs mt-0.5">Order ID: <span className="font-mono text-amber-300 font-semibold">{order.id}</span></p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-400">Tracking Number:</span>
              <p className="font-mono text-amber-400 font-bold text-sm mt-0.5">{order.tracking_number || 'TRK-VEL-882910'}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Estimated Delivery:</span>
              <p className="font-medium text-white text-sm mt-0.5">In 2 - 3 Days</p>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {currentStatus === 'cancelled' ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold">Order Cancelled</p>
                <p className="text-xs text-rose-600 mt-0.5">This order was cancelled. Please reach out to customer support if you need assistance.</p>
              </div>
            </div>
          ) : (
            <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
              {TRACKING_STEPS.map((step, idx) => {
                const isPassed = idx <= effectiveIdx;
                const isCurrent = idx === effectiveIdx;

                return (
                  <div key={step.key} className="relative group">
                    {/* Step Circle Indicator */}
                    <div
                      className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-amber-800 text-white ring-4 ring-amber-100 scale-110'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isPassed && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    {/* Step Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold ${isCurrent ? 'text-amber-900' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-amber-100 text-amber-800 font-bold rounded-full animate-pulse">
                            Active Status
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Delivery Address Snapshot */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs space-y-1 text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <MapPin className="w-4 h-4 text-amber-800" />
              <span>Shipping Destination</span>
            </div>
            <p className="font-semibold text-slate-700">{order.customer?.first_name || 'Valued'} {order.customer?.last_name || 'Customer'}</p>
            <p>{order.customer?.address_line1 || '123 Velora Boulevard'}</p>
            <p>{order.customer?.city || 'Metropolis'}, {order.customer?.postal_code || '10001'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderTrackerModal;

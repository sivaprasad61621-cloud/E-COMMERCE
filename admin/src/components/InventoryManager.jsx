import React, { useState } from 'react';
import { Package, AlertTriangle, ArrowUpRight, RefreshCw, Plus, Check } from 'lucide-react';

export function InventoryManager({ products = [], onRestockProduct }) {
  const [stockUpdates, setStockUpdates] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const lowStockItems = products.filter(p => parseInt(p.stock || 0) <= 10);

  const handleStockChange = (id, value) => {
    setStockUpdates(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveRestock = async (product) => {
    const newQty = parseInt(stockUpdates[product.id] || product.stock || 0);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ stock: newQty }),
      });

      if (res.ok) {
        setSuccessMsg(`Restocked "${product.name}" to ${newQty} units!`);
        if (onRestockProduct) onRestockProduct(product.id, newQty);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Restock error:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Inventory & Stock Management</h3>
            <p className="text-xs text-slate-500">Real-time stock audit, low-stock triggers, and restock controls</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>{lowStockItems.length} Low Stock Alert(s)</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Stock Status</th>
              <th className="py-3 px-4 text-right">Quick Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.slice(0, 10).map((p) => {
              const stock = parseInt(p.stock || 0);
              const isLow = stock <= 10;
              const isOut = stock === 0;

              return (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{p.sku || 'SKU-000'}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{p.name}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{stock} units</td>
                  <td className="py-3.5 px-4">
                    {isOut ? (
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-[11px] font-bold rounded-full">Out of Stock</span>
                    ) : isLow ? (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full animate-pulse">Low Stock (&le;10)</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full">Healthy Stock</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        defaultValue={stock}
                        onChange={(e) => handleStockChange(p.id, e.target.value)}
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveRestock(p)}
                        className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg transition shadow-sm"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryManager;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders, setOrderFilters } from '../../store/slices/orderSlice';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import { ArrowUpRight } from 'lucide-react';

export const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ordersList, pagination, filters, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [filters, dispatch]);

  const handleStatusFilter = (status) => {
    dispatch(setOrderFilters({ status, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setOrderFilters({ page: newPage }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'border-amber-300 text-amber-800 bg-amber-50';
      case 'packed':
        return 'border-blue-300 text-blue-800 bg-blue-50';
      case 'shipped':
        return 'border-indigo-300 text-indigo-800 bg-indigo-50';
      case 'delivered':
        return 'border-green-300 text-green-800 bg-green-50';
      default:
        return 'border-red-300 text-red-800 bg-red-50';
    }
  };

  const statuses = [
    { key: '', label: 'All Ledger' },
    { key: 'pending', label: 'Pending' },
    { key: 'packed', label: 'Packed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F]">
      <div className="border-editorial-b pb-6">
        <h2 className="text-4xl font-serif tracking-wide mb-2">Orders Ledger</h2>
        <p className="text-sm font-sans text-[#7A756B]">
          Fulfillment transactions catalog, ledger archives, and invoices pipeline.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-editorial-b gap-1">
        {statuses.map((s) => (
          <button
            key={s.key}
            onClick={() => handleStatusFilter(s.key)}
            className={`px-4 py-2 text-xs font-sans uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer ${
              filters.status === s.key
                ? 'border-[#8B5E3C] text-[#8B5E3C]'
                : 'border-transparent text-[#7A756B] hover:text-[#2F2F2F]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-sm">
        {loading ? (
          <p className="text-sm italic text-[#7A756B]">Loading ledger entries...</p>
        ) : ordersList.length === 0 ? (
          <p className="text-sm italic text-[#7A756B]">No order records found under this status query.</p>
        ) : (
          <div className="space-y-6">
            <Table headers={['Ledger ID', 'Purchase Date', 'Customer', 'LTV Amount (₹)', 'Fulfillment Status', 'Actions']}>
              {ordersList.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-[#2F2F2F]/5 transition-colors cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <td className="py-4 font-mono text-xs font-semibold text-[#7A756B]">{order.id}</td>
                  <td className="py-4 text-sm">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-4">
                    <div className="font-medium text-sm">
                      {order.customer?.first_name} {order.customer?.last_name}
                    </div>
                    <div className="text-xs text-[#7A756B]">{order.customer?.email}</div>
                  </td>
                  <td className="py-4 text-sm font-semibold text-[#8B5E3C]">
                    ₹{parseFloat(order.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 border-[0.5px] rounded-full text-[10px] uppercase font-semibold tracking-wider ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${order.id}`);
                      }}
                      className="p-1 hover:bg-[#8B5E3C]/10 text-[#8B5E3C] rounded-sm transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold uppercase tracking-wider"
                    >
                      Invoice <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </Table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between border-editorial-t pt-4">
                <span className="text-xs text-[#7A756B]">
                  Page {pagination.page} of {pagination.pages} (Total: {pagination.total} orders)
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    variant="secondary"
                    className="text-xs py-1 px-3 cursor-pointer"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    variant="secondary"
                    className="text-xs py-1 px-3 cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrdersPage;

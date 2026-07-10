import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, fetchCustomerById, clearCustomerDetail } from '../../store/slices/orderSlice';
import Card from '../../components/Card';
import Table from '../../components/Table';
import { X, User, ShoppingBag, MapPin, Calendar } from 'lucide-react';

export const CustomersPage = () => {
  const dispatch = useDispatch();
  const { customersList, currentCustomerDetail, loading } = useSelector((state) => state.orders);
  
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers());
    return () => {
      dispatch(clearCustomerDetail());
    };
  }, [dispatch]);

  const handleSelectCustomer = (id) => {
    setSelectedCustomerId(id);
    dispatch(fetchCustomerById(id));
  };

  const handleCloseDetail = () => {
    setSelectedCustomerId(null);
    dispatch(clearCustomerDetail());
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F]">
      <div className="border-editorial-b pb-6">
        <h2 className="text-4xl font-serif tracking-wide mb-2">Customers Ledger</h2>
        <p className="text-sm font-sans text-[#7A756B]">
          Database tracking buyer directories, lifetime value statistics, and transaction histories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Customers Table List */}
        <Card title="Client Directory" className={`shadow-sm ${selectedCustomerId ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {loading && !selectedCustomerId ? (
            <p className="text-sm italic text-[#7A756B]">Loading client profiles...</p>
          ) : customersList.length === 0 ? (
            <p className="text-sm italic text-[#7A756B]">No client accounts logged.</p>
          ) : (
            <Table headers={['Customer Name', 'Email', 'Location', 'Member Since', 'Orders Count', 'Lifetime LTV (₹)']}>
              {customersList.map((customer) => (
                <tr 
                  key={customer.id} 
                  className={`hover:bg-[#2F2F2F]/5 transition-colors cursor-pointer ${
                    selectedCustomerId === customer.id ? 'bg-[#8B5E3C]/10 font-medium' : ''
                  }`}
                  onClick={() => handleSelectCustomer(customer.id)}
                >
                  <td className="py-4 font-serif text-base">
                    {customer.first_name} {customer.last_name}
                  </td>
                  <td className="py-4 text-sm text-[#7A756B]">{customer.email}</td>
                  <td className="py-4 text-sm text-[#2F2F2F]">
                    {customer.city}, {customer.country}
                  </td>
                  <td className="py-4 text-sm text-[#7A756B]">
                    {new Date(customer.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </td>
                  <td className="py-4 text-sm font-mono">{customer.order_count}</td>
                  <td className="py-4 text-sm font-semibold text-[#8B5E3C]">₹{parseFloat(customer.ltv).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        {/* Customer Detail panel (Side panel on row click) */}
        {selectedCustomerId && (
          <Card 
            title="Profile Details" 
            className="shadow-sm border-[0.5px] border-[#2F2F2F]/20 animate-slideIn"
            headerAction={
              <button onClick={handleCloseDetail} className="p-1.5 hover:bg-[#2F2F2F]/5 rounded-sm cursor-pointer">
                <X size={16} />
              </button>
            }
          >
            {loading ? (
              <p className="text-xs italic text-[#7A756B]">Retrieving profile records...</p>
            ) : !currentCustomerDetail ? (
              <p className="text-xs italic text-[#7A756B]">No client detail selected.</p>
            ) : (
              <div className="space-y-6">
                {/* Contact Card */}
                <div className="space-y-4 border-editorial-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C]">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold">
                        {currentCustomerDetail.first_name} {currentCustomerDetail.last_name}
                      </h4>
                      <span className="text-xs text-[#7A756B]">{currentCustomerDetail.email}</span>
                    </div>
                  </div>
                  
                  {currentCustomerDetail.phone && (
                    <div className="text-xs text-[#7A756B] flex items-center gap-2">
                      <span className="font-semibold uppercase tracking-wider">Phone:</span>
                      {currentCustomerDetail.phone}
                    </div>
                  )}
                </div>

                {/* Shipping Location */}
                <div className="space-y-2 border-editorial-b pb-4">
                  <h5 className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B] flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#8B5E3C]" /> Shipping Address
                  </h5>
                  <p className="text-xs leading-relaxed text-[#2F2F2F] pl-4">
                    {currentCustomerDetail.address_line1}
                    {currentCustomerDetail.address_line2 && <span className="block">{currentCustomerDetail.address_line2}</span>}
                    <span className="block">
                      {currentCustomerDetail.city}, {currentCustomerDetail.state} {currentCustomerDetail.postal_code}
                    </span>
                    <span className="block font-medium">{currentCustomerDetail.country}</span>
                  </p>
                </div>

                {/* Purchase history list */}
                <div className="space-y-3">
                  <h5 className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B] flex items-center gap-1.5">
                    <ShoppingBag size={12} className="text-[#8B5E3C]" /> Ledger Entries
                  </h5>
                  {currentCustomerDetail.orders && currentCustomerDetail.orders.length === 0 ? (
                    <p className="text-xs italic text-[#7A756B] pl-4">No order records found.</p>
                  ) : (
                    <div className="space-y-2 pl-4 max-h-48 overflow-y-auto">
                      {currentCustomerDetail.orders?.map((ord) => (
                        <div key={ord.id} className="flex justify-between items-center text-xs py-1.5 border-b border-[#2F2F2F]/5">
                          <div className="space-y-0.5">
                            <span className="font-mono font-semibold text-[#2F2F2F]">{ord.id}</span>
                            <span className="text-[9px] text-[#7A756B] block">
                              {new Date(ord.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="text-right space-y-0.5">
                            <span className="font-semibold text-[#8B5E3C]">₹{parseFloat(ord.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className="text-[8px] uppercase tracking-widest font-semibold block text-[#7A756B]">{ord.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;

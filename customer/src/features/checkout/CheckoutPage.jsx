import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { updateQuantity, removeFromCart, clearCart } from '../../store/slices/cartSlice';
import { saveProfile } from '../../store/slices/profileSlice';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import { Trash2, ShoppingBag, ArrowLeft, Zap, CheckCircle, MapPin, Edit3 } from 'lucide-react';




export const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  const { address: savedAddress, hasAddress } = useSelector((state) => state.profile);

  // Buy Now flow: if coming from "Buy Now" button, use only that single item
  const buyNowItem = location.state?.buyNowItem || null;
  const effectiveItems = buyNowItem ? [buyNowItem] : cartItems;

  // Pre-fill customer from saved profile; fall back to empty
  const [customer, setCustomer] = useState({
    first_name: savedAddress.first_name || '',
    last_name: savedAddress.last_name || '',
    email: user?.email || '',
    phone: savedAddress.phone || '',
    address_line1: savedAddress.address_line1 || '',
    address_line2: savedAddress.address_line2 || '',
    city: savedAddress.city || '',
    state: savedAddress.state || '',
    postal_code: savedAddress.postal_code || '',
    country: savedAddress.country || 'India',
  });

  const [errors, setErrors] = useState({});



  const handleQtyChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Calculations — price after discount (discount is stored as a percentage)
  const cartSubtotal = effectiveItems.reduce((sum, item) => {
    const discountPct = parseFloat(item.discount || 0);
    const finalPrice = item.price * (1 - discountPct / 100);
    return sum + (finalPrice * item.quantity);
  }, 0);
  
  const shippingFee = effectiveItems.length > 0 ? 150.00 : 0.00; // Fixed flat shipping fee

  const taxRate = 0.18; // 18% GST
  const vatTax = cartSubtotal * taxRate;
  const totalAmount = cartSubtotal + shippingFee + vatTax;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (effectiveItems.length === 0) {
      alert('No items to order. Please add products to your cart or use Buy Now.');
      return;
    }

    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // First Name
    if (!customer.first_name || !customer.first_name.trim()) {
      tempErrors.first_name = "First name is required";
    }

    // Email
    if (!customer.email || !customer.email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!emailRegex.test(customer.email)) {
      tempErrors.email = "Please enter a valid email address (e.g., name@example.com)";
    }

    // Phone
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    if (!customer.phone || !customer.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (cleanPhone.length !== 10) {
      tempErrors.phone = "Phone number must contain exactly 10 digits";
    }

    // Address Line 1
    if (!customer.address_line1 || !customer.address_line1.trim()) {
      tempErrors.address_line1 = "Address line 1 is required";
    }

    // City
    if (!customer.city || !customer.city.trim()) {
      tempErrors.city = "City is required";
    }

    // Pincode
    const cleanPostal = customer.postal_code.replace(/[^0-9]/g, '');
    if (!customer.postal_code || !customer.postal_code.trim()) {
      tempErrors.postal_code = "Pincode/Postal code is required";
    } else if (customer.country.toLowerCase() === 'india' && cleanPostal.length !== 6) {
      tempErrors.postal_code = "Pincode in India must contain exactly 6 digits";
    } else if (customer.postal_code.trim().length < 3) {
      tempErrors.postal_code = "Please enter a valid postal code";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    // Proceed to secure Payment page
    navigate('/payment', {
      state: {
        customer,
        effectiveItems,
        cartSubtotal,
        shippingFee,
        vatTax,
        totalAmount,
        buyNowItem
      }
    });
  };



  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F]">
      <div className="border-editorial-b pb-6">
        {buyNowItem ? (
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-[#8B5E3C] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
              <Zap size={10} fill="currentColor" /> Buy Now — Direct Checkout
            </span>
          </div>
        ) : null}
        <h2 className="text-4xl font-serif tracking-wide mb-2">
          {buyNowItem ? 'Quick Order' : 'Cart Ledger & Checkout'}
        </h2>
        <p className="text-sm font-sans text-[#7A756B]">
          Catalog allocations checkout, customer registry setup, and dispatch scheduling.
        </p>
      </div>

      {effectiveItems.length === 0 ? (
        <div className="text-center py-20 bg-[#FAF8F3] border-editorial border-opacity-40 p-8 space-y-4">
          <ShoppingBag size={40} className="mx-auto text-[#7A756B]" />
          <h3 className="font-serif text-2xl font-bold">Your Cart Ledger is Empty</h3>
          <p className="text-xs text-[#7A756B]">Navigate back to the storefront to catalog objects.</p>
          <Button onClick={() => navigate('/')} variant="primary" className="mx-auto cursor-pointer">
            Return to Catalog
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items list */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Ledger Items Selection" className="shadow-sm">
              <Table headers={buyNowItem
                ? ['Asset', 'Description', 'Unit Price', 'Quantity', 'Total Price']
                : ['Asset', 'Description', 'SKU', 'Unit Price', 'Quantity', 'Total Price', 'Remove']}>
                {effectiveItems.map((item) => {
                  const discountPct = parseFloat(item.discount || 0);
                  const finalPrice = item.price * (1 - discountPct / 100);
                  const itemTotal = finalPrice * item.quantity;
                  return (
                    <tr key={item.id} className="hover:bg-[#2F2F2F]/5 transition-colors">
                      <td className="py-4">
                        <div className="w-12 h-12 border-editorial rounded-sm overflow-hidden bg-white">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-serif font-medium text-base">{item.name}</span>
                      </td>
                      {!buyNowItem && (
                        <td className="py-4 font-mono text-xs text-[#7A756B]">{item.sku}</td>
                      )}
                      <td className="py-4 text-sm">
                        {discountPct > 0 ? (
                          <div className="space-y-0.5">
                            <span className="text-[#8B5E3C] font-semibold">₹{finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            <span className="text-xs text-[#7A756B] line-through block">₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            <span className="text-[9px] text-green-700 font-semibold">{discountPct}% OFF</span>
                          </div>
                        ) : (
                          <span className="font-semibold">₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        )}
                      </td>
                      <td className="py-4 text-sm">
                        {buyNowItem ? (
                          <span className="font-semibold">{item.quantity}</span>
                        ) : (
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                            className="w-16 border-editorial border-opacity-40 p-1 text-center bg-transparent rounded-sm focus:outline-none focus:border-[#8B5E3C]"
                          />
                        )}
                      </td>
                      <td className="py-4 text-sm font-semibold text-[#2F2F2F]">
                        ₹{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      {!buyNowItem && (
                        <td className="py-4">
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-1 hover:bg-red-50 text-[#7A756B] hover:text-red-700 rounded-sm cursor-pointer transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </Table>
            </Card>

            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#7A756B] hover:text-[#2F2F2F] cursor-pointer"
            >
              <ArrowLeft size={14} /> Continue Shopping
            </button>
          </div>

          {/* Form Side Widget */}
          <div className="space-y-8">
            <Card title="Shipping & Delivery Details" className="shadow-sm">
              {/* Pre-filled address notice */}
              {hasAddress && (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-sm px-4 py-3 mb-5 -mt-1">
                  <div className="flex items-center gap-2 text-xs text-green-800">
                    <CheckCircle size={13} className="text-green-600 shrink-0" />
                    <span className="font-semibold">Address pre-filled from your saved profile.</span>
                    <span className="text-green-700">You can edit it below if needed.</span>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-[#8B5E3C] hover:underline cursor-pointer"
                  >
                    <Edit3 size={10} /> Edit in Profile
                  </Link>
                </div>
              )}

              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-[#7A756B]">First Name *</label>
                    <input
                      type="text"
                      name="first_name"
                      value={customer.first_name}
                      onChange={handleInputChange}
                      required
                      placeholder="Priya"
                      className={`bg-transparent border-editorial border-opacity-40 p-2 text-xs focus:outline-none focus:border-[#8B5E3C] ${errors.first_name ? 'border-red-500 border-opacity-100' : ''}`}
                    />
                    {errors.first_name && <span className="text-[10px] text-red-600 font-sans mt-0.5">{errors.first_name}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-[#7A756B]">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={customer.last_name}
                      onChange={handleInputChange}
                      placeholder="Sharma"
                      className="bg-transparent border-editorial border-opacity-40 p-2 text-xs focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-[#7A756B]">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    required
                    placeholder="name@example.com"
                    className={`bg-transparent border-editorial border-opacity-40 p-2 text-xs focus:outline-none focus:border-[#8B5E3C] ${errors.email ? 'border-red-500 border-opacity-100' : ''}`}
                  />
                  {errors.email && <span className="text-[10px] text-red-600 font-sans mt-0.5">{errors.email}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-[#7A756B]">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="9876543210"
                    className={`bg-transparent border-editorial border-opacity-40 p-2 text-xs focus:outline-none focus:border-[#8B5E3C] ${errors.phone ? 'border-red-500 border-opacity-100' : ''}`}
                  />
                  {errors.phone && <span className="text-[10px] text-red-600 font-sans mt-0.5">{errors.phone}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-[#7A756B]">Address Line 1 *</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={customer.address_line1}
                    onChange={handleInputChange}
                    required
                    placeholder="House No., Street, Area"
                    className={`bg-transparent border-editorial border-opacity-40 p-2 text-xs focus:outline-none focus:border-[#8B5E3C] ${errors.address_line1 ? 'border-red-500 border-opacity-100' : ''}`}
                  />
                  {errors.address_line1 && <span className="text-[10px] text-red-600 font-sans mt-0.5">{errors.address_line1}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-[#7A756B]">Address Line 2 <span className="normal-case font-normal">(optional)</span></label>
                  <input
                    type="text"
                    name="address_line2"
                    value={customer.address_line2}
                    onChange={handleInputChange}
                    placeholder="Landmark, Colony, Flat No."
                    className="bg-transparent border-editorial border-opacity-40 p-2 text-xs focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-[#7A756B]">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={customer.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Mumbai"
                      className={`bg-transparent border-editorial border-opacity-40 p-2 text-xs focus:outline-none focus:border-[#8B5E3C] ${errors.city ? 'border-red-500 border-opacity-100' : ''}`}
                    />
                    {errors.city && <span className="text-[10px] text-red-600 font-sans mt-0.5">{errors.city}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-[#7A756B]">State</label>
                    <input
                      type="text"
                      name="state"
                      value={customer.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      className="bg-transparent border-editorial border-opacity-40 p-2 text-xs focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-[#7A756B]">Pincode *</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={customer.postal_code}
                      onChange={handleInputChange}
                      required
                      placeholder="400001"
                      maxLength={6}
                      className={`bg-transparent border-editorial border-opacity-40 p-2 text-xs focus:outline-none focus:border-[#8B5E3C] ${errors.postal_code ? 'border-red-500 border-opacity-100' : ''}`}
                    />
                    {errors.postal_code && <span className="text-[10px] text-red-600 font-sans mt-0.5">{errors.postal_code}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-[#7A756B]">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={customer.country}
                      onChange={handleInputChange}
                      className="bg-transparent border-editorial border-opacity-40 p-2 text-xs focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>
                 </div>


                {/* Ledger calculation invoice summary */}
                <div className="border-editorial-t border-opacity-20 pt-4 space-y-2 text-xs text-[#7A756B]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#2F2F2F]">₹{cartSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-[#2F2F2F]">₹{shippingFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>18% GST</span>
                    <span className="font-semibold text-[#2F2F2F]">₹{vatTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between border-editorial-t border-opacity-40 pt-2 text-sm font-serif font-bold text-[#2F2F2F]">
                    <span>Total Amount</span>
                    <span className="text-[#8B5E3C]">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5 cursor-pointer text-xs uppercase tracking-widest font-semibold"
                >
                  Proceed to Payment
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;


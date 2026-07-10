import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearCart } from '../../store/slices/cartSlice';
import { saveProfile } from '../../store/slices/profileSlice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { 
  ArrowLeft, CreditCard, Smartphone, Coins, Lock, 
  ShieldCheck, CheckCircle, ChevronRight, ShoppingBag
} from 'lucide-react';

export const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve checkout details passed via route state
  const checkoutData = location.state || null;

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod', 'upi', 'card'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(''); // '', 'processing', 'authorized'

  // Payment Verification Modal States
  const [activePaymentStep, setActivePaymentStep] = useState(''); // '', 'upi_pending', 'card_otp'
  const [upiTimer, setUpiTimer] = useState(45);
  const [otpValue, setOtpValue] = useState('');

  // Handle UPI Timer countdown
  useEffect(() => {
    let interval = null;
    if (activePaymentStep === 'upi_pending') {
      interval = setInterval(() => {
        setUpiTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setActivePaymentStep('');
            alert('UPI Payment Request Timed Out. Please trigger the payment request again.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePaymentStep]);

  if (!checkoutData) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="text-2xl font-serif font-bold">No Active Checkout Session</h2>
        <p className="text-xs text-[#7A756B]">Please return to checkout to confirm details before payment.</p>
        <Button onClick={() => navigate('/checkout')} variant="primary" className="mx-auto">
          Go to Checkout
        </Button>
      </div>
    );
  }

  const {
    customer,
    effectiveItems,
    cartSubtotal,
    shippingFee,
    vatTax,
    totalAmount,
    buyNowItem
  } = checkoutData;

  const submitOrderToBackend = async () => {
    try {
      setSubmitting(true);
      setPaymentStatus('processing');

      // Convert items to api submission format
      const itemsToSubmit = effectiveItems.map(item => {
        const unitPrice = parseFloat(item.price);
        const discountPct = parseFloat(item.discount || 0);
        const discountAmount = parseFloat((unitPrice * discountPct / 100).toFixed(2));
        return {
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: unitPrice,
          discount_amount: discountAmount
        };
      });

      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: itemsToSubmit,
          shipping_amount: shippingFee,
          tax_amount: vatTax
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit order transaction.');
      }

      setPaymentStatus('authorized');

      alert(
        paymentMethod === 'cod'
          ? `Order ${data.id} placed successfully via Cash on Delivery!`
          : `Payment successful! Order ${data.id} placed successfully.`
      );

      // Save delivery details to profile so it pre-fills next time
      dispatch(saveProfile(customer));

      // Only clear cart if it was a cart checkout (not Buy Now)
      if (!buyNowItem) dispatch(clearCart());
      
      navigate(`/orders?id=${data.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
      setPaymentStatus('');
      setActivePaymentStep('');
    }
  };

  const handlePayAndPlaceOrder = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'upi' && !upiId) {
      alert('Please enter your UPI ID.');
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      alert('Please enter complete card details.');
      return;
    }

    if (paymentMethod === 'upi') {
      setActivePaymentStep('upi_pending');
      setUpiTimer(45);
    } else if (paymentMethod === 'card') {
      setActivePaymentStep('card_otp');
      setOtpValue('');
    } else {
      // Cash on delivery proceeds immediately
      await submitOrderToBackend();
    }
  };

  const inputClass = "w-full bg-white border border-[#2F2F2F]/20 px-3 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F] font-sans";
  const labelClass = "block text-[10px] uppercase tracking-widest font-bold text-[#7A756B] mb-1.5";

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2F2F2F]/10 pb-5">
        <div>
          <button
            onClick={() => navigate('/checkout', { state: checkoutData })}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-[#7A756B] hover:text-[#2F2F2F] transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft size={12} /> Back to Checkout
          </button>
          <h1 className="text-3xl font-serif font-bold tracking-wide">Payment Gateway Portal</h1>
          <p className="text-xs text-[#7A756B] mt-1">Complete your transaction to finalize order allocation.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B5E3C]">
          <Lock size={13} /> Secure 256-bit SSL Connection
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Side: Payment Method Options */}
        <div className="lg:col-span-3 space-y-6">
          <Card title="Choose Payment Option" className="shadow-sm">
            <form onSubmit={handlePayAndPlaceOrder} className="space-y-6">
              {/* Payment selector row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'cod', name: 'Cash on Delivery', icon: Coins, desc: 'Pay with cash upon package receipt' },
                  { id: 'upi', name: 'UPI / Instant Pay', icon: Smartphone, desc: 'Pay instantly via GPay/PhonePe' },
                  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, desc: 'Pay securely using cards' }
                ].map(({ id, name, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 border rounded-sm text-center transition-all duration-300 cursor-pointer ${
                      paymentMethod === id
                        ? 'border-[#8B5E3C] bg-[#8B5E3C]/5 text-[#8B5E3C] font-bold shadow-sm'
                        : 'border-[#2F2F2F]/20 text-[#7A756B] hover:border-[#8B5E3C]/50 hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">{name}</span>
                  </button>
                ))}
              </div>

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div className="space-y-2 p-4 bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm animate-fadeIn">
                  <label className={labelClass}>UPI Address ID *</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    required
                    className={inputClass}
                  />
                  <p className="text-[10px] text-[#7A756B]">Enter your valid UPI address to push a checkout payment request notification on your smartphone app.</p>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 p-4 bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm animate-fadeIn">
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Card Number *</label>
                    <div className="relative">
                      <CreditCard size={14} className="absolute left-3 top-3.5 text-[#7A756B]" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => {
                          const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                          const matches = val.match(/\d{4,16}/g);
                          const match = matches && matches[0] || '';
                          const parts = [];
                          for (let i = 0, len = match.length; i < len; i += 4) {
                            parts.push(match.substring(i, i + 4));
                          }
                          if (parts.length > 0) {
                            setCardNumber(parts.join(' '));
                          } else {
                            setCardNumber(val.slice(0, 19));
                          }
                        }}
                        placeholder="4111 2222 3333 4444"
                        maxLength={19}
                        required
                        className={`${inputClass} pl-9 font-mono`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Expiry Date *</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => {
                          let val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length >= 2) {
                            val = val.slice(0, 2) + '/' + val.slice(2, 4);
                          }
                          setCardExpiry(val.slice(0, 5));
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        className={`${inputClass} text-center font-mono`}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>CVV / CVC *</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                        placeholder="***"
                        maxLength={3}
                        required
                        className={`${inputClass} text-center font-mono`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Payment Action */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  className="w-full py-3 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authorizing Payment Gateway...
                    </>
                  ) : paymentStatus === 'authorized' ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle size={14} /> Transaction Authorized!
                    </span>
                  ) : paymentMethod === 'cod' ? (
                    'Place Order (Cash on Delivery)'
                  ) : (
                    `Pay ₹${totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} & Place Order`
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Side: Order & Address review */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Summary */}
          <Card title="Summary Ledger" className="shadow-sm">
            <div className="space-y-3.5 text-xs text-[#7A756B]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#2F2F2F]">₹{cartSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span className="font-semibold text-[#2F2F2F]">₹{shippingFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>18% GST Allocation</span>
                <span className="font-semibold text-[#2F2F2F]">₹{vatTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between border-t border-[#2F2F2F]/10 pt-3 text-sm font-serif font-bold text-[#2F2F2F]">
                <span>Total Amount Due</span>
                <span className="text-[#8B5E3C] text-base">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </Card>

          {/* Delivery Review */}
          <Card title="Ship To" className="shadow-sm text-xs space-y-2">
            <p className="font-serif font-bold text-sm text-[#2F2F2F]">{customer.first_name} {customer.last_name}</p>
            <p className="text-[#7A756B] leading-relaxed">
              {customer.address_line1}
              {customer.address_line2 && <span className="block">{customer.address_line2}</span>}
              <span className="block">{customer.city}, {customer.state} — {customer.postal_code}</span>
              <span className="block">{customer.country}</span>
            </p>
            {customer.phone && <p className="text-[#7A756B] pt-1">📞 {customer.phone}</p>}
          </Card>

          {/* Trust points */}
          <div className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-4 text-[10px] text-[#7A756B] space-y-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-green-700 shrink-0" />
              <span>Your payment details are encrypted & never stored.</span>
            </div>
            <p className="leading-relaxed">By finalizing this request, you authorize Velora to verify your funds or schedule delivery via Cash on Delivery.</p>
          </div>
        </div>
      </div>

      {/* UPI Pending Modal */}
      {activePaymentStep === 'upi_pending' && (
        <div className="fixed inset-0 bg-[#2F2F2F]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#FAF8F3] border-editorial p-8 max-w-md w-full rounded-sm shadow-vintage-flat space-y-6 text-center animate-fadeIn">
            <div className="flex flex-col items-center space-y-2">
              <Smartphone size={40} className="text-[#8B5E3C] animate-pulse" />
              <h3 className="font-serif font-bold text-xl text-[#2F2F2F]">UPI Payment Request Sent</h3>
              <p className="text-[11px] text-[#7A756B]">
                We have pushed a request of <strong className="text-[#2F2F2F]">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> to your UPI ID:
              </p>
              <div className="bg-[#FAF8F3] border border-[#2F2F2F]/15 px-4 py-1.5 rounded-sm font-mono text-xs font-bold text-[#8B5E3C]">
                {upiId}
              </div>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex justify-center items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-[#8B5E3C]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs font-bold tracking-wider uppercase text-[#2F2F2F]">Waiting for Authorization...</span>
              </div>
              <p className="text-[10px] text-[#7A756B]">
                Open your GPay, PhonePe, BHIM, or bank app and check notifications to approve the request.
              </p>
              <div className="text-sm font-mono font-bold text-[#8B5E3C]">
                Time Remaining: 00:{String(upiTimer).padStart(2, '0')}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={submitOrderToBackend}
                className="w-full bg-[#8B5E3C] hover:bg-[#6C4E31] text-white py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-colors cursor-pointer"
              >
                [SIMULATE] Approve Payment in UPI App
              </button>
              <button
                onClick={() => setActivePaymentStep('')}
                className="w-full border border-[#2F2F2F]/20 hover:bg-[#2F2F2F]/5 text-[#7A756B] py-2 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-colors cursor-pointer"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card OTP Modal */}
      {activePaymentStep === 'card_otp' && (
        <div className="fixed inset-0 bg-[#2F2F2F]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#FAF8F3] border-editorial p-8 max-w-md w-full rounded-sm shadow-vintage-flat space-y-6 text-center animate-fadeIn">
            <div className="flex flex-col items-center space-y-2">
              <Lock size={40} className="text-[#8B5E3C]" />
              <h3 className="font-serif font-bold text-xl text-[#2F2F2F]">3D Secure OTP Verification</h3>
              <p className="text-[11px] text-[#7A756B]">
                A One-Time Password (OTP) has been sent to the mobile number registered with your card ending in **** {cardNumber.slice(-4)}.
              </p>
            </div>

            <div className="py-2 space-y-3 text-left">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#7A756B] mb-1.5 text-center">
                Enter 6-Digit OTP *
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={e => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-2.5 text-center font-mono text-base focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F] tracking-widest"
              />
              <div className="flex justify-between items-center text-[9px] text-[#7A756B] px-1">
                <span>Transaction amount: <strong>₹{totalAmount.toLocaleString('en-IN')}</strong></span>
                <button
                  type="button"
                  onClick={() => { setOtpValue('123456'); }}
                  className="text-[#8B5E3C] hover:underline cursor-pointer font-bold"
                >
                  [SIMULATE] Auto-fill OTP
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (otpValue.length !== 6) {
                    alert('Please enter a valid 6-digit OTP.');
                    return;
                  }
                  submitOrderToBackend();
                }}
                className="w-full bg-[#8B5E3C] hover:bg-[#6C4E31] text-white py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-colors cursor-pointer"
              >
                Verify & Complete Payment
              </button>
              <button
                onClick={() => setActivePaymentStep('')}
                className="w-full border border-[#2F2F2F]/20 hover:bg-[#2F2F2F]/5 text-[#7A756B] py-2 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-colors cursor-pointer"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;

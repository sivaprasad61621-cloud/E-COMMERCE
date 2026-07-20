import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function PaymentModal({ isOpen, onClose, totalAmount, onPaymentSuccess }) {
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expDate, setExpDate] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [nameOnCard, setNameOnCard] = useState('Valued Customer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [receipt, setReceipt] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsProcessing(true);

    try {
      const [expMonth, expYear] = expDate.split('/');
      const res = await fetch('http://localhost:5000/api/orders/checkout-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: nameOnCard,
            email: 'customer@sshopping.com',
          },
          items: [
            { id: 'm-el-1', name: 'Apple MacBook Air M2', price: totalAmount, quantity: 1 }
          ],
          paymentDetails: {
            cardNumber,
            expMonth: expMonth || '12',
            expYear: expYear || '28',
            cvc,
          }
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      setReceipt(data.payment);
      if (onPaymentSuccess) {
        onPaymentSuccess(data);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-6 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <CreditCard className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif">Secure Payment Gateway</h3>
              <p className="text-amber-100/80 text-xs mt-0.5">Test Mode Active • Instant Processing</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/15 flex justify-between items-baseline">
            <span className="text-sm text-amber-100/90">Total Payable:</span>
            <span className="text-2xl font-extrabold text-white font-mono">
              ₹{parseFloat(totalAmount || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {receipt ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800">Payment Successful!</h4>
              <p className="text-slate-500 text-sm mt-1">Transaction ID: <span className="font-mono text-slate-700 font-medium">{receipt.transactionId}</span></p>
              <p className="text-slate-500 text-sm">Receipt: <span className="font-mono text-amber-800 font-semibold">{receipt.receiptNumber}</span></p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-xs text-left text-slate-600 space-y-1 font-mono">
              <div className="flex justify-between"><span>Payment Method:</span><span>{receipt.paymentMethod?.brand} (•••• {receipt.paymentMethod?.last4})</span></div>
              <div className="flex justify-between"><span>Status:</span><span className="text-emerald-600 font-bold uppercase">{receipt.status}</span></div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-xl transition shadow-lg shadow-amber-900/20"
            >
              Back to Store
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Name on Card</label>
              <input
                type="text"
                required
                value={nameOnCard}
                onChange={e => setNameOnCard(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Card Number (Test Mode)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                />
                <CreditCard className="w-5 h-5 text-slate-400 absolute right-3 top-3" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Use <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">4242 4242...</code> for success, or ending with <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">0000</code> to test card decline.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Expires (MM/YY)</label>
                <input
                  type="text"
                  required
                  value={expDate}
                  onChange={e => setExpDate(e.target.value)}
                  placeholder="12/28"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">CVC / CVV</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={cvc}
                  onChange={e => setCvc(e.target.value)}
                  placeholder="123"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-semibold rounded-xl transition shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 text-sm disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{parseFloat(totalAmount || 0).toLocaleString()} Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;

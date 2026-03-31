import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import CheckoutForm from './CheckoutForm';

// Initialize Stripe with your public key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_please_add_your_key');

const TopUpModal = ({ isOpen, onClose, onSuccess, savedPaymentMethods = [] }) => {
  console.log('TopUpModal isOpen:', isOpen);
  const [amount, setAmount] = useState('');
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('');

  const handleInitiateTopUp = async (e) => {
    e.preventDefault();
    if (!amount || amount < 50) {
      toast.error('Minimum top-up amount is ₹50');
      return;
    }

    if (process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY === 'pk_test_...' || !process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
      toast.error('Stripe Publishable Key is missing in frontend/.env');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number(amount),
          paymentMethodId: selectedPaymentMethodId || undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        setClientSecret(data.clientSecret);
      } else {
        toast.error(data.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Top-up initiation failed:', error);
      toast.error('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-navy uppercase tracking-tight">Top Up Wallet</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!clientSecret ? (
          <form onSubmit={handleInitiateTopUp} className="space-y-6">
            {savedPaymentMethods.length > 0 && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-navy/40 uppercase tracking-widest mb-1 ml-1 text-center">
                  Pay with saved card (optional)
                </label>
                <select
                  value={selectedPaymentMethodId}
                  onChange={(e) => setSelectedPaymentMethodId(e.target.value)}
                  className="w-full rounded-2xl border border-navy/10 bg-soft-white px-4 py-3 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-sky-blue/30 focus:border-sky-blue/40"
                >
                  <option value="">Use a new card</option>
                  {savedPaymentMethods.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.brand?.toUpperCase?.() || 'CARD'} •••• {pm.last4} (exp {pm.exp_month}/{pm.exp_year})
                    </option>
                  ))}
                </select>
                <p className="text-center text-[10px] font-bold text-navy/30 uppercase tracking-widest">
                  Selecting a saved card skips card entry
                </p>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-navy/40 uppercase tracking-widest mb-3 ml-1 text-center">Enter Amount (INR)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-navy/20">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-14 pr-6 py-8 text-4xl font-black text-center text-navy bg-soft-white border-2 border-transparent focus:border-navy focus:bg-white rounded-[2rem] transition-all outline-none"
                  autoFocus
                  required
                  min="50"
                />
              </div>
              <p className="mt-3 text-center text-[10px] font-bold text-navy/30 uppercase tracking-widest">Minimum top-up: ₹50</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[500, 1000, 2000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className="py-3 px-4 rounded-2xl bg-navy/5 text-navy font-black text-xs hover:bg-navy hover:text-white transition-all transform active:scale-95"
                >
                  +₹{val}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !amount}
              className="w-full py-5 bg-navy text-soft-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-navy/20 hover:bg-sky-blue transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Initializing...' : 'Proceed to Payment'}
            </button>
          </form>
        ) : (
          <div className="animate-in slide-in-from-right duration-500">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                clientSecret={clientSecret}
                amount={amount}
                paymentMethodId={selectedPaymentMethodId || undefined}
                onSuccess={() => {
                  onSuccess();
                  onClose();
                }}
                onCancel={() => setClientSecret(null)}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default TopUpModal;

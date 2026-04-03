import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import CheckoutForm from './CheckoutForm';
import { X, Wallet, ChevronRight, CheckCircle2, CreditCard } from 'lucide-react';
import ThemeButton from '../ui/ThemeButton';
import ThemeInput from '../ui/ThemeInput';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize Stripe with your public key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_please_add_your_key');

const TopUpModal = ({ isOpen, onClose, onSuccess, savedPaymentMethods = [] }) => {
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

    if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_please')) {
      toast.error('Stripe Configuration Missing');
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
      toast.error('Network error. Check backend status.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass border border-[var(--border-color)] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />

        <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Wallet size={22} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-[var(--text-main)]">Top Up Wallet</h2>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Instant Liquidity</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all">
                <X size={20} />
            </button>
        </div>

        {!clientSecret ? (
          <form onSubmit={handleInitiateTopUp} className="space-y-6 relative z-10">
            {savedPaymentMethods.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">
                  Payment Method
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-muted)]">
                        <CreditCard size={18} />
                    </div>
                    <select
                        value={selectedPaymentMethodId}
                        onChange={(e) => setSelectedPaymentMethodId(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-[var(--border-color)] text-sm font-bold text-[var(--text-main)] outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                    >
                        <option value="" className="bg-[var(--bg-color)]">Use New Payment Method</option>
                        {savedPaymentMethods.map((pm) => (
                            <option key={pm.id} value={pm.id} className="bg-[var(--bg-color)]">
                                {pm.brand?.toUpperCase?.() || 'CARD'} •••• {pm.last4}
                            </option>
                        ))}
                    </select>
                </div>
                <p className="text-[9px] font-bold text-primary uppercase tracking-widest text-center">
                   {selectedPaymentMethodId ? 'Saved card selected · Quick checkout' : 'Secure card entry required next'}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-center block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                Amount (INR)
              </label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-primary/30 group-focus-within:text-primary transition-colors">₹</div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-14 pr-6 py-8 text-5xl font-black text-center text-[var(--text-main)] bg-white/5 border-2 border-transparent focus:border-primary/30 rounded-[2rem] transition-all outline-none"
                  autoFocus
                  required
                  min="50"
                />
              </div>
              <p className="text-center text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Min. top-up: ₹50</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[500, 1000, 2000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className="py-3 px-4 rounded-xl glass border border-[var(--border-color)] text-[var(--text-main)] font-black text-xs hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all transform active:scale-95"
                >
                  +₹{val}
                </button>
              ))}
            </div>

            <ThemeButton
              type="submit"
              disabled={loading || !amount}
              className="w-full py-5 text-sm shadow-xl shadow-primary/20"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Initializing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                    Add Funds Now <ChevronRight size={18} />
                </div>
              )}
            </ThemeButton>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 relative z-10"
          >
            <div className="flex items-center justify-between px-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Secure Checkout</p>
                <div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase tracking-widest">
                    <CheckCircle2 size={12} /> Encrypted
                </div>
            </div>
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
          </motion.div>
        )}
      </motion.div>
    </div>,
    document.body
  );
};

export default TopUpModal;

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { X, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import ThemeButton from '../ui/ThemeButton';
import { motion, AnimatePresence } from 'framer-motion';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_please_add_your_key');

const AddCardInner = ({ clientSecret, onClose, onAdded, theme }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: 'CabZee User' }
        }
      });

      if (result.error) {
        toast.error(result.error.message || 'Failed to save card');
        return;
      }

      if (result.setupIntent?.status === 'succeeded') {
        toast.success('Card saved successfully');
        onAdded();
        onClose();
      } else {
        toast.error('Card setup not completed');
      }
    } finally {
      setProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: theme === 'dark' ? '#f8fafc' : '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
        '::placeholder': {
          color: theme === 'dark' ? '#64748b' : '#94a3b8',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-white/5 transition-all">
        <CardElement options={cardStyle} />
      </div>

      <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest justify-center">
        <ShieldCheck size={12} className="text-primary" />
        Secure 256-bit SSL encrypted payment
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <ThemeButton
          type="submit"
          disabled={!stripe || processing}
          className="w-full py-4 shadow-lg shadow-primary/20"
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Securing Link...
            </div>
          ) : (
            'Authorize & Save Card'
          )}
        </ThemeButton>
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="w-full py-3 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const AddCardModal = ({ isOpen, onClose, onAdded }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setLoading(false);
      return;
    }

    const run = async () => {
      if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_please')) {
        toast.error('Stripe Configuration Missing');
        onClose();
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/payments/create-setup-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) setClientSecret(data.clientSecret);
        else toast.error(data.message || 'Failed to initiate card setup');
      } catch (e) {
        toast.error('Network error. Check backend status.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [isOpen]);

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
                <CreditCard size={22} />
            </div>
            <div>
                <h2 className="text-xl font-black text-[var(--text-main)]">Add Payment Card</h2>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">PCI DSS Compliant</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center gap-4 text-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-bold text-[var(--text-muted)] animate-pulse uppercase tracking-widest">Opening Secure Portal</p>
          </div>
        ) : (
          clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <AddCardInner clientSecret={clientSecret} onClose={onClose} onAdded={onAdded} theme={theme} />
            </Elements>
          )
        )}
      </motion.div>
    </div>,
    document.body
  );
};

export default AddCardModal;

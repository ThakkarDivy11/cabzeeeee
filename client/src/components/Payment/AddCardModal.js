import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_please_add_your_key');

const AddCardInner = ({ clientSecret, onClose, onAdded }) => {
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
        toast.success('Card saved');
        onAdded();
        onClose();
      } else {
        toast.error('Card setup not completed');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#111827',
              '::placeholder': { color: '#9CA3AF' }
            },
            invalid: { color: '#EF4444' }
          }
        }} />
      </div>

      <div className="flex flex-col space-y-3">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          {processing ? 'Saving...' : 'Save Card'}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
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

  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setLoading(false);
      return;
    }

    const run = async () => {
      if (process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY === 'pk_test_...' || !process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
        toast.error('Stripe Publishable Key is missing in frontend/.env');
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
        toast.error('Network error. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900">Add Card</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="py-10 text-center text-gray-600 font-semibold">Preparing secure card form...</div>
        )}

        {!loading && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <AddCardInner clientSecret={clientSecret} onClose={onClose} onAdded={onAdded} />
          </Elements>
        )}
      </div>
    </div>,
    document.body
  );
};

export default AddCardModal;


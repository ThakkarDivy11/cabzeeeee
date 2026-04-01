import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TopUpModal from './TopUpModal';
import AddCardModal from './AddCardModal';

const ManagePaymentMethods = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTopUp, setShowTopUp] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);
    const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
    const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);

    const navigate = useNavigate();

    const fetchUserData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.data);
                await fetchSavedPaymentMethods();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to load payment methods');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const fetchSavedPaymentMethods = async () => {
        setPaymentMethodsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/payments/payment-methods`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setSavedPaymentMethods(data.data || []);
            } else {
                setSavedPaymentMethods([]);
            }
        } catch (e) {
            setSavedPaymentMethods([]);
        } finally {
            setPaymentMethodsLoading(false);
        }
    };

    const handleRemovePaymentMethod = async (pmId) => {
        if (!window.confirm('Remove this saved card?')) return;
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/payments/payment-methods/${pmId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Card removed');
                fetchSavedPaymentMethods();
            } else {
                toast.error(data.message || 'Failed to remove card');
            }
        } catch (e) {
            toast.error('Failed to remove card');
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    return (
        <div className="min-h-screen bg-soft-white">
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-navy/5 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-14 sm:h-16 gap-3">
                        <button onClick={() => navigate('/rider')} className="p-2 rounded-xl bg-navy/5 text-navy hover:bg-navy hover:text-soft-white transition-all active:scale-95">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-base sm:text-xl font-black text-navy tracking-tight">Payment Methods</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto py-5 sm:py-8 px-4 sm:px-6 lg:px-8">
                {/* Wallet Section */}
                <div className="bg-navy text-soft-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-5 sm:mb-8 shadow-xl shadow-navy/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -mr-10 -mt-10" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 relative z-10">
                        <div className="min-w-0">
                            <p className="text-soft-white/40 text-[10px] font-bold uppercase tracking-widest">CabZee Wallet Balance</p>
                            <h2 className="text-3xl sm:text-4xl font-black mt-1.5 tracking-tight">₹{user?.walletBalance?.toFixed(2) || '0.00'}</h2>
                            <button
                                onClick={() => setShowTopUp(true)}
                                className="mt-3 bg-white text-navy px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-sky-blue hover:text-white transition-all active:scale-95 inline-block"
                            >
                                + Add Money
                            </button>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/10">
                            <svg className="w-6 h-6 text-soft-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <TopUpModal
                    isOpen={showTopUp}
                    onClose={() => setShowTopUp(false)}
                    onSuccess={fetchUserData}
                    savedPaymentMethods={savedPaymentMethods}
                />

                {/* Saved Cards Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-base sm:text-lg font-black text-navy">Saved Cards</h3>
                        <button
                            onClick={() => setShowAddCard(true)}
                            className="text-xs sm:text-sm font-bold text-sky-blue-600 hover:text-sky-blue-800 uppercase tracking-wider"
                        >
                            + Add Card
                        </button>
                    </div>

                    {paymentMethodsLoading && (
                        <div className="text-center py-8 bg-white rounded-xl border border-navy/5 border-dashed">
                            <p className="text-navy/40 text-sm font-semibold">Loading saved cards…</p>
                        </div>
                    )}

                    {!paymentMethodsLoading && savedPaymentMethods.length === 0 && (
                        <div className="text-center py-10 bg-white rounded-xl border border-navy/5 border-dashed">
                            <p className="text-navy/30 text-sm font-semibold">No saved cards yet.</p>
                            <button onClick={() => setShowAddCard(true)} className="mt-3 text-xs font-bold text-sky-blue-600 uppercase tracking-wider">
                                Add your first card →
                            </button>
                        </div>
                    )}

                    {!paymentMethodsLoading && savedPaymentMethods.map((card) => (
                        <div key={card.id} className="bg-white p-4 rounded-xl shadow-level-1 border border-navy/5 flex items-center gap-3">
                            <div className="w-12 h-8 bg-navy/5 rounded-lg flex items-center justify-center text-[10px] font-black text-navy/50 flex-shrink-0 border border-navy/8">
                                {(card.brand || 'Card').toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-navy text-sm">•••• •••• •••• {card.last4}</p>
                                <p className="text-xs text-navy/35 font-semibold">Expires {card.exp_month}/{card.exp_year}</p>
                            </div>
                            <button
                                onClick={() => handleRemovePaymentMethod(card.id)}
                                className="text-xs font-bold text-danger hover:text-danger/80 flex-shrink-0 px-2 py-1 rounded-lg hover:bg-danger/5 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <AddCardModal
                        isOpen={showAddCard}
                        onClose={() => setShowAddCard(false)}
                        onAdded={fetchSavedPaymentMethods}
                    />
                </div>
            </main>
        </div>
    );
};

export default ManagePaymentMethods;

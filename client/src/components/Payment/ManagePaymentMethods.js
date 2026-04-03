import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreditCard, ChevronLeft, Wallet } from 'lucide-react';
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

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/rider')} 
                    className="p-3 rounded-full hover:bg-primary/10 text-[var(--text-main)] hover:text-primary transition-all duration-300"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-[var(--text-main)]">Payment Methods</h1>
                    <p className="text-sm font-medium text-[var(--text-muted)]">Manage your wallet and saved cards</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Left Col: Wallet */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Wallet</h3>
                    <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-[2rem] p-6 lg:p-8 shadow-2xl shadow-primary/30 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-black uppercase tracking-widest text-white/70">CabZee Balance</p>
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                    <Wallet size={20} />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-4xl font-black mb-1">₹{user?.walletBalance?.toFixed(2) || '0.00'}</h2>
                                <p className="text-xs font-medium text-white/80">Available for rides</p>
                            </div>
                            <button
                                onClick={() => setShowTopUp(true)}
                                className="w-full bg-white text-primary px-5 py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                            >
                                + Add Money
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Col: Saved Cards */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between ml-1">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Saved Cards</h3>
                        <button
                            onClick={() => setShowAddCard(true)}
                            className="text-xs font-black text-primary uppercase tracking-wider hover:underline underline-offset-4"
                        >
                            + Add Card
                        </button>
                    </div>

                    <div className="glass rounded-[2rem] p-4 lg:p-6 border border-[var(--border-color)]">
                        {paymentMethodsLoading && (
                            <div className="text-center py-10">
                                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                            </div>
                        )}

                        {!paymentMethodsLoading && savedPaymentMethods.length === 0 && (
                            <div className="text-center py-12 rounded-2xl border-2 border-dashed border-[var(--border-color)]">
                                <CreditCard size={32} className="mx-auto text-[var(--text-muted)] opacity-50 mb-3" />
                                <p className="text-[var(--text-muted)] font-bold mb-4">No saved cards found.</p>
                                <button 
                                    onClick={() => setShowAddCard(true)} 
                                    className="bg-primary/10 text-primary px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-colors"
                                >
                                    Add your first card
                                </button>
                            </div>
                        )}

                        {!paymentMethodsLoading && savedPaymentMethods.map((card) => (
                            <div key={card.id} className="p-5 mb-4 last:mb-0 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-color)] flex items-center justify-between group hover:neon-border transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-10 bg-[var(--border-color)] rounded-lg flex items-center justify-center text-[10px] font-black text-[var(--text-muted)] flex-shrink-0">
                                        {(card.brand || 'Card').toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--text-main)] text-sm tracking-widest">•••• •••• •••• {card.last4}</p>
                                        <p className="text-xs text-[var(--text-muted)] font-bold mt-0.5">Expires {card.exp_month}/{card.exp_year}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemovePaymentMethod(card.id)}
                                    className="text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-all"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <TopUpModal
                isOpen={showTopUp}
                onClose={() => setShowTopUp(false)}
                onSuccess={fetchUserData}
                savedPaymentMethods={savedPaymentMethods}
            />

            <AddCardModal
                isOpen={showAddCard}
                onClose={() => setShowAddCard(false)}
                onAdded={fetchSavedPaymentMethods}
            />
        </div>
    );
};

export default ManagePaymentMethods;

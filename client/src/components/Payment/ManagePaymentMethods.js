import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
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
    };

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
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button onClick={() => navigate('/rider')} className="mr-4 text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">Payment Methods</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Wallet Section */}
                <div className="bg-black text-white rounded-2xl p-6 mb-8 shadow-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">CabZee Wallet Balance</p>
                            <div className="flex items-center mt-2 space-x-4">
                                <h2 className="text-4xl font-bold">₹{user?.walletBalance?.toFixed(2) || '0.00'}</h2>
                                <button
                                    onClick={() => {
                                        console.log('Add Money clicked');
                                        setShowTopUp(true);
                                    }}
                                    className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-sky-blue hover:text-white transition-all transform active:scale-95"
                                >
                                    Add Money
                                </button>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="space-y-4">
                    <div className="flex justify-between items-end mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Saved Cards</h3>
                        <button
                            onClick={() => setShowAddCard(true)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            + Add New Card
                        </button>
                    </div>

                    {paymentMethodsLoading && (
                        <div className="text-center py-8 bg-white rounded-lg border border-gray-200 border-dashed">
                            <p className="text-gray-500">Loading saved cards…</p>
                        </div>
                    )}

                    {!paymentMethodsLoading && savedPaymentMethods.length === 0 && (
                        <div className="text-center py-8 bg-white rounded-lg border border-gray-200 border-dashed">
                            <p className="text-gray-500">No saved cards yet.</p>
                        </div>
                    )}

                    {!paymentMethodsLoading && savedPaymentMethods.map((card) => (
                        <div key={card.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                                    {(card.brand || 'Card').toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">•••• •••• •••• {card.last4}</p>
                                    <p className="text-xs text-gray-500">Expires {card.exp_month}/{card.exp_year}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemovePaymentMethod(card.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
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

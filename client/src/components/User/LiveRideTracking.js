import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import socketService from '../../services/socketService';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../Payment/CheckoutForm';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Star, 
  Wallet, 
  CreditCard, 
  ChevronLeft,
  X,
  CheckCircle2,
  Phone,
  MessageCircle,
  Car
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeCard from '../ui/ThemeCard';
import ThemeButton from '../ui/ThemeButton';
import { useTheme } from '../../context/ThemeContext';
import './LiveRideTracking.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_please_add_your_key');

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const carIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png', // Modern car icon
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: 'custom-car-marker'
});

// Map Component to handle routing
const Routing = ({ start, end, onRouteUpdate, theme }) => {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map) return;

        if (!routingControlRef.current) {
            routingControlRef.current = L.Routing.control({
                waypoints: [],
                routeWhileDragging: false,
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: true,
                showAlternatives: false,
                lineOptions: {
                    styles: [{ color: theme === 'dark' ? '#7c3aed' : '#3b82f6', weight: 6, opacity: 0.8 }]
                },
                createMarker: () => null 
            }).addTo(map);

            routingControlRef.current.on('routesfound', function(e) {
                const routes = e.routes;
                if (routes && routes.length > 0) {
                    const summary = routes[0].summary;
                    onRouteUpdate({
                        distance: parseFloat((summary.totalDistance / 1000).toFixed(1)),
                        duration: Math.round(summary.totalTime / 60)
                    });
                }
            });

            const container = routingControlRef.current.getContainer();
            if (container) container.style.display = 'none';
        }

        return () => {
            if (routingControlRef.current) {
                try {
                    routingControlRef.current.remove();
                } catch (e) {}
                routingControlRef.current = null;
            }
        };
    }, [map, onRouteUpdate, theme]);

    useEffect(() => {
        if (routingControlRef.current && start && end) {
            try {
                const wp1 = L.latLng(start[0], start[1]);
                const wp2 = L.latLng(end[0], end[1]);
                routingControlRef.current.setWaypoints([wp1, wp2]);
            } catch (err) {}
        }
    }, [start, end]);

    return null;
};

const LiveRideTracking = () => {
    const { rideId } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [ride, setRide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [driverLocation, setDriverLocation] = useState(null);
    const [routeInfo, setRouteInfo] = useState({ distance: 0, duration: 0 });
    const [status, setStatus] = useState('Initiating Trip');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [savedCards, setSavedCards] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState('');
    const [clientSecret, setClientSecret] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [rating, setRating] = useState(5);
    const [submittingRating, setSubmittingRating] = useState(false);

    const fetchSavedCards = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/payments/payment-methods`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setSavedCards(data.data);
        } catch (error) {}
    };

    const fetchRideDetails = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/rides/${rideId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setRide(data.data);
                
                const s = data.data.status;
                if (s === 'accepted') setStatus('Driver Coming');
                else if (s === 'arrived') setStatus('Driver Arrived');
                else if (s === 'on_board' || s === 'picked-up') setStatus('On Board');
                else if (s === 'completed') {
                    setStatus('Ride Completed');
                    if (!data.data.isPaid) {
                        setShowPaymentModal(true);
                        fetchSavedCards();
                    } else if (!data.data.driverRating) {
                        setShowRatingModal(true);
                    }
                }
                
                if (data.data.currentDriverLocation) {
                    setDriverLocation([data.data.currentDriverLocation.latitude, data.data.currentDriverLocation.longitude]);
                }
            } else {
                navigate('/rider');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [rideId, navigate]);

    useEffect(() => {
        fetchRideDetails();
        socketService.connect();
        socketService.joinRide(rideId);

        socketService.onLocationUpdate((data) => {
            setDriverLocation([data.latitude, data.longitude]);
        });

        socketService.onStatusUpdate((data) => {
            setRide(prev => ({ ...prev, status: data.status }));
            if (data.status === 'on_board') setStatus('On Board');
            else if (data.status === 'completed') {
                setStatus('Ride Completed');
                setShowPaymentModal(true);
                fetchSavedCards();
            }
        });

        return () => {
            socketService.leaveRide(rideId);
            socketService.removeAllListeners();
        };
    }, [rideId, fetchRideDetails]);

    const handleInitiatePayment = async (e) => {
        e.preventDefault();
        setProcessingPayment(true);
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            if (paymentMethod === 'wallet') {
                const response = await fetch(`${apiUrl}/api/payments/confirm-ride-payment/${rideId}`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ method: 'wallet' })
                });
                const data = await response.json();
                if (data.success) {
                    toast.success('Paid via Wallet');
                    setShowPaymentModal(false);
                    setShowRatingModal(true);
                } else toast.error(data.message || 'Payment failed');
            } else if (paymentMethod === 'card') {
                const response = await fetch(`${apiUrl}/api/payments/create-ride-payment-intent/${rideId}`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ paymentMethodId: selectedCardId || undefined })
                });
                const data = await response.json();
                if (data.success) setClientSecret(data.clientSecret);
                else toast.error(data.message || 'Payment failed');
            }
        } catch (error) {
            toast.error('Network Error');
        } finally {
            setProcessingPayment(false);
        }
    };

    const handleRatingSubmit = async () => {
        setSubmittingRating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/rides/${rideId}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ rating })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Thank you for riding with CabZee!');
                setShowRatingModal(false);
                setTimeout(() => navigate('/rider'), 2500);
            }
        } catch (error) {} finally {
            setSubmittingRating(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-color)] gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-black text-primary animate-pulse tracking-widest uppercase">Initializing Telemetry</p>
        </div>
    );
    if (!ride) return <div className="flex h-screen items-center justify-center bg-[var(--bg-color)] text-red-500 font-bold uppercase tracking-widest">Signal Lost: Error 404</div>;

    const pickup = [ride.pickupLocation.coordinates[1], ride.pickupLocation.coordinates[0]];
    const destination = [ride.dropLocation.coordinates[1], ride.dropLocation.coordinates[0]];

    const tileUrl = theme === 'dark' 
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    return (
        <div className="live-ride-container">
            {/* Control Sidebar */}
            <aside className="sidebar-dashboard relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />
                
                <header className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg">
                            <span className="font-black text-xs">CZ</span>
                         </div>
                         <h1 className="text-xl font-black text-[var(--text-main)] tracking-tight">CABZEE</h1>
                    </div>
                </header>

                <ThemeCard className="relative overflow-hidden mb-8 border-primary/30">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="live-pulse w-3 h-3 bg-green-500 rounded-full" />
                        <h2 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tighter">{status}</h2>
                    </div>

                    <div className="status-steps">
                        <div className="absolute top-[7px] left-2 right-2 h-0.5 bg-white/5 -z-10" />
                        <div className={`absolute top-[7px] left-2 h-0.5 bg-primary -z-10 transition-all duration-1000 ${
                            status === 'Ride Completed' ? 'w-[calc(100%-20px)]' : 
                            status === 'On Board' ? 'w-[calc(70%-20px)]' : 
                            ['Driver Arrived', 'Driver Coming'].includes(status) ? 'w-[calc(35%-20px)]' : 'w-0'
                        }`} />
                        
                        <div className="status-step active">
                            <div className="step-dot" />
                            <span className="step-label">Booking</span>
                        </div>
                        <div className={`status-step ${['accepted', 'arrived', 'on_board', 'picked-up', 'completed'].includes(ride.status) ? 'active' : ''}`}>
                            <div className="step-dot" />
                            <span className="step-label">Tracking</span>
                        </div>
                        <div className={`status-step ${['on_board', 'picked-up', 'completed'].includes(ride.status) ? 'active' : ''}`}>
                            <div className="step-dot" />
                            <span className="step-label">On Board</span>
                        </div>
                        <div className={`status-step ${['completed'].includes(ride.status) ? 'active' : ''}`}>
                            <div className="step-dot" />
                            <span className="step-label">Success</span>
                        </div>
                    </div>
                </ThemeCard>

                {/* Security OTP */}
                {ride.pickupOTP && !ride.otpVerified && !['on_board', 'picked-up', 'completed'].includes(ride.status) && (
                    <div className="p-6 rounded-[2rem] glass border-2 border-dashed border-primary/30 bg-primary/5 text-center mb-8 relative">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Security Protocol OTP</p>
                        <div className="flex justify-center gap-3">
                            {ride.pickupOTP.split('').map((digit, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="w-12 h-16 flex items-center justify-center glass border border-primary/20 rounded-2xl text-3xl font-black text-[var(--text-main)] shadow-xl"
                                >
                                    {digit}
                                </motion.div>
                            ))}
                        </div>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] mt-5 opacity-50 uppercase tracking-widest">Mandatory Verification Required</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <ThemeCard padding="p-4" className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">ETA</p>
                        <p className="text-xl font-black text-primary">{routeInfo.duration || ride.estimatedTime || 0} min</p>
                    </ThemeCard>
                    <ThemeCard padding="p-4" className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Fare</p>
                        <p className="text-xl font-black text-primary">₹{ride.fare}</p>
                    </ThemeCard>
                </div>

                {ride.driver && (
                    <ThemeCard className="mt-auto relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Car size={80} className="-mr-5 -mt-5" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-2xl shadow-xl">
                                {ride.driver.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-extrabold text-[var(--text-main)] truncate">{ride.driver.name}</h3>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{ride.driver.vehicleInfo?.licensePlate}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
                                <Star size={12} className="text-yellow-500" fill="currentColor" />
                                <span className="text-xs font-black text-yellow-500">{ride.driver.rating || '5.0'}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                             <ThemeButton variant="secondary" className="flex-1 py-3 bg-[var(--bg-color)] border-[var(--border-color)]">
                                <MessageCircle size={16} />
                             </ThemeButton>
                             <ThemeButton variant="secondary" className="flex-1 py-3 bg-[var(--bg-color)] border-[var(--border-color)] text-green-500">
                                <Phone size={16} />
                             </ThemeButton>
                        </div>
                    </ThemeCard>
                )}
            </aside>

            {/* Map Canvas */}
            <main className="full-screen-map">
                <MapContainer center={pickup} zoom={15} zoomControl={false} scrollWheelZoom={true}>
                    <TileLayer url={tileUrl} />
                    <Marker position={pickup} icon={pickupIcon} />
                    <Marker position={destination} icon={destinationIcon} />
                    {driverLocation && (
                        <Marker position={driverLocation} icon={carIcon} />
                    )}
                    <Routing 
                        start={driverLocation || pickup} 
                        end={['on_board', 'picked-up'].includes(ride.status) ? destination : pickup} 
                        onRouteUpdate={setRouteInfo} 
                        theme={theme}
                    />
                </MapContainer>

                {/* Floating Destination Card */}
                <div className="floating-booking-panel">
                    <ThemeCard className="space-y-4 shadow-2xl glass border border-primary/20">
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                            <div className="flex-1">
                                <p className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest">Origin</p>
                                <p className="text-xs font-bold text-[var(--text-main)] truncate">{ride.pickupLocation.address}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                            <div className="flex-1">
                                <p className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest">Destination</p>
                                <p className="text-xs font-bold text-[var(--text-main)] truncate">{ride.dropLocation.address}</p>
                            </div>
                        </div>
                    </ThemeCard>
                </div>
            </main>

            {/* Modal Components */}
            <AnimatePresence>
                {showPaymentModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 glass bg-black/60 backdrop-blur-xl"
                    >
                        <ThemeCard className="w-full max-w-md p-10 relative overflow-hidden border-primary/30">
                            <div className="flex flex-col items-center text-center mb-8 gap-4">
                                <div className="w-20 h-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary shadow-2xl shadow-primary/20 border border-primary/20">
                                    <CheckCircle2 size={40} className="animate-bounce" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tighter">Trip Complete</h2>
                                    <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] mt-1">Total Fare: ₹{ride.fare}</p>
                                </div>
                            </div>

                            {!clientSecret ? (
                                <form onSubmit={handleInitiatePayment} className="space-y-6">
                                    <div className="space-y-4">
                                        <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${paymentMethod === 'wallet' ? 'border-primary bg-primary/10' : 'border-[var(--border-color)] glass hover:bg-white/5'}`}>
                                            <input type="radio" name="pay" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="hidden" />
                                            <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-primary' : 'border-[var(--border-color)]'}`}>
                                                {paymentMethod === 'wallet' && <div className="w-2.5 h-2.5 bg-primary rounded-full transition-all" />}
                                            </div>
                                            <div className="flex-1 flex items-center gap-3">
                                                 <Wallet size={20} className={paymentMethod === 'wallet' ? 'text-primary' : 'text-[var(--text-muted)]'} />
                                                 <span className={`font-bold ${paymentMethod === 'wallet' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>Internal Wallet</span>
                                            </div>
                                        </label>

                                        <label className={`flex flex-col gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary/10' : 'border-[var(--border-color)] glass hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-4">
                                                <input type="radio" name="pay" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                                                <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-[var(--border-color)]'}`}>
                                                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary rounded-full transition-all" />}
                                                </div>
                                                <div className="flex-1 flex items-center gap-3">
                                                     <CreditCard size={20} className={paymentMethod === 'card' ? 'text-primary' : 'text-[var(--text-muted)]'} />
                                                     <span className={`font-bold ${paymentMethod === 'card' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>Secure Card Payment</span>
                                                </div>
                                            </div>
                                            {paymentMethod === 'card' && (
                                                <motion.select
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    value={selectedCardId}
                                                    onChange={(e) => setSelectedCardId(e.target.value)}
                                                    className="w-full mt-2 rounded-xl glass border border-primary/30 p-3 text-xs font-bold text-[var(--text-main)] outline-none"
                                                >
                                                    <option value="" className="bg-[var(--bg-color)]">Use New Card</option>
                                                    {savedCards.map((pm) => (
                                                        <option key={pm.id} value={pm.id} className="bg-[var(--bg-color)]">
                                                            {pm.brand?.toUpperCase?.() || 'CARD'} •••• {pm.last4}
                                                        </option>
                                                    ))}
                                                </motion.select>
                                            )}
                                        </label>
                                    </div>

                                    <ThemeButton
                                        type="submit"
                                        disabled={processingPayment || !paymentMethod}
                                        className="w-full py-5 text-sm"
                                    >
                                        {processingPayment ? 'Encrypting Connection...' : `Finalize ₹${ride.fare}`}
                                    </ThemeButton>
                                </form>
                            ) : (
                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                    <CheckoutForm
                                        clientSecret={clientSecret}
                                        amount={ride.fare}
                                        paymentMethodId={selectedCardId || undefined}
                                        onSuccess={() => {
                                            setShowPaymentModal(false);
                                            setShowRatingModal(true);
                                        }}
                                        onCancel={() => setClientSecret(null)}
                                    />
                                </Elements>
                            )}
                        </ThemeCard>
                    </motion.div>
                )}

                {showRatingModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 glass bg-black/60 backdrop-blur-xl"
                    >
                        <ThemeCard className="w-full max-w-md p-10 text-center border-primary/30">
                            <div className="w-20 h-20 rounded-[2.5rem] bg-yellow-500/10 flex items-center justify-center text-yellow-500 mx-auto mb-6 shadow-2xl shadow-yellow-500/10 border border-yellow-500/20">
                                <Star size={40} className="animate-[spin_4s_linear_infinite]" fill="currentColor" />
                            </div>
                            <h2 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tighter mb-2">Rate Experience</h2>
                            <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-10">Feedback for {ride.driver?.name}</p>

                            <div className="flex justify-center gap-3 mb-12">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <motion.button 
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        key={star} 
                                        onClick={() => setRating(star)}
                                        className={`transition-all duration-300 ${rating >= star ? 'text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'text-white/10'}`}
                                    >
                                        <Star size={44} fill={rating >= star ? "currentColor" : "transparent"} strokeWidth={2.5} />
                                    </motion.button>
                                ))}
                            </div>

                            <ThemeButton onClick={handleRatingSubmit} disabled={submittingRating} className="w-full py-5 text-sm">
                                {submittingRating ? 'Logging Signal...' : 'Archive Session'}
                            </ThemeButton>
                        </ThemeCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LiveRideTracking;

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaClipboardList, FaTimes, FaCheckCircle, FaTag, FaFileInvoice } from 'react-icons/fa';
import { BsFillBagHeartFill } from 'react-icons/bs';
import API from '../../../api';
import LegalDisclaimer from '../Common/LegalDisclaimer';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { SkeletonList } from '../Common/SkeletonLoaders';

const EnquiryList = () => {
    useEffect(() => {
        document.title = 'My Enquiry List - APK Crackers';
    }, []);
    const navigate = useNavigate();
    const [enquiryItems, setEnquiryItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingItem, setUpdatingItem] = useState(null);

    useEffect(() => {
        fetchEnquiryList();
    }, []);

    const validEnquiryItems = useMemo(() =>
        enquiryItems.filter(item => item?.productId?._id), [enquiryItems]
    );

    useEffect(() => {
        if (validEnquiryItems.length > 0 && selectedItems.length === 0) {
            setSelectedItems(validEnquiryItems.map(item => item.productId._id));
        }
    }, [validEnquiryItems.length]);

    const fetchEnquiryList = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/Login');
                return;
            }

            const response = await API.get('/cart');
            setEnquiryItems(response.data.items || []);
        } catch (err) {
            console.error('Fetch enquiry list error:', err);
            if (err.response?.status === 401) {
                navigate('/Login');
            } else {
                setError('Failed to load enquiry list');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleItemSelection = useCallback((productId) => {
        setSelectedItems(prev =>
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    }, []);

    const toggleSelectAll = useCallback(() => {
        setSelectedItems(selectedItems.length === validEnquiryItems.length ? [] : validEnquiryItems.map(item => item.productId._id));
    }, [selectedItems.length, validEnquiryItems]);

    const updateQuantity = useCallback(async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItem(productId);
        try {
            await API.put('/cart/update', { productId, quantity: newQuantity });
            setEnquiryItems(prevItems =>
                prevItems.map(item =>
                    item?.productId?._id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (err) {
            console.error('Update quantity error:', err);
            setError('Failed to update quantity');
        } finally {
            setUpdatingItem(null);
        }
    }, []);

    const removeItem = useCallback(async (productId) => {
        setUpdatingItem(productId);
        try {
            await API.delete(`/cart/remove/${productId}`);
            setEnquiryItems(prevItems => prevItems.filter(item => item?.productId?._id !== productId));
            setSelectedItems(prev => prev.filter(id => id !== productId));
        } catch (err) {
            console.error('Remove item error:', err);
            setError('Failed to remove item');
        } finally {
            setUpdatingItem(null);
        }
    }, []);

    const selectedEnquiryItems = useMemo(() =>
        validEnquiryItems.filter(item => selectedItems.includes(item.productId._id)), [validEnquiryItems, selectedItems]
    );

    const estimatedSubtotal = useMemo(() =>
        selectedEnquiryItems.reduce((total, item) => total + ((item.productId.pricing?.selling_price || item.productId.price || 0) * item.quantity), 0), [selectedEnquiryItems]
    );

    const estimatedTax = useMemo(() => estimatedSubtotal * 0.18, [estimatedSubtotal]);
    const estimatedTotal = useMemo(() => estimatedSubtotal + estimatedTax, [estimatedSubtotal, estimatedTax]);

    const estimatedSavings = useMemo(() =>
        selectedEnquiryItems.reduce((total, item) => {
            const currentPrice = item.productId.pricing?.selling_price || item.productId.price || 0;
            const originalPrice = item.productId.pricing?.mrp || item.productId.originalPrice || currentPrice;
            const discount = (originalPrice - currentPrice) * item.quantity;
            return total + (discount > 0 ? discount : 0);
        }, 0), [selectedEnquiryItems]
    );

    const handleRequestQuotation = useCallback(() => {
        if (selectedItems.length === 0) {
            setError('Please select at least one item to request quotation');
            return;
        }
        localStorage.setItem('selectedEnquiryItems', JSON.stringify(selectedItems));
        navigate('/request-quotation');
    }, [selectedItems, navigate]);

    if (loading) {
        return (
            <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
                <Sidebar showFilter={false} />
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <Topbar />
                    <div className="flex-1 pt-6 mb-32 sm:mb-24">
                        {/* Legal Disclaimer Skeleton */}
                        <div className="max-w-7xl mx-auto px-4 mb-6 animate-pulse">
                            <div className="h-20 bg-gray-200 rounded-xl"></div>
                        </div>

                        <div className="max-w-8xl mx-auto px-4 sm:px-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                                {/* Enquiry Items Skeleton */}
                                <div className="lg:col-span-8">
                                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
                                        {/* Header Skeleton */}
                                        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-gray-200 animate-pulse">
                                            <div className="flex items-center gap-4">
                                                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                                                <div className="h-6 bg-gray-200 rounded w-32"></div>
                                            </div>
                                        </div>

                                        {/* List Skeleton */}
                                        <div className="pt-4 sm:pt-6">
                                            <SkeletonList items={3} />
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Sidebar Skeleton */}
                                <div className="lg:col-span-4">
                                    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 animate-pulse">
                                        <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
                                            <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                                            <div className="h-6 bg-gray-200 rounded w-40"></div>
                                        </div>
                                        <div className="space-y-4 pt-6">
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-12 bg-gray-200 rounded-xl w-full mt-6"></div>
                                            <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    if (enquiryItems.length === 0) {
        return (
            <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
                <Sidebar showFilter={false} />
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <Topbar />
                    <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
                        <div className="text-center max-w-2xl w-full px-4">
                            {/* Professional Enquiry List SVG Illustration */}
                            <div className="mb-8 sm:mb-10 md:mb-12">
                                <svg
                                    className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto"
                                    viewBox="0 0 280 280"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* Background Circle with Gradient */}
                                    <defs>
                                        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#FFF7ED" />
                                            <stop offset="100%" stopColor="#FEF3C7" />
                                        </linearGradient>
                                        <linearGradient id="listGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#F97316" />
                                            <stop offset="100%" stopColor="#FB923C" />
                                        </linearGradient>
                                    </defs>

                                    <circle cx="140" cy="140" r="120" fill="url(#bgGradient)" />

                                    {/* Clipboard */}
                                    <rect x="80" y="70" width="120" height="150" rx="8" fill="white" stroke="url(#listGradient)" strokeWidth="4" />

                                    {/* Clipboard Top */}
                                    <rect x="110" y="60" width="60" height="25" rx="6" fill="#F97316" />
                                    <rect x="120" y="67" width="40" height="11" rx="3" fill="white" />

                                    {/* List Items */}
                                    <line x1="100" y1="100" x2="180" y2="100" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />
                                    <line x1="100" y1="130" x2="180" y2="130" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />
                                    <line x1="100" y1="160" x2="180" y2="160" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />
                                    <line x1="100" y1="190" x2="150" y2="190" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" opacity="0.5" />

                                    {/* Checkboxes */}
                                    <rect x="90" y="93" width="14" height="14" rx="3" stroke="#F97316" strokeWidth="2" fill="white" />
                                    <rect x="90" y="123" width="14" height="14" rx="3" stroke="#F97316" strokeWidth="2" fill="white" />
                                    <rect x="90" y="153" width="14" height="14" rx="3" stroke="#F97316" strokeWidth="2" fill="white" />

                                    {/* Sparkles */}
                                    <circle cx="50" cy="100" r="4" fill="#FB923C" opacity="0.6">
                                        <animate attributeName="cy" values="100;90;100" dur="3s" repeatCount="indefinite" />
                                    </circle>
                                    <circle cx="230" cy="120" r="5" fill="#FDBA74" opacity="0.5">
                                        <animate attributeName="cy" values="120;110;120" dur="2.5s" repeatCount="indefinite" />
                                    </circle>
                                </svg>
                            </div>

                            {/* Professional Text Content */}
                            <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-8 sm:mb-10 md:mb-12">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent leading-tight px-2">
                                    Your Enquiry List is Empty
                                </h1>
                                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto px-4">
                                    Add products to your enquiry list and request quotations from licensed sellers!
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-lg mx-auto px-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base sm:text-lg rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transform"
                                >
                                    <FaClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Browse Products
                                </button>

                                <button
                                    onClick={() => navigate('/Wishlist')}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-white border-2 border-orange-500 text-orange-600 font-bold text-base sm:text-lg rounded-xl hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <BsFillBagHeartFill className="w-4 h-4 sm:w-5 sm:h-5" />
                                    View Wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

        );
    }

    return (
        <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
            <Sidebar showFilter={false} />
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Topbar />
                <div className="flex-1 pt-6 mb-32 sm:mb-24">
                    {/* Legal Disclaimer */}
                    <div className="max-w-7xl mx-auto px-4 mb-6">
                        <LegalDisclaimer variant="compact" />
                    </div>

                    {error && (
                        <div className="max-w-7xl mx-auto px-4 mb-4">
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                                <FaTimes className="w-4 h-4 p-0 flex-shrink-0" />
                                <p className="font-medium flex-1">{error}</p>
                                <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                                    <FaTimes className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="max-w-8xl mx-auto px-4 sm:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                            {/* Enquiry Items Section */}
                            <div className="lg:col-span-8 mb-6 lg:mb-0">
                                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
                                    <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-gray-200">
                                        <label className="flex items-center gap-2 sm:gap-4 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.length === validEnquiryItems.length}
                                                onChange={toggleSelectAll}
                                                className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                                            />
                                            <span className="text-base sm:text-lg font-semibold text-gray-900">
                                                Select All ({validEnquiryItems.length})
                                            </span>
                                        </label>
                                        {selectedItems.length > 0 && (
                                            <span className="text-sm sm:text-base text-orange-600 font-semibold">
                                                {selectedItems.length} selected
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
                                        {validEnquiryItems.map((item) => {
                                            const isSelected = selectedItems.includes(item.productId._id);
                                            return (
                                                <div
                                                    key={item.productId._id}
                                                    className={`rounded-xl p-4 sm:p-6 border-2 transition-all ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'
                                                        }`}
                                                >
                                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                                        {/* Checkbox and Image row for mobile */}
                                                        <div className="flex gap-4 items-start">
                                                            <div className="flex-shrink-0 pt-1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onChange={() => toggleItemSelection(item.productId._id)}
                                                                    className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                                                                />
                                                            </div>

                                                            <div
                                                                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                                                                onClick={() => navigate(`/product/${item.productId._id}`)}
                                                            >
                                                                <img
                                                                    src={item.productId.images?.[0] || '/images/placeholder.jpg'}
                                                                    alt={item.productId.name}
                                                                    loading="lazy"
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.src = '/images/placeholder.jpg';
                                                                        e.target.onerror = null;
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* Info for mobile (Next to image) */}
                                                            <div className="flex-1 min-w-0 sm:hidden">
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <h3
                                                                        className="text-sm font-bold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors line-clamp-2"
                                                                        onClick={() => navigate(`/product/${item.productId._id}`)}
                                                                    >
                                                                        {item.productId.name}
                                                                    </h3>
                                                                    <button
                                                                        onClick={() => removeItem(item.productId._id)}
                                                                        disabled={updatingItem === item.productId._id}
                                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                                                    >
                                                                        <FaTrash className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                                <div className="mt-2">
                                                                    <div className="flex items-baseline gap-1.5">
                                                                        <p className="text-base font-bold text-orange-600">
                                                                            ₹{(() => {
                                                                                const price = item.productId.pricing?.selling_price || item.productId.price || 0;
                                                                                return price >= 1000 ? Math.round(price) : (price % 1 === 0 ? Math.round(price) : price.toFixed(1));
                                                                            })()}
                                                                        </p>
                                                                        <span className="text-[9px] font-semibold text-orange-600 bg-orange-100 px-1 py-0.5 rounded">
                                                                            Est.
                                                                        </span>
                                                                    </div>
                                                                    {(item.productId.pricing?.mrp || item.productId.originalPrice) && (
                                                                        <span className="text-[10px] text-gray-400 line-through">
                                                                            ₹{(() => {
                                                                                const mrp = item.productId.pricing?.mrp || item.productId.originalPrice;
                                                                                return mrp >= 1000 ? Math.round(mrp) : (mrp % 1 === 0 ? Math.round(mrp) : mrp.toFixed(1));
                                                                            })()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Tablet and Desktop Info */}
                                                        <div className="hidden sm:flex flex-1 flex-col justify-between">
                                                            <div>
                                                                <div className="flex items-start justify-between">
                                                                    <h3
                                                                        className="text-lg md:text-xl font-bold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors line-clamp-2"
                                                                        onClick={() => navigate(`/product/${item.productId._id}`)}
                                                                    >
                                                                        {item.productId.name}
                                                                    </h3>
                                                                    <button
                                                                        onClick={() => removeItem(item.productId._id)}
                                                                        disabled={updatingItem === item.productId._id}
                                                                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                                                    >
                                                                        <FaTrash className="w-5 h-5" />
                                                                    </button>
                                                                </div>
                                                                <div className="flex items-baseline gap-2 mt-2">
                                                                    <p className="text-xl md:text-2xl font-bold text-orange-600">
                                                                        ₹{(() => {
                                                                            const price = item.productId.pricing?.selling_price || item.productId.price || 0;
                                                                            return price >= 1000 ? Math.round(price) : (price % 1 === 0 ? Math.round(price) : price.toFixed(1));
                                                                        })()}
                                                                    </p>
                                                                    <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                                                                        Est.
                                                                    </span>
                                                                    {(item.productId.pricing?.mrp || item.productId.originalPrice) && (
                                                                        <span className="text-sm text-gray-400 line-through">
                                                                            ₹{(() => {
                                                                                const mrp = item.productId.pricing?.mrp || item.productId.originalPrice;
                                                                                return mrp >= 1000 ? Math.round(mrp) : (mrp % 1 === 0 ? Math.round(mrp) : mrp.toFixed(1));
                                                                            })()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-6">
                                                                <div className="flex items-center gap-2 md:gap-3 bg-gray-100 rounded-lg md:rounded-xl p-1 md:p-2">
                                                                    <button
                                                                        onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                                                                        disabled={updatingItem === item.productId._id || item.quantity <= 1}
                                                                        className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white hover:bg-orange-500 hover:text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                                                    >
                                                                        <FaMinus className="w-3 h-3 md:w-4 md:h-4" />
                                                                    </button>
                                                                    <span className="w-10 md:w-16 text-center font-bold text-base md:text-lg text-gray-900">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                                                                        disabled={updatingItem === item.productId._id}
                                                                        className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white hover:bg-orange-500 hover:text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                                                    >
                                                                        <FaPlus className="w-3 h-3 md:w-4 md:h-4" />
                                                                    </button>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-xs text-gray-500 font-medium">Est. Subtotal</p>
                                                                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                                                                        ₹{(() => {
                                                                            const total = (item.productId.pricing?.selling_price || item.productId.price || 0) * item.quantity;
                                                                            return total >= 1000 ? Math.round(total) : (total % 1 === 0 ? Math.round(total) : total.toFixed(1));
                                                                        })()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Mobile Quantity and Subtotal row */}
                                                        <div className="flex items-center justify-between sm:hidden pt-4 border-t border-gray-100">
                                                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1.5 border border-gray-200">
                                                                <button
                                                                    onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                                                                    disabled={updatingItem === item.productId._id || item.quantity <= 1}
                                                                    className="w-8 h-8 rounded-md bg-white text-gray-600 flex items-center justify-center shadow-sm disabled:opacity-50"
                                                                >
                                                                    <FaMinus className="w-3 h-3" />
                                                                </button>
                                                                <span className="w-8 text-center font-bold text-gray-900">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                                                                    disabled={updatingItem === item.productId._id}
                                                                    className="w-8 h-8 rounded-md bg-white text-gray-600 flex items-center justify-center shadow-sm disabled:opacity-50"
                                                                >
                                                                    <FaPlus className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Est. Subtotal</p>
                                                                <p className="text-base font-bold text-gray-900">
                                                                    ₹{(() => {
                                                                        const total = (item.productId.pricing?.selling_price || item.productId.price || 0) * item.quantity;
                                                                        return total >= 1000 ? Math.round(total) : (total % 1 === 0 ? Math.round(total) : total.toFixed(1));
                                                                    })()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Interest Summary Sidebar */}
                            <div className="lg:col-span-4 mb-12 lg:mb-0">
                                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 lg:sticky lg:top-24">
                                    <div className="flex items-center gap-3 md:gap-4 pb-6 border-b border-gray-200">
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                                            <FaClipboardList className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Interest Summary</h2>
                                    </div>

                                    {selectedItems.length === 0 ? (
                                        <div className="text-center py-8 sm:py-12">
                                            <p className="text-gray-500 text-sm sm:text-base">
                                                No items selected. Please select items to request quotation.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-3 sm:space-y-4 pt-6">
                                                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                                    <span className="font-medium">Items ({selectedItems.length})</span>
                                                    <div className="text-right">
                                                        <span className="font-bold text-gray-900">
                                                            ₹{estimatedSubtotal >= 1000 ? Math.round(estimatedSubtotal) : (estimatedSubtotal % 1 === 0 ? Math.round(estimatedSubtotal) : estimatedSubtotal.toFixed(1))}
                                                        </span>
                                                        <p className="text-xs text-orange-600">Est.</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                                    <span className="font-medium">Est. Tax (GST 18%)</span>
                                                    <div className="text-right">
                                                        <span className="font-bold text-gray-900">
                                                            ₹{estimatedTax >= 1000 ? Math.round(estimatedTax) : (estimatedTax % 1 === 0 ? Math.round(estimatedTax) : estimatedTax.toFixed(1))}
                                                        </span>
                                                        <p className="text-xs text-orange-600">Est.</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                                    <span className="font-medium">Shipping</span>
                                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                                        <span className="font-bold text-gray-600 text-xs">To be confirmed by seller</span>
                                                    </div>
                                                </div>
                                                {estimatedSavings > 0 && (
                                                    <div className="flex justify-between items-center bg-green-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <FaTag className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                            <span className="font-semibold text-green-700 text-sm sm:text-base">Potential Savings</span>
                                                        </div>
                                                        <span className="font-bold text-green-600 text-base sm:text-lg">
                                                            ₹{estimatedSavings >= 1000 ? Math.round(estimatedSavings) : (estimatedSavings % 1 === 0 ? Math.round(estimatedSavings) : estimatedSavings.toFixed(1))}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="border-t border-gray-200 pt-4 sm:pt-6 mt-4 sm:mt-6">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-lg sm:text-xl font-bold text-gray-900">Estimated Total</span>
                                                        <div className="text-right">
                                                            <span className="text-2xl sm:text-3xl font-bold text-orange-600">
                                                                ₹{estimatedTotal >= 1000 ? Math.round(estimatedTotal) : (estimatedTotal % 1 === 0 ? Math.round(estimatedTotal) : estimatedTotal.toFixed(1))}
                                                            </span>
                                                            <p className="text-xs text-orange-600 font-semibold mt-1">Est. Only</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-3 italic">
                                                        Final price will be confirmed by the seller offline
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleRequestQuotation}
                                                disabled={selectedItems.length === 0}
                                                className="w-full py-3 sm:py-4 bg-orange-500 text-white font-bold text-base sm:text-lg rounded-xl hover:bg-orange-600 transition-all shadow-md hover:shadow-lg mt-6 sm:mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                <FaFileInvoice className="w-5 h-5" />
                                                Request Quotation
                                            </button>

                                            <button
                                                onClick={() => navigate('/')}
                                                className="w-full py-3 sm:py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm sm:text-base rounded-xl hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-all mt-3 sm:mt-4"
                                            >
                                                Continue Browsing
                                            </button>

                                            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200">
                                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                                                    <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                                    <p>Secure enquiry submission</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default EnquiryList;

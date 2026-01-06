import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileInvoice, FaClipboardList, FaClock, FaCheckCircle, FaTimesCircle, FaArrowRight, FaStore, FaCalendarAlt, FaHashtag, FaRupeeSign } from 'react-icons/fa';
import API from '../../../api';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import LegalDisclaimer from '../Common/LegalDisclaimer';
import { SkeletonList } from '../Common/SkeletonLoaders';

const Quotations = ({ standalone = true }) => {
    useEffect(() => {
        if (standalone) {
            document.title = 'My Quotations - APK Crackers';
        }
    }, [standalone]);
    const navigate = useNavigate();
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchQuotations();
    }, []);

    const fetchQuotations = async () => {
        try {
            const response = await API.get('/quotations');
            setQuotations(response.data.quotations || []);
        } catch (err) {
            console.error('Fetch quotations error:', err);
            setError('Failed to load your quotations history');
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/images/placeholder.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000/${imagePath}`;
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 border-orange-200 shadow-orange-100/50';
            case 'Responded':
                return 'bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100/50';
            case 'Cancelled':
                return 'bg-gradient-to-r from-gray-50 to-slate-50 text-slate-700 border-slate-200 shadow-slate-100/50';
            case 'Expired':
                return 'bg-gradient-to-r from-red-50 to-rose-50 text-rose-700 border-rose-200 shadow-rose-100/50';
            default:
                return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-blue-100/50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <FaClock className="w-3 h-3" />;
            case 'Responded': return <FaCheckCircle className="w-3 h-3" />;
            case 'Cancelled': return <FaTimesCircle className="w-3 h-3" />;
            case 'Expired': return <FaTimesCircle className="w-3 h-3" />;
            default: return <FaFileInvoice className="w-3 h-3" />;
        }
    };

    if (loading) {
        if (!standalone) {
            // Skeleton for Settings page (no Sidebar/Topbar/Footer)
            return (
                <div className="space-y-6">
                    {/* Header Skeleton */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-pulse">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                <div className="h-8 bg-gray-200 rounded w-48"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-64 mt-2"></div>
                        </div>
                        <div className="h-12 bg-gray-200 rounded-xl w-48"></div>
                    </div>

                    {/* Legal Disclaimer Skeleton */}
                    <div className="mb-8 animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-xl"></div>
                    </div>

                    {/* Quotations List Skeleton */}
                    <SkeletonList items={3} />
                </div>
            );
        }

        // Full page skeleton (with Sidebar/Topbar/Footer)
        return (
            <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
                <Sidebar showFilter={false} />
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <Topbar />
                    <div className="flex-1 p-3 sm:p-6 md:p-8">
                        <div className="max-w-6xl mx-auto">
                            {/* Header Skeleton */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-pulse">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                        <div className="h-8 bg-gray-200 rounded w-48"></div>
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded w-64 mt-2"></div>
                                </div>
                                <div className="h-12 bg-gray-200 rounded-xl w-48"></div>
                            </div>

                            {/* Legal Disclaimer Skeleton */}
                            <div className="mb-8 animate-pulse">
                                <div className="h-20 bg-gray-200 rounded-xl"></div>
                            </div>

                            {/* Quotations List Skeleton */}
                            <SkeletonList items={3} />
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    // Content component (reusable for both standalone and embedded)
    const QuotationsContent = () => (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <FaFileInvoice className="text-orange-600 text-xl sm:text-2xl" />
                        </div>
                        Quotations
                    </h1>
                    <p className="text-gray-500 mt-1.5 text-sm sm:text-base font-medium">Track interest summaries and seller communications</p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all shadow-sm hover:shadow-orange-100 active:scale-95 text-sm sm:text-base"
                >
                    <FaClipboardList className="w-4 h-4" />
                    Browse Products
                </button>
            </div>

            <div className="mb-8">
                <LegalDisclaimer variant="compact" />
            </div>

            {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-4 rounded-xl mb-8 flex items-center gap-3 animate-shake">
                    <FaTimesCircle className="w-6 h-6 flex-shrink-0" />
                    <p className="font-bold text-sm sm:text-base">{error}</p>
                </div>
            )}

            {quotations.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 sm:p-16 text-center shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <FaFileInvoice className="text-gray-200 text-5xl" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">No Enquiries Yet</h2>
                    <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                        Your quotation history is empty. Start adding premium crackers to your enquiry list to connect with licensed sellers!
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all active:scale-95"
                    >
                        Start Browsing
                    </button>
                </div>
            ) : (
                <div className="grid gap-5 sm:gap-6">
                    {quotations.map((quotation) => (
                        <div
                            key={quotation._id}
                            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-4 sm:p-6 lg:p-8">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-5">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] sm:text-xs font-bold text-gray-500 border border-gray-100">
                                                <FaHashtag className="w-2.5 h-2.5" />
                                                {quotation._id.slice(-8).toUpperCase()}
                                            </div>
                                            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border shadow-sm ${getStatusStyles(quotation.status)}`}>
                                                {getStatusIcon(quotation.status)}
                                                {quotation.status}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                <FaCalendarAlt className="w-2.5 h-2.5" />
                                                {new Date(quotation.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <div className="flex -space-x-3 sm:-space-x-5 overflow-hidden py-1">
                                                {quotation.items.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="relative inline-block h-12 w-12 sm:h-16 sm:w-16 rounded-xl border-2 border-white bg-gray-50 overflow-hidden shadow-md group-hover:translate-y-[-2px] transition-transform duration-300" style={{ zIndex: 3 - idx }}>
                                                        <img
                                                            src={getImageUrl(item.productId?.images?.[0])}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = '/images/placeholder.jpg';
                                                                e.target.onerror = null;
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                                {quotation.items.length > 3 && (
                                                    <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl border-2 border-white bg-slate-100 text-xs sm:text-sm font-black text-slate-500 shadow-md">
                                                        +{quotation.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                                                    {quotation.items.length} {quotation.items.length === 1 ? 'Premium Cracker' : 'Crackers Selection'}
                                                </p>
                                                <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate font-medium">
                                                    {quotation.items.map(item => item.productId?.name).join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-6 sm:gap-8 lg:gap-4 border-t lg:border-t-0 border-slate-100 pt-5 lg:pt-0">
                                        <div className="text-left sm:text-left lg:text-right">
                                            <p className="text-[10px] sm:text-xs text-slate-400 uppercase font-black tracking-widest mb-1.5">Preliminary Interest</p>
                                            <div className="flex items-center sm:justify-start lg:justify-end gap-2">
                                                <div className="flex items-baseline">
                                                    <span className="text-xl sm:text-3xl font-black text-orange-600">₹{quotation.estimatedTotal.toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[8px] sm:text-[10px] font-black rounded uppercase tracking-tighter shadow-sm border border-orange-200">
                                                    Indicative
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/quotation/${quotation._id}`)}
                                            className="group/btn flex items-center justify-center gap-2.5 px-6 py-4 bg-slate-900 text-white text-sm sm:text-base font-black rounded-2xl hover:bg-orange-600 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-orange-200 active:scale-95"
                                        >
                                            Explore Details
                                            <FaArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                {quotation.status === 'Responded' && quotation.sellerId && (
                                    <div className="mt-8 pt-6 border-t-2 border-dashed border-emerald-100 bg-emerald-50/20 px-5 sm:px-6 py-5 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-1 bg-emerald-500 text-white transform rotate-45 translate-x-4 translate-y-[-8px] px-8 text-[8px] font-black uppercase tracking-widest shadow-md">
                                            Direct Response
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 text-xl flex-shrink-0">
                                                <FaStore />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-0.5">Verified Seller Offer</p>
                                                <p className="text-base sm:text-lg font-black text-slate-900 truncate">
                                                    {quotation.sellerId?.businessName || 'Elite Licensed Seller'}
                                                </p>
                                            </div>
                                            <div className="w-full sm:w-auto">
                                                <div className="flex flex-col items-stretch sm:items-end">
                                                    <span className="text-xs text-slate-400 font-bold mb-1">Final Quotation</span>
                                                    <span className="text-lg sm:text-2xl font-black text-emerald-600 bg-white px-5 py-2.5 rounded-xl border-2 border-emerald-200 shadow-emerald-50 shadow-sm flex items-center justify-center">
                                                        ₹{quotation.quotedTotal?.toLocaleString('en-IN') || 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Render with or without layout wrapper
    if (!standalone) {
        // Embedded in Settings page (no Sidebar/Topbar/Footer)
        return <QuotationsContent />;
    }

    // Standalone page (with Sidebar/Topbar/Footer)
    return (
        <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
            <Sidebar showFilter={false} />
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Topbar />
                <div className="flex-1 p-3 sm:p-6 md:p-8">
                    <QuotationsContent />
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Quotations;


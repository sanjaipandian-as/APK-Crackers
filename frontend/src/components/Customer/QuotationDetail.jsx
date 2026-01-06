import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFileInvoice, FaClipboardList, FaClock, FaCheckCircle, FaTimesCircle, FaPhone, FaMapMarkerAlt, FaEnvelope, FaBox, FaCalendarAlt, FaHashtag, FaStore } from 'react-icons/fa';
import API from '../../../api';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import LegalDisclaimer from '../Common/LegalDisclaimer';
import { SkeletonQuotationDetail } from '../Common/SkeletonLoaders';

const QuotationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = `Quotation #${id?.slice(-6) || ''} Details - APK Crackers`;
    }, [id]);

    useEffect(() => {
        fetchQuotationDetail();
    }, [id]);

    const fetchQuotationDetail = async () => {
        try {
            const response = await API.get(`/quotations/${id}`);
            setQuotation(response.data);
        } catch (err) {
            console.error('Fetch quotation detail error:', err);
            setError('Failed to load quotation details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Pending': {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-300',
                icon: <FaClock className="w-3.5 h-3.5" />
            },
            'Responded': {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-300',
                icon: <FaCheckCircle className="w-3.5 h-3.5" />
            },
            'Cancelled': {
                bg: 'bg-gray-100',
                text: 'text-gray-700',
                border: 'border-gray-300',
                icon: <FaTimesCircle className="w-3.5 h-3.5" />
            },
            'Expired': {
                bg: 'bg-red-100',
                text: 'text-red-700',
                border: 'border-red-300',
                icon: <FaTimesCircle className="w-3.5 h-3.5" />
            }
        };
        return badges[status] || badges['Pending'];
    };

    if (loading) {
        return (
            <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
                <Sidebar showFilter={false} />
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <Topbar />
                    <SkeletonQuotationDetail />
                    <Footer />
                </div>
            </div>
        );
    }

    if (error || !quotation) {
        return (
            <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
                <Sidebar showFilter={false} />
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <Topbar />
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="text-center max-w-md">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTimesCircle className="text-red-600 text-3xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quotation Not Found</h2>
                            <p className="text-gray-600 mb-6">{error || 'The quotation you\'re looking for doesn\'t exist or has been removed.'}</p>
                            <button
                                onClick={() => navigate('/quotations')}
                                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                Back to Quotations
                            </button>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    const statusBadge = getStatusBadge(quotation.status);

    return (
        <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
            <Sidebar showFilter={false} />
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Topbar />

                <div className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="max-w-8xl mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/Settings')}
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-5 transition-colors"
                        >
                            <FaArrowLeft className="w-4 h-4" />
                            Back to Settings
                        </button>

                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 md:p-6 mb-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                        Quotation Details
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                        <span className="flex items-center gap-1.5">
                                            <FaHashtag className="w-3 h-3" />
                                            <span className="font-mono font-semibold">{quotation._id.slice(-12).toUpperCase()}</span>
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="flex items-center gap-1.5">
                                            <FaCalendarAlt className="w-3 h-3" />
                                            {new Date(quotation.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border} font-semibold text-sm`}>
                                    {statusBadge.icon}
                                    {quotation.status}
                                </div>
                            </div>

                            <LegalDisclaimer />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Items */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="px-5 py-4 border-b border-gray-200">
                                        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <FaClipboardList className="text-orange-500 w-4 h-4" />
                                            Items ({quotation.items.length})
                                        </h2>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {quotation.items.map((item, idx) => (
                                            <div key={idx} className="p-5 hover:bg-gray-50 transition-colors">
                                                <div className="flex gap-4">
                                                    <img
                                                        src={item.productId?.images?.[0] || '/images/placeholder.jpg'}
                                                        alt={item.productId?.name}
                                                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                                                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; e.target.onerror = null; }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                            {item.productId?.name || 'Product Details Not Available'}
                                                        </h3>
                                                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                                            <span className="flex items-center gap-1">
                                                                <FaBox className="w-3 h-3" />
                                                                Qty: {item.quantity}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-xl font-bold text-orange-600">
                                                                ₹{item.indicativePrice?.toLocaleString('en-IN')}
                                                            </span>
                                                            <span className="text-xs text-gray-500 font-medium">
                                                                (Reference price)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Customer Notes */}
                                {quotation.customerNotes && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <FaClock className="text-orange-500 w-4 h-4" />
                                            Your Notes
                                        </h2>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {quotation.customerNotes}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Seller Response */}
                                {quotation.status === 'Responded' && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                                        <h2 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                                            <FaCheckCircle className="text-green-600 w-4 h-4" />
                                            Seller's Response
                                        </h2>
                                        {quotation.sellerResponse?.notes && (
                                            <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {quotation.sellerResponse.notes}
                                                </p>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded-lg border border-green-200">
                                                <p className="text-xs text-green-700 font-semibold uppercase mb-1">Quoted Total</p>
                                                <p className="text-2xl font-bold text-green-900 mb-1">
                                                    ₹{quotation.quotedTotal?.toLocaleString('en-IN')}
                                                </p>
                                                <p className="text-xs text-green-600">Subject to offline confirmation</p>
                                            </div>
                                            {quotation.sellerResponse?.validUntil && (
                                                <div className="bg-white p-4 rounded-lg border border-green-200">
                                                    <p className="text-xs text-green-700 font-semibold uppercase mb-1">Valid Until</p>
                                                    <p className="text-sm font-semibold text-green-900">
                                                        {new Date(quotation.sellerResponse.validUntil).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Summary */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                    <h2 className="font-semibold text-gray-900 mb-4">Summary</h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm pb-3 border-b border-gray-100">
                                            <span className="text-gray-600">Date</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(quotation.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                            <p className="text-xs text-orange-700 font-semibold uppercase mb-1">
                                                Estimated Total
                                            </p>
                                            <p className="text-2xl font-bold text-orange-600 mb-1">
                                                ₹{quotation.estimatedTotal.toLocaleString('en-IN')}
                                            </p>
                                            <p className="text-xs text-orange-600">
                                                Indicative only
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                    <h2 className="font-semibold text-gray-900 mb-4">Contact Details</h2>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaPhone className="text-orange-600 w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 font-medium mb-0.5">Phone</p>
                                                <p className="text-sm font-semibold text-gray-900 break-all">
                                                    {quotation.customerInfo.phone}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaEnvelope className="text-orange-600 w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 font-medium mb-0.5">Email</p>
                                                <p className="text-sm font-semibold text-gray-900 break-all">
                                                    {quotation.customerInfo.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaMapMarkerAlt className="text-orange-600 w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 font-medium mb-0.5">Delivery Address</p>
                                                {quotation.deliveryAddress ? (
                                                    <div className="text-sm font-medium text-gray-900 leading-relaxed">
                                                        {typeof quotation.deliveryAddress === 'object' ? (
                                                            <>
                                                                <p className="font-semibold">{quotation.deliveryAddress.fullname}</p>
                                                                <p>{quotation.deliveryAddress.addressLine}</p>
                                                                {quotation.deliveryAddress.landmark && (
                                                                    <p className="text-xs text-gray-500">Near {quotation.deliveryAddress.landmark}</p>
                                                                )}
                                                                <p>{quotation.deliveryAddress.city}, {quotation.deliveryAddress.state} {quotation.deliveryAddress.pincode}</p>
                                                            </>
                                                        ) : (
                                                            <p>{quotation.deliveryAddress}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm font-medium text-gray-900 leading-relaxed">
                                                        {quotation.customerInfo.address}, {quotation.customerInfo.city}, {quotation.customerInfo.state} {quotation.customerInfo.pincode}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
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
};

export default QuotationDetail;

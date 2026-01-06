import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from '../../utils/toast.jsx';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaUser, FaEnvelope, FaFileInvoice, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import API from '../../../api';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import LegalDisclaimer from '../Common/LegalDisclaimer';
import { SkeletonForm, SkeletonList } from '../Common/SkeletonLoaders';

const QuotationRequest = () => {
    useEffect(() => {
        document.title = 'Request Quotation - APK Crackers';
    }, []);
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState([]);
    const [enquiryItems, setEnquiryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Address management
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        notes: ''
    });

    useEffect(() => {
        fetchEnquiryData();
        fetchSavedAddresses();
    }, []);

    const fetchEnquiryData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/Login');
                return;
            }

            // Get user data
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setFormData(prev => ({
                    ...prev,
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || ''
                }));
            }

            // Get selected items from localStorage
            const selectedIds = JSON.parse(localStorage.getItem('selectedEnquiryItems') || '[]');
            setSelectedItems(selectedIds);

            // Fetch cart/enquiry items
            const response = await API.get('/cart');
            const items = response.data.items || [];
            const filteredItems = items.filter(item => selectedIds.includes(item.productId._id));
            setEnquiryItems(filteredItems);

            if (filteredItems.length === 0) {
                setError('No items selected. Redirecting...');
                setTimeout(() => navigate('/enquiry-list'), 2000);
            }
        } catch (err) {
            console.error('Fetch enquiry data error:', err);
            setError('Failed to load enquiry data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user's saved addresses
    const fetchSavedAddresses = async () => {
        try {
            const response = await API.get('/address');
            const addresses = response.data || [];
            setSavedAddresses(addresses);

            // Auto-select default address if available
            const defaultAddress = addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress._id);
                fillAddressForm(defaultAddress);
            }
        } catch (err) {
            console.error('Error fetching addresses:', err);
            // Don't show error to user, just continue without saved addresses
        }
    };

    // Fill form with selected address
    const fillAddressForm = (address) => {
        setFormData(prev => ({
            ...prev,
            address: address.addressLine || '',
            city: address.city || '',
            state: address.state || '',
            pincode: address.pincode || ''
        }));
    };

    // Handle address selection
    const handleAddressSelect = (e) => {
        const addressId = e.target.value;
        setSelectedAddressId(addressId);

        if (addressId) {
            const selectedAddress = savedAddresses.find(addr => addr._id === addressId);
            if (selectedAddress) {
                fillAddressForm(selectedAddress);
            }
        } else {
            // Clear address fields if "Enter manually" is selected
            setFormData(prev => ({
                ...prev,
                address: '',
                city: '',
                state: '',
                pincode: ''
            }));
        }
    };

    const estimatedSubtotal = useMemo(() =>
        enquiryItems.reduce((total, item) => total + ((item.productId.pricing?.selling_price || item.productId.price || 0) * item.quantity), 0),
        [enquiryItems]
    );

    const estimatedTax = useMemo(() => estimatedSubtotal * 0.18, [estimatedSubtotal]);
    const estimatedTotal = useMemo(() => estimatedSubtotal + estimatedTax, [estimatedSubtotal, estimatedTax]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            // Create quotation request
            const quotationData = {
                items: enquiryItems.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                    indicativePrice: item.productId.pricing?.selling_price || item.productId.price || 0
                })),
                customerInfo: formData,
                estimatedTotal,
                notes: formData.notes
            };

            // Submit quotation request
            await API.post('/quotations/request', quotationData);

            // Clear selected items from localStorage
            localStorage.removeItem('selectedEnquiryItems');

            // Show success message and redirect
            showToast.success('Quotation request submitted successfully! The seller will contact you soon with the final quotation.');
            navigate('/quotations');
        } catch (err) {
            console.error('Submit quotation error:', err);
            setError(err.response?.data?.message || 'Failed to submit quotation request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
                <Sidebar showFilter={false} />
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <Topbar />
                    <div className="flex-1 py-4 md:py-8 px-2 md:px-8">
                        <div className="w-full">
                            {/* Header Skeleton */}
                            <div className="mb-6 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                                <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-96"></div>
                            </div>

                            {/* Legal Disclaimer Skeleton */}
                            <div className="mb-6 animate-pulse">
                                <div className="h-20 bg-gray-200 rounded-xl"></div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                {/* Form Skeleton */}
                                <div className="lg:col-span-2">
                                    <SkeletonForm />
                                </div>

                                {/* Summary Skeleton */}
                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                        <SkeletonList items={3} />
                                        <div className="mt-6 space-y-3">
                                            <div className="h-4 bg-gray-200 rounded"></div>
                                            <div className="h-4 bg-gray-200 rounded"></div>
                                            <div className="h-8 bg-gray-200 rounded mt-4"></div>
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

    return (
        <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
            <Sidebar showFilter={false} />
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Topbar />
                <div className="flex-1 py-4 md:py-8 px-2 md:px-8">
                    <div className="w-full">
                        {/* Header */}
                        <div className="mb-6">
                            <button
                                onClick={() => navigate('/enquiry-list')}
                                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-4"
                            >
                                <FaArrowLeft className="w-4 h-4" />
                                Back to Enquiry List
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FaFileInvoice className="text-orange-500" />
                                Enquiry Interest Summary
                            </h1>
                            <p className="text-gray-600 mt-2">Share your interest details with licensed sellers for offline confirmation and direct discussion</p>
                        </div>

                        {/* Legal Disclaimer */}
                        <div className="mb-6">
                            <LegalDisclaimer />
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                                <FaExclamationTriangle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            {/* Contact Information Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Your Contact Information</h2>

                                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                                    <FaUser className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-orange-500" />
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all text-sm sm:text-base"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                                    <FaEnvelope className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-orange-500" />
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all text-sm sm:text-base"
                                                    placeholder="your.email@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                                <FaPhone className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-orange-500" />
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all text-sm sm:text-base"
                                                placeholder="+91 XXXXX XXXXX"
                                            />
                                        </div>

                                        {/* Saved Address Selector - Card Style */}
                                        {savedAddresses.length > 0 && (
                                            <div className="mb-4 sm:mb-6">
                                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                                                    <FaMapMarkerAlt className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-orange-600" />
                                                    Select Delivery Address
                                                </label>

                                                <div className="space-y-2 sm:space-y-3">
                                                    {/* Manual Entry Option */}
                                                    <div
                                                        onClick={() => handleAddressSelect({ target: { value: '' } })}
                                                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all ${!selectedAddressId
                                                            ? 'border-orange-500 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 shadow-md'
                                                            : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${!selectedAddressId
                                                                ? 'border-orange-500 bg-orange-500'
                                                                : 'border-gray-300'
                                                                }`}>
                                                                {!selectedAddressId && (
                                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm sm:text-base font-bold text-gray-900">
                                                                    ✏️ Enter Address Manually
                                                                </p>
                                                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                                                    Type your delivery address below
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Saved Addresses */}
                                                    {savedAddresses.map((address) => (
                                                        <div key={address._id}>
                                                            <div
                                                                onClick={() => handleAddressSelect({ target: { value: address._id } })}
                                                                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === address._id
                                                                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 shadow-md'
                                                                    : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                                                                    }`}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedAddressId === address._id
                                                                        ? 'border-orange-500 bg-orange-500'
                                                                        : 'border-gray-300'
                                                                        }`}>
                                                                        {selectedAddressId === address._id && (
                                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <p className="text-sm sm:text-base font-bold text-gray-900 truncate">
                                                                                {address.fullname}
                                                                            </p>
                                                                            {address.isDefault && (
                                                                                <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] sm:text-xs font-semibold rounded flex-shrink-0">
                                                                                    Default
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                                                                            {address.city}, {address.state} - {address.pincode}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Expanded Address Details */}
                                                            {selectedAddressId === address._id && (
                                                                <div className="mt-2 ml-8 p-3 sm:p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                                                                    <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-2 flex items-center gap-1.5">
                                                                        <FaCheckCircle className="w-3 h-3 text-green-600" />
                                                                        Selected Address Details:
                                                                    </p>
                                                                    <div className="space-y-1 text-xs sm:text-sm text-gray-700">
                                                                        <p className="font-semibold">{address.fullname}</p>
                                                                        <p>{address.addressLine}</p>
                                                                        {address.landmark && (
                                                                            <p className="text-gray-600 italic">Landmark: {address.landmark}</p>
                                                                        )}
                                                                        <p>{address.city}, {address.state} - {address.pincode}</p>
                                                                        <p className="flex items-center gap-1.5">
                                                                            <FaPhone className="w-3 h-3 text-gray-500" />
                                                                            {address.phone}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                                <FaMapMarkerAlt className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-orange-500" />
                                                Complete Address *
                                            </label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                rows="3"
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all text-sm sm:text-base resize-none"
                                                placeholder="Street address, building name, etc."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">City *</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all text-sm sm:text-base"
                                                    placeholder="City"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">State *</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all text-sm sm:text-base"
                                                    placeholder="State"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Pincode *</label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                    required
                                                    pattern="[0-9]{6}"
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all text-sm sm:text-base"
                                                    placeholder="XXXXXX"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Additional Notes (Optional)
                                            </label>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                                                placeholder="Any specific requirements or questions for the seller..."
                                            />
                                        </div>

                                        <div className="pt-6 border-t border-gray-200">
                                            <button
                                                type="submit"
                                                disabled={submitting || enquiryItems.length === 0}
                                                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                        Sending Enquiry...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaFileInvoice className="w-5 h-5" />
                                                        Send Enquiry to Seller
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-xs text-gray-500 text-center mt-3 italic">
                                                This is a statement of interest only. Pricing, billing, payment, and delivery happen strictly offline between customer and seller.
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Summary Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Enquiry Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        {enquiryItems.map((item) => (
                                            <div key={item.productId._id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                                                <img
                                                    src={item.productId.images?.[0] || '/images/placeholder.jpg'}
                                                    alt={item.productId.name}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/images/placeholder.jpg';
                                                        e.target.onerror = null;
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.productId.name}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                                    <div className="flex items-baseline gap-1.5 mt-1">
                                                        <p className="text-sm font-bold text-orange-600">
                                                            ₹{((item.productId.pricing?.selling_price || item.productId.price || 0) * item.quantity).toFixed(2)}
                                                        </p>
                                                        <span className="text-[9px] font-semibold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">Ref Only</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal ({enquiryItems.length} items)</span>
                                            <div className="text-right">
                                                <span className="font-bold text-gray-900">₹{estimatedSubtotal.toFixed(2)}</span>
                                                <p className="text-xs text-orange-600">Indicative (Not a Bill)</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Est. Tax (GST 18%)</span>
                                            <div className="text-right">
                                                <span className="font-bold text-gray-900">₹{estimatedTax.toFixed(2)}</span>
                                                <p className="text-xs text-orange-600">Indicative Reference</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Delivery/Handling</span>
                                            <span className="text-xs text-gray-500">Discussed directly with seller</span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-bold text-gray-900">Preliminary Interest Total</span>
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-orange-600">₹{estimatedTotal.toFixed(2)}</span>
                                                    <p className="text-xs text-orange-600 font-semibold">Indicative Only (Not a Bill)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="flex items-start gap-2 text-xs text-gray-600">
                                            <FaCheckCircle className="text-green-500 w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <p>All pricing, official billing, and delivery arrangements are handled privately and offline by the licensed seller.</p>
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

export default QuotationRequest;

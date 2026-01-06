import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import showToast from '../utils/toast.jsx';
import API from '../../api';
import Topbar from '../components/Customer/Topbar';
import Sidebar from '../components/Customer/Sidebar';
import Footer from '../components/Customer/Footer';
import { FaArrowLeft, FaClipboardList, FaStar, FaStore, FaMapMarkerAlt, FaCheckCircle, FaFileInvoice } from 'react-icons/fa';
import { SkeletonProductCard, SkeletonShopHeader } from '../components/Common/SkeletonLoaders';


const ShopProductsPage = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const shopData = location.state?.shopData;

    const [products, setProducts] = useState([]);
    const [shopInfo, setShopInfo] = useState(shopData || null);
    const [loading, setLoading] = useState(true);
    const [enquiryItems, setEnquiryItems] = useState([]);
    const [addingToEnquiry, setAddingToEnquiry] = useState(null);
    const [submittingDirectEnquiry, setSubmittingDirectEnquiry] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Fetch shop products and info
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch products and shop info in parallel
                const [productsRes, shopRes] = await Promise.all([
                    API.get(`/products/customer/seller/${sellerId}`),
                    !shopInfo ? API.get(`/sellers/${sellerId}`) : Promise.resolve(null)
                ]);

                setProducts(productsRes.data || []);

                if (shopRes) {
                    const seller = shopRes.data;
                    setShopInfo({
                        id: seller._id,
                        name: seller.businessName,
                        img: seller.img || '/images/placeholder.jpg',
                        rating: seller.rating || 4.5,
                        products: `${seller.totalProducts || 0} Products`,
                        location: seller.address?.city || 'India'
                    });
                }
            } catch (error) {
                console.error('Error fetching shop data:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (sellerId) {
            fetchData();
        }
    }, [sellerId, shopInfo]);

    // Update document title
    useEffect(() => {
        if (shopInfo?.name) {
            document.title = `${shopInfo.name} - Official Shop | APK Crackers`;
        } else {
            document.title = 'Shop Products - APK Crackers';
        }
    }, [shopInfo]);

    // Fetch enquiry list
    useEffect(() => {
        fetchEnquiryList();
    }, []);

    const fetchEnquiryList = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await API.get('/cart');
                setEnquiryItems(response.data.items || []);
            }
        } catch (error) {
            console.error('Error fetching enquiry list:', error);
        }
    };



    const addToEnquiry = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/Login');
            return;
        }

        const inEnquiry = enquiryItems.some(item =>
            (item.productId?._id || item.productId) === product._id
        );

        if (inEnquiry) {
            navigate('/enquiry-list');
            return;
        }

        setAddingToEnquiry(product._id);
        try {
            await API.post('/cart/add', {
                productId: product._id,
                quantity: 1
            });
            fetchEnquiryList();
        } catch (error) {
            console.error('Add to enquiry error:', error);
        } finally {
            setAddingToEnquiry(null);
        }
    };



    const isInEnquiry = (productId) => {
        return enquiryItems.some(item =>
            (item.productId?._id || item.productId) === productId
        );
    };



    const toggleProductSelection = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(p => p._id));
        }
    };

    const handleDirectEnquiry = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/Login');
            return;
        }

        if (selectedProducts.length === 0) return;

        setSubmittingDirectEnquiry(true);
        try {
            const productsToAdd = products.filter(p => selectedProducts.includes(p._id));

            for (const product of productsToAdd) {
                const inEnquiry = enquiryItems.some(item =>
                    (item.productId?._id || item.productId) === product._id
                );

                if (!inEnquiry) {
                    await API.post('/cart/add', {
                        productId: product._id,
                        quantity: 1
                    });
                }
            }

            localStorage.setItem('selectedEnquiryItems', JSON.stringify(selectedProducts));
            navigate('/request-quotation');
        } catch (error) {
            console.error('Direct enquiry error:', error);
            showToast.error('Failed to process direct enquiry. Please try again.');
        } finally {
            setSubmittingDirectEnquiry(false);
        }
    };

    return (
        <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
            <Sidebar showFilter={false} />

            <div className="flex flex-col flex-1 overflow-y-auto">
                <Topbar />
                <div className="flex-1">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                        {/* Shop Header */}
                        <div className="mb-6">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors mb-4"
                            >
                                <FaArrowLeft />
                                <span className="text-sm md:text-base">Back to Home</span>
                            </button>

                            {loading ? (
                                <SkeletonShopHeader />
                            ) : shopInfo && (
                                <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                                    <div className="flex items-center gap-5">
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                                            <img
                                                src={shopInfo.img}
                                                alt={shopInfo.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder.jpg';
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                                                    {shopInfo.name}
                                                </h1>
                                                <div className="hidden md:flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-100 uppercase tracking-tighter">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                    Verified Seller
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-gray-500 font-medium font-outfit">
                                                <div className="flex items-center gap-1.5">
                                                    <FaStar className="text-yellow-400" />
                                                    <span className="text-gray-900 font-bold">{shopInfo.rating}</span>
                                                    <span>(450+ Reviews)</span>
                                                </div>
                                                <span className="hidden md:block text-gray-300">•</span>
                                                <div className="flex items-center gap-1.5">
                                                    <FaStore className="text-orange-500" />
                                                    <span>{shopInfo.products}</span>
                                                </div>
                                                {shopInfo.location && (
                                                    <>
                                                        <span className="hidden md:block text-gray-300">•</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <FaMapMarkerAlt className="text-blue-500" />
                                                            <span>{shopInfo.location}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900">
                                        Shop Collection
                                    </h2>
                                    {products.length > 0 && (
                                        <button
                                            onClick={toggleSelectAll}
                                            className="text-xs font-bold text-orange-500 hover:text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 transition-all font-outfit"
                                        >
                                            {selectedProducts.length === products.length ? 'Deselect All' : 'Select All Items'}
                                        </button>
                                    )}
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    {products.length} Items Available
                                </span>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {[...Array(8)].map((_, index) => (
                                    <SkeletonProductCard key={index} />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 font-outfit">
                                <FaStore className="text-7xl text-gray-200 mb-6" />
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Inventory Empty</h2>
                                <p className="text-gray-500 text-center max-w-sm mb-8 font-medium">
                                    This brand hasn't listed any firecrackers for this season yet. Check back soon!
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                                >
                                    Explore Other Brands
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-32">
                                {products.map((product) => {
                                    const inEnquiry = isInEnquiry(product._id);
                                    const isSelected = selectedProducts.includes(product._id);

                                    return (
                                        <div
                                            key={product._id}
                                            className={`bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border cursor-pointer active:scale-98 flex flex-row sm:flex-col relative ${isSelected ? 'border-orange-500 ring-2 ring-orange-100 shadow-lg' : 'border-gray-100'
                                                }`}
                                        >
                                            {/* Selection Overlay */}
                                            <div
                                                className={`absolute inset-0 z-10 cursor-pointer ${isSelected ? 'bg-orange-50/5' : ''
                                                    }`}
                                                onClick={() => toggleProductSelection(product._id)}
                                            />

                                            {/* Mobile: Details on Left | Desktop: Image on Top */}
                                            <div className="flex-1 sm:flex-none p-3 sm:p-4 order-1 sm:order-2 z-20 relative">
                                                <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                                                    <h3
                                                        className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 flex-1 cursor-pointer hover:text-orange-500 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/product/${product._id}`);
                                                        }}
                                                    >
                                                        {product.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1 bg-gray-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                                                        <FaStar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400" />
                                                        <span className="text-xs sm:text-sm font-medium text-gray-700">4.2</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium mb-0.5 sm:mb-1">Category</span>
                                                        <span className="text-xs sm:text-sm font-bold text-gray-800 capitalize">{product.category?.main || 'General'}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium mb-0.5 sm:mb-1">Brand</span>
                                                        <span className="text-xs sm:text-sm font-bold text-orange-600 capitalize">
                                                            {product.brand || 'Standard'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-base sm:text-lg md:text-xl font-black text-gray-900 leading-none">
                                                            ₹{product.pricing.selling_price.toLocaleString('en-IN')}
                                                        </span>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <span className="text-[8px] sm:text-[9px] font-bold text-orange-500 uppercase tracking-widest px-1.5 py-0.5 bg-orange-50 rounded border border-orange-100 whitespace-nowrap">
                                                                E. Price
                                                            </span>
                                                            {product.pricing.mrp > product.pricing.selling_price && (
                                                                <span className="text-[10px] sm:text-xs text-gray-400 line-through font-medium">
                                                                    ₹{product.pricing.mrp.toLocaleString('en-IN')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {inEnquiry ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate('/enquiry-list');
                                                            }}
                                                            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white border-2 border-orange-500 text-orange-600 rounded-lg transition-all shadow-sm hover:shadow-md hover:bg-orange-50 cursor-pointer active:scale-95"
                                                        >
                                                            <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                                                                In List (1)
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToEnquiry(product);
                                                            }}
                                                            disabled={addingToEnquiry === product._id || product.stock_control.available_pieces <= 0}
                                                            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 ${addingToEnquiry === product._id || product.stock_control.available_pieces <= 0
                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 cursor-pointer'
                                                                }`}
                                                        >
                                                            {addingToEnquiry === product._id ? (
                                                                <>
                                                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                                                                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Adding...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaClipboardList className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                                                                        {product.stock_control.available_pieces <= 0 ? 'Out' : 'Add'}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Mobile: Image on Right | Desktop: Image on Top */}
                                            <div className="relative w-32 sm:w-full aspect-square sm:aspect-[4/3] overflow-hidden cursor-pointer flex-shrink-0 order-2 sm:order-1">
                                                {/* Selection Checkbox */}
                                                <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 z-20 flex items-center justify-center transition-all ${isSelected
                                                    ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200'
                                                    : 'bg-white/80 backdrop-blur-sm border-white/50'
                                                    }`}>
                                                    {isSelected && <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />}
                                                </div>

                                                <img
                                                    src={product.images?.[0] || '/images/placeholder.jpg'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = '/images/placeholder.jpg';
                                                        e.target.onerror = null;
                                                    }}
                                                />

                                                {product.discount_percentage > 0 && (
                                                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm z-20">
                                                        <FaTag className="w-2 h-2" />
                                                        {product.discount_percentage}% OFF
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Selection Bar */}
                {selectedProducts.length > 0 && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-2xl bg-white/95 backdrop-blur-xl border border-orange-100 shadow-2xl rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-5 duration-300 font-outfit">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200">
                                    {selectedProducts.length}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-gray-900 font-bold leading-tight">Items Selected for Enquiry</p>
                                    <button
                                        onClick={() => setSelectedProducts([])}
                                        className="text-gray-500 text-xs hover:text-red-500 underline decoration-dotted"
                                    >
                                        Clear Selection
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleDirectEnquiry}
                                disabled={submittingDirectEnquiry}
                                className="flex-1 h-12 bg-gray-900 text-white font-bold rounded-xl hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                {submittingDirectEnquiry ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        <FaFileInvoice className="w-5 h-5" />
                                        <span>Send Enquiry Directly</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
                <Footer />
            </div>
        </div>
    );
};

export default ShopProductsPage;

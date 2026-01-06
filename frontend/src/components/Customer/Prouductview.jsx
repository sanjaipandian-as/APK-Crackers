import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaClipboardList, FaMinus, FaPlus, FaShare, FaTag, FaInfoCircle, FaShieldAlt, FaBox, FaCheckCircle, FaFileInvoice } from 'react-icons/fa';
import { BsFillBagHeartFill } from 'react-icons/bs';

import { MdLocalShipping, MdSecurity, MdVerified } from 'react-icons/md';
import API from '../../../api';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ConfirmToast from '../Common/ConfirmToast';
import LegalDisclaimer from '../Common/LegalDisclaimer';
import { SkeletonProductView, SkeletonProductCard } from '../Common/SkeletonLoaders';

const Productview = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isInCart, setIsInCart] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, reviewText: '' });
    const [editingReview, setEditingReview] = useState(null);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [userReview, setUserReview] = useState(null);

    const [cartItems, setCartItems] = useState([]);
    const [addingToCartSimilar, setAddingToCartSimilar] = useState(null);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [togglingWishlistSimilar, setTogglingWishlistSimilar] = useState(null);

    const isLoggedIn = useMemo(() => !!localStorage.getItem('token'), []);

    // Update document title
    useEffect(() => {
        if (product?.name) {
            document.title = `${product.name} | APK Crackers`;
        } else {
            document.title = 'Product Details - APK Crackers';
        }
    }, [product]);

    useEffect(() => {
        if (!id) return;

        const fetchAllData = async () => {
            setLoading(true);
            try {
                const productPromise = API.get(`/products/customer/product/${id}`);
                const similarPromise = API.get('/products/customer/page?page=1');
                const reviewsPromise = API.get(`/reviews/${id}`);

                const promises = [productPromise, similarPromise, reviewsPromise];
                if (isLoggedIn) {
                    promises.push(API.get('/cart'));
                    promises.push(API.get('/wishlist'));
                }

                const results = await Promise.allSettled(promises);

                if (results[0].status === 'fulfilled') {
                    setProduct(results[0].value.data);
                    setError('');
                } else {
                    setError('Failed to load product. Please try again later.');
                }

                if (results[1].status === 'fulfilled') {
                    const productsData = results[1].value.data.products || (Array.isArray(results[1].value.data) ? results[1].value.data : []);
                    const filtered = productsData.filter(p => p._id !== id).slice(0, 6);
                    setSimilarProducts(filtered);
                }

                if (results[2].status === 'fulfilled') {
                    const reviewsData = Array.isArray(results[2].value.data) ? results[2].value.data : [];
                    setReviews(reviewsData);

                    if (isLoggedIn) {
                        const userStr = localStorage.getItem('user');
                        if (userStr) {
                            const userId = JSON.parse(userStr)?._id;
                            const myReview = reviewsData.find(r => r.customerId?._id === userId);
                            setUserReview(myReview || null);
                        }
                    }
                }



                if (results[3]?.status === 'fulfilled') {
                    const items = results[3].value.data.items || [];
                    setCartItems(items);
                    const productInCart = items.some(item =>
                        (item.productId?._id || item.productId) === id
                    );
                    setIsInCart(productInCart);
                }

                if (results[4]?.status === 'fulfilled') {
                    const wishlistData = Array.isArray(results[4].value.data) ? results[4].value.data : [];
                    const wishlistProductIds = wishlistData.map(item => item.productId?._id || item.productId);
                    setWishlistItems(wishlistProductIds);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load product. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id, isLoggedIn]);

    useEffect(() => {
        if (!product || !product.images || product.images.length <= 1) return;

        const interval = setInterval(() => {
            setSelectedImage((prev) => (prev + 1) % product.images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [product]);

    const checkIsInCart = useCallback((productId) => {
        return cartItems.some(item =>
            (item.productId?._id || item.productId) === productId
        );
    }, [cartItems]);

    const getCartItemDetail = useCallback((productId) => {
        return cartItems.find(item =>
            (item.productId?._id || item.productId) === productId
        );
    }, [cartItems]);

    const handleAddToEnquirySimilar = async (e, productId) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            navigate('/Login');
            return;
        }
        setAddingToCartSimilar(productId);
        try {
            await API.post('/cart/add', { productId: productId.toString(), quantity: 1 });
            const response = await API.get('/cart');
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error('Add to enquiry error:', error);
        } finally {
            setAddingToCartSimilar(null);
        }
    };

    const toggleWishlistSimilar = async (e, productId) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            navigate('/Login');
            return;
        }
        setTogglingWishlistSimilar(productId);
        try {
            const isInWishlist = wishlistItems.includes(productId);
            if (isInWishlist) {
                await API.delete(`/wishlist/remove/${productId}`);
                setWishlistItems(prev => prev.filter(id => id !== productId));
            } else {
                await API.post('/wishlist/add', { productId });
                setWishlistItems(prev => [...prev, productId]);
            }
        } catch (error) {
            console.error('Wishlist error:', error);
        } finally {
            setTogglingWishlistSimilar(null);
        }
    };





    const handleQuantityChange = useCallback((action) => {
        if (!product) return;
        const available = product.stock_control?.available_pieces || 0;
        if (action === 'increase' && quantity < available) {
            setQuantity(quantity + 1);
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    }, [product, quantity]);

    const handleRequestQuotation = useCallback(async () => {
        if (isInCart) {
            localStorage.setItem('selectedEnquiryItems', JSON.stringify([product._id]));
            navigate('/request-quotation');
            return;
        }

        try {
            await API.post('/cart/add', {
                productId: product._id,
                quantity
            });
            setIsInCart(true);
            localStorage.setItem('selectedEnquiryItems', JSON.stringify([product._id]));
            navigate('/request-quotation');
        } catch (error) {
            console.error('Request quotation error:', error);
            showToast.error('Failed to process. Please try again.');
        }
    }, [isInCart, product, quantity, navigate]);

    const handleAddToEnquiry = useCallback(async () => {
        if (isInCart) {
            navigate('/enquiry-list');
            return;
        }

        try {
            await API.post('/cart/add', {
                productId: product._id,
                quantity
            });
            setIsInCart(true);
            showToast.success(`Added ${quantity} item(s) to enquiry list successfully!`);
            const response = await API.get('/cart');
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error('Add to enquiry error:', error);
            showToast.error(error.response?.data?.message || 'Failed to add to enquiry list');
        }
    }, [isInCart, product, quantity, navigate]);

    const handleAddReview = useCallback(async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            showToast.info('Please login to add a review');
            navigate('/Login');
            return;
        }

        setSubmittingReview(true);
        try {
            await API.post('/reviews/add', {
                productId: id,
                rating: reviewForm.rating,
                reviewText: reviewForm.reviewText
            });
            showToast.success('Review added successfully!');
            setShowReviewForm(false);
            setReviewForm({ rating: 5, reviewText: '' });
            const response = await API.get(`/reviews/${id}`);
            setReviews(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Add review error:', error);
            showToast.error(error.response?.data?.message || 'Failed to add review');
        } finally {
            setSubmittingReview(false);
        }
    }, [id, reviewForm, isLoggedIn, navigate]);

    const handleUpdateReview = useCallback(async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            await API.put(`/reviews/update/${editingReview}`, {
                rating: reviewForm.rating,
                reviewText: reviewForm.reviewText
            });
            showToast.success('Review updated successfully!');
            setShowReviewForm(false);
            setEditingReview(null);
            setReviewForm({ rating: 5, reviewText: '' });
            const response = await API.get(`/reviews/${id}`);
            setReviews(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Update review error:', error);
            showToast.error(error.response?.data?.message || 'Failed to update review');
        } finally {
            setSubmittingReview(false);
        }
    }, [editingReview, reviewForm, id]);

    const handleDeleteReview = useCallback(async (reviewId) => {
        showToast.confirm("Are you sure you want to delete your review?", async () => {
            try {
                await API.delete(`/reviews/delete/${reviewId}`);
                showToast.success('Review deleted successfully!');
                const response = await API.get(`/reviews/${id}`);
                setReviews(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Delete review error:', error);
                showToast.error(error.response?.data?.message || 'Failed to delete review');
            }
        });
    }, [id]);

    const openEditReview = useCallback((review) => {
        setEditingReview(review._id);
        setReviewForm({
            rating: review.rating,
            reviewText: review.reviewText
        });
        setShowReviewForm(true);
    }, []);

    const closeReviewForm = useCallback(() => {
        setShowReviewForm(false);
        setEditingReview(null);
        setReviewForm({ rating: 5, reviewText: '' });
    }, []);

    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }, [reviews]);

    const ratingDistribution = useMemo(() => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.rating]++;
        });
        return distribution;
    }, [reviews]);

    const productImages = useMemo(() =>
        product?.images && product.images.length > 0
            ? product.images
            : ['/images/placeholder.jpg']
        , [product]);

    const inStock = useMemo(() => (product?.stock_control?.available_pieces || 0) > 0, [product]);
    const sellingPrice = product?.pricing?.selling_price || 0;
    const mrp = product?.pricing?.mrp || 0;

    if (loading) {
        return (
            <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
                <Sidebar showFilter={false} />
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <Topbar />
                    <SkeletonProductView />
                    {/* Similar Products Section Skeleton */}
                    <div className="w-full max-w-screen-2xl mx-auto px-4 pb-12">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonProductCard key={i} />
                            ))}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-gradient-to-r from-orange-50 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
                    >
                        Browse All Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
            <Sidebar showFilter={false} />
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden w-full">
                <Topbar />
                {/* Legal Disclaimer - Compact on Mobile */}
                <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 pt-16 sm:pt-20 pb-2 sm:pb-4">
                    <div className="bg-orange-50/50 backdrop-blur-sm border border-orange-100/50 rounded-lg sm:rounded-xl overflow-hidden">
                        <LegalDisclaimer variant="compact" />
                    </div>
                </div>
                <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 pb-20 sm:pb-6 md:pb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                        <div className="lg:col-span-5">
                            <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4">
                                {/* Main Gallery Container - Enhanced Mobile */}
                                <div className="relative group bg-white border-0 sm:border border-gray-100 rounded-none sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-sm">
                                    <div className={`absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center transition-opacity duration-300 ${isImageLoading ? 'opacity-100' : 'opacity-0 z-0'}`}>
                                        <div className="animate-pulse flex flex-col items-center">
                                            <div className="w-12 h-12 bg-gray-300 rounded-full mb-2"></div>
                                            <div className="w-24 h-3 bg-gray-300 rounded-full"></div>
                                        </div>
                                    </div>
                                    <img
                                        src={productImages[selectedImage]}
                                        alt={product.name}
                                        className={`w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-contain p-3 sm:p-6 md:p-8 transition-all duration-500 ${isImageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                                        onLoad={() => setIsImageLoading(false)}
                                        onError={(e) => {
                                            e.target.src = '/images/placeholder.jpg';
                                            setIsImageLoading(false);
                                        }}
                                    />

                                    {/* Image Navigation Dots - Enhanced */}
                                    {productImages.length > 1 && (
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-2 bg-black/30 backdrop-blur-md rounded-full lg:hidden">
                                            {productImages.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setSelectedImage(idx);
                                                        setIsImageLoading(true);
                                                    }}
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${selectedImage === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/60'}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Strip - Modern Mobile Design */}
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x px-2 sm:px-0 -mx-2 sm:mx-0">
                                    {productImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedImage(index);
                                                setIsImageLoading(true);
                                            }}
                                            className={`flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 border-2 rounded-lg sm:rounded-xl overflow-hidden transition-all snap-start ${selectedImage === index ? 'border-orange-500 ring-2 ring-orange-500/30 scale-105' : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-orange-300'}`}
                                        >
                                            <img src={image} alt="" className="w-full h-full object-contain p-0.5 sm:p-1" onError={(e) => { e.target.src = '/images/placeholder.jpg'; }} />
                                        </button>
                                    ))}
                                </div>

                                {/* Sticky Action Buttons - Mobile Optimized */}
                                <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                                    <button
                                        onClick={handleAddToEnquiry}
                                        disabled={!inStock}
                                        className="group relative flex items-center justify-center gap-2 py-3 sm:py-4 bg-orange-50 text-orange-600 font-bold text-base sm:text-lg rounded-lg sm:rounded-xl overflow-hidden active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-orange-500/10 hover:border-orange-500/30"
                                    >
                                        <div className="absolute inset-0 bg-orange-500/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                        <FaClipboardList className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                                        <span className="relative z-10 uppercase tracking-tighter text-sm sm:text-base">{isInCart ? 'View Enquiry' : 'Add Enquiry'}</span>
                                    </button>
                                    <button
                                        onClick={handleRequestQuotation}
                                        disabled={!inStock}
                                        className="group relative flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-base sm:text-lg rounded-lg sm:rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 hover:shadow-xl hover:shadow-orange-500/30 transition-all disabled:opacity-50"
                                    >
                                        <FaFileInvoice className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="uppercase tracking-tighter text-sm sm:text-base">REQUEST QUOTATION</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            {/* Product Header - Card Style on Mobile */}
                            <div className="bg-white sm:bg-transparent p-3 sm:p-0 mb-3 sm:mb-4 shadow-sm sm:shadow-none rounded-lg sm:rounded-none">
                                <div className="flex items-center justify-between mb-2 gap-2">
                                    <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] sm:text-xs font-black uppercase tracking-tighter">
                                        {product.brand || 'Standard'}
                                    </span>
                                    <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-yellow-400 text-white rounded-full text-xs sm:text-sm font-black shadow-sm shadow-yellow-400/20">
                                        <FaStar className="w-3 h-3 sm:w-4 sm:h-4" /> {averageRating}
                                    </div>
                                </div>
                                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-1">
                                    {product.name}
                                </h1>
                                <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-mono">PID: {product._id?.substring(0, 8)}</p>
                            </div>

                            {/* Tags - Compact Mobile */}
                            <div className="flex items-center gap-2 mb-3 sm:mb-6 flex-wrap px-3 sm:px-0">
                                <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-50 text-gray-600 rounded-full text-[10px] sm:text-xs font-bold border border-gray-200">
                                    <FaBox className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" />
                                    <span className="whitespace-nowrap">{product.net_quantity || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-50 text-gray-600 rounded-full text-[10px] sm:text-xs font-bold border border-gray-200">
                                    <FaTag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" />
                                    <span className="whitespace-nowrap">{product.brand || 'Standard'}</span>
                                </div>
                            </div>

                            {/* Price Card - Enhanced Mobile */}
                            <div className="bg-white sm:bg-transparent p-3 sm:p-0 mb-3 sm:mb-6 shadow-sm sm:shadow-none rounded-lg sm:rounded-none border-b border-gray-100 sm:border-b sm:border-gray-200 sm:pb-6">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2 flex-wrap mb-1">
                                            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">₹{sellingPrice.toFixed(2)}</span>
                                            <span className="text-[10px] sm:text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 sm:py-1 rounded-md">Indicative</span>
                                        </div>
                                        {mrp > sellingPrice && (
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-sm sm:text-base md:text-lg text-gray-400 line-through">₹{mrp.toFixed(2)}</span>
                                                <span className="text-xs sm:text-sm text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">{product.discount_percentage}% OFF</span>
                                            </div>
                                        )}
                                        <p className="text-[10px] sm:text-xs text-gray-500 italic">Final price confirmed by seller</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-xs sm:text-sm font-black text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 uppercase tracking-wider">
                                    <FaInfoCircle className="text-orange-500 w-3.5 h-3.5 sm:w-4 sm:h-4" /> Technical Specs & Availability
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                    {[
                                        { label: 'Category', value: product.category?.main || 'General' },
                                        { label: 'Sub-Category', value: product.category?.sub || 'N/A' },
                                        { label: 'Total Boxes', value: product.stock_control?.total_boxes || 0 },
                                        { label: 'Pcs / Box', value: product.stock_control?.pieces_per_box || 0 },
                                        { label: 'Min Order', value: `${product.stock_control?.min_order_qty || 1} Qty` },
                                        { label: 'Available', value: `${product.stock_control?.available_pieces || 0} Pcs`, highlight: inStock }
                                    ].map((spec, i) => (
                                        <div key={i} className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${spec.highlight ? 'bg-orange-50 border-orange-200' : 'bg-gray-50/50 border-gray-100'}`}>
                                            <p className={`text-[9px] sm:text-[10px] uppercase font-black tracking-widest mb-1 ${spec.highlight ? 'text-orange-600' : 'text-gray-400'}`}>
                                                {spec.label}
                                            </p>
                                            <p className={`text-xs sm:text-sm font-bold truncate ${spec.highlight ? 'text-orange-700' : 'text-gray-800'}`}>
                                                {spec.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 sm:mt-6 flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${inStock ? 'bg-green-500 shadow-sm shadow-green-500/20' : 'bg-red-500 shadow-sm shadow-red-500/20'}`}></div>
                                        <span className={`text-xs sm:text-sm font-black uppercase tracking-wider ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                                            {inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                                        </span>
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Updated just now</div>
                                </div>
                            </div>

                            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                                <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Quantity:</p>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <button
                                        onClick={() => handleQuantityChange('decrease')}
                                        disabled={quantity <= 1}
                                        className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-orange-500 disabled:opacity-50 active:scale-95 transition-all"
                                    >
                                        <FaMinus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                                    </button>
                                    <span className="text-xl sm:text-2xl font-bold text-gray-900 w-12 sm:w-16 text-center border-2 border-gray-300 rounded-lg py-1.5 sm:py-2">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange('increase')}
                                        disabled={quantity >= (product.stock_control?.available_pieces || 0)}
                                        className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-orange-500 disabled:opacity-50 active:scale-95 transition-all"
                                    >
                                        <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                                <div className="flex flex-col items-center text-center p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg">
                                    <MdLocalShipping className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-orange-500 mb-1 sm:mb-2" />
                                    <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-900">Free Delivery</p>
                                </div>
                                <div className="flex flex-col items-center text-center p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg">
                                    <MdSecurity className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-orange-500 mb-1 sm:mb-2" />
                                    <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-900">Secure Payment</p>
                                </div>
                                <div className="flex flex-col items-center text-center p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg">
                                    <MdVerified className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-orange-500 mb-1 sm:mb-2" />
                                    <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-900">Certified Safe</p>
                                </div>
                            </div>

                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <FaShieldAlt className="text-orange-500" /> Safety Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col p-3 bg-red-50 rounded-lg border border-red-100">
                                        <span className="text-[10px] text-red-500 uppercase font-bold">Age Limit</span>
                                        <span className="text-sm font-bold text-gray-800">{product.safety?.age_limit || 12}+ Years</span>
                                    </div>
                                    <div className="flex flex-col p-3 bg-red-50 rounded-lg border border-red-100">
                                        <span className="text-[10px] text-red-500 uppercase font-bold">Explosive Class</span>
                                        <span className="text-sm font-bold text-gray-800">{product.safety?.explosive_class || 'Class 7'}</span>
                                    </div>
                                </div>
                                {product.safety?.instructions && (
                                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                        <p className="text-[10px] text-yellow-700 uppercase font-bold mb-1">Safety Instructions</p>
                                        <p className="text-xs text-gray-700 italic leading-relaxed">{product.safety.instructions}</p>
                                    </div>
                                )}
                            </div>

                            {product.description && (
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">Product Description</h2>
                                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {product.specifications?.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">Specifications</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {product.specifications.map((spec, i) => (
                                            <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <span className="text-gray-600 font-medium">{spec.key}</span>
                                                <span className="text-gray-900 font-bold">{spec.value} {spec.unit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Customer Reviews</h2>
                            {!userReview && (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg shadow-md whitespace-nowrap"
                                >
                                    Write Review
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200">
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
                                    <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-2">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar key={index} className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${index < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs sm:text-sm md:text-base text-gray-600">Based on {reviews.length} reviews</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = ratingDistribution[star];
                                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-2 sm:gap-3 mb-2">
                                            <span className="text-xs sm:text-sm font-semibold text-gray-700 w-6 sm:w-8">{star}★</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                                                <div className="bg-yellow-400 h-2 sm:h-3 rounded-full" style={{ width: `${percentage}%` }}></div>
                                            </div>
                                            <span className="text-xs sm:text-sm text-gray-600 w-6 sm:w-8">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {showReviewForm && (
                            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-200 mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">{editingReview ? 'Edit Your Review' : 'Write a Review'}</h3>
                                    <button onClick={closeReviewForm} className="text-gray-600 font-bold text-xl">×</button>
                                </div>
                                <form onSubmit={editingReview ? handleUpdateReview : handleAddReview}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                                                    <FaStar className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <textarea
                                            value={reviewForm.reviewText}
                                            onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                                            rows="4"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                                            placeholder="Share your experience..."
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={closeReviewForm} className="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg">Cancel</button>
                                        <button type="submit" disabled={submittingReview} className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg disabled:opacity-50">
                                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="space-y-4">
                            {reviews.map((review) => {
                                const isUserReview = userReview && userReview._id === review._id;
                                return (
                                    <div key={review._id} className={`p-6 rounded-2xl border-2 ${isUserReview ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900">{review.customerId?.name || 'Anonymous'}</h4>
                                                <div className="flex gap-1 my-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                                <p className="text-gray-700">{review.reviewText}</p>
                                            </div>
                                            {isUserReview && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEditReview(review)} className="text-orange-600 text-sm font-bold">Edit</button>
                                                    <button onClick={() => handleDeleteReview(review._id)} className="text-red-600 text-sm font-bold">Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Similar Products</h2>

                        {/* Mobile & Tablet: Horizontal Scroll */}
                        <div className="lg:hidden overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
                            style={{
                                WebkitOverflowScrolling: 'touch',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}
                        >
                            <div className="flex gap-3 sm:gap-4">
                                {similarProducts.map((item) => {
                                    const inCart = checkIsInCart(item._id);
                                    const cartItemDetail = getCartItemDetail(item._id);
                                    const availablePieces = item.stock_control?.available_pieces || 0;
                                    const sellingPrice = item.pricing?.selling_price || 0;
                                    const mrp = item.pricing?.mrp;
                                    const discount = item.discount_percentage;
                                    const brandName = item.brand || 'Standard';

                                    return (
                                        <div
                                            key={item._id}
                                            onClick={() => { navigate(`/product/${item._id}`); window.scrollTo(0, 0); }}
                                            className="flex-shrink-0 w-[280px] sm:w-[300px] bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer active:scale-98 snap-start"
                                        >
                                            <div className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer">
                                                <img
                                                    src={item.images?.[0] || '/images/placeholder.jpg'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = '/images/placeholder.jpg';
                                                        e.target.onerror = null;
                                                    }}
                                                />

                                                {discount > 0 && (
                                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                                                        <FaTag className="w-2 h-2" />
                                                        {discount}% OFF
                                                    </div>
                                                )}

                                                <button
                                                    onClick={(e) => toggleWishlistSimilar(e, item._id)}
                                                    disabled={togglingWishlistSimilar === item._id}
                                                    className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-90"
                                                >
                                                    {togglingWishlistSimilar === item._id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-orange-500"></div>
                                                    ) : (
                                                        <BsFillBagHeartFill
                                                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${wishlistItems.includes(item._id)
                                                                ? 'text-red-500'
                                                                : 'text-gray-300 hover:text-red-400'
                                                                }`}
                                                        />
                                                    )}
                                                </button>
                                                {availablePieces <= 0 && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm sm:text-base md:text-lg">Out of Stock</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-3 sm:p-4">
                                                <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                                                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 flex-1">{item.name}</h3>
                                                    <div className="flex items-center gap-1 bg-gray-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded cursor-pointer flex-shrink-0">
                                                        <FaStar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400" />
                                                        <span className="text-xs sm:text-sm font-medium text-gray-700">4.2</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium mb-0.5 sm:mb-1">Category</span>
                                                        <span className="text-xs sm:text-sm font-bold text-gray-800 capitalize">{item.category?.main || 'General'}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium mb-0.5 sm:mb-1">Brand</span>
                                                        <span className="text-xs sm:text-sm font-bold text-orange-600 capitalize">
                                                            {brandName}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100 gap-2">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="text-base sm:text-lg md:text-xl font-bold text-gray-800">₹{sellingPrice.toFixed(2)}</span>
                                                            <span className="text-[9px] sm:text-[10px] font-semibold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">Est.</span>
                                                        </div>
                                                        {mrp > sellingPrice && (
                                                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">₹{mrp.toFixed(2)}</span>
                                                        )}
                                                    </div>

                                                    {inCart ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate('/enquiry-list');
                                                            }}
                                                            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white border-2 border-orange-500 text-orange-600 rounded-lg transition-all shadow-sm hover:shadow-md hover:bg-orange-50 cursor-pointer active:scale-95"
                                                        >
                                                            <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                                                                In Enquiry ({cartItemDetail?.quantity || 1})
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => handleAddToEnquirySimilar(e, item._id)}
                                                            disabled={addingToCartSimilar === item._id || availablePieces <= 0}
                                                            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 ${addingToCartSimilar === item._id || availablePieces <= 0
                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 cursor-pointer'
                                                                }`}
                                                        >
                                                            {addingToCartSimilar === item._id ? (
                                                                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                                                            ) : (
                                                                <React.Fragment>
                                                                    <FaClipboardList className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                                                                        {availablePieces <= 0 ? 'Out' : 'Add'}
                                                                    </span>
                                                                </React.Fragment>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Desktop: Grid Layout */}
                        <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                            {similarProducts.map((item) => {
                                const inCart = checkIsInCart(item._id);
                                const cartItemDetail = getCartItemDetail(item._id);
                                const availablePieces = item.stock_control?.available_pieces || 0;
                                const sellingPrice = item.pricing?.selling_price || 0;
                                const mrp = item.pricing?.mrp;
                                const discount = item.discount_percentage;
                                const brandName = item.brand || 'Standard';

                                return (
                                    <div
                                        key={item._id}
                                        onClick={() => { navigate(`/product/${item._id}`); window.scrollTo(0, 0); }}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer active:scale-98"
                                    >
                                        <div className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer">
                                            <img
                                                src={item.images?.[0] || '/images/placeholder.jpg'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder.jpg';
                                                    e.target.onerror = null;
                                                }}
                                            />

                                            {discount > 0 && (
                                                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                                                    <FaTag className="w-2 h-2" />
                                                    {discount}% OFF
                                                </div>
                                            )}


                                            {availablePieces <= 0 && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">Out of Stock</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-3 gap-2">
                                                <h3 className="text-base font-semibold text-gray-800 line-clamp-2 flex-1">{item.name}</h3>
                                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded cursor-pointer flex-shrink-0">
                                                    <FaStar className="w-3 h-3 text-yellow-400" />
                                                    <span className="text-sm font-medium text-gray-700">4.2</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 font-medium mb-1">Category</span>
                                                    <span className="text-sm font-bold text-gray-800 capitalize">{item.category?.main || 'General'}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-gray-500 font-medium mb-1">Brand</span>
                                                    <span className="text-sm font-bold text-orange-600 capitalize">
                                                        {brandName}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-xl font-bold text-gray-800">₹{sellingPrice.toFixed(2)}</span>
                                                    {mrp > sellingPrice && (
                                                        <span className="text-xs text-gray-400 line-through">₹{mrp.toFixed(2)}</span>
                                                    )}
                                                </div>

                                                {inCart ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate('/enquiry-list');
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-orange-500 text-orange-600 rounded-lg transition-all shadow-sm hover:shadow-md hover:bg-orange-50 cursor-pointer active:scale-95"
                                                    >
                                                        <FaCheckCircle className="w-4 h-4" />
                                                        <span className="text-sm font-medium whitespace-nowrap">
                                                            In Enquiry ({cartItemDetail?.quantity || 1})
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => handleAddToEnquirySimilar(e, item._id)}
                                                        disabled={addingToCartSimilar === item._id || availablePieces <= 0}
                                                        className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 ${addingToCartSimilar === item._id || availablePieces <= 0
                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 cursor-pointer'
                                                            }`}
                                                    >
                                                        {addingToCartSimilar === item._id ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        ) : (
                                                            <React.Fragment>
                                                                <FaClipboardList className="w-4 h-4" />
                                                                <span className="text-sm font-medium whitespace-nowrap">
                                                                    {availablePieces <= 0 ? 'Out' : 'Add'}
                                                                </span>
                                                            </React.Fragment>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Scrollbar Hide CSS */}
                        <style>{`
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                        .scrollbar-hide {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>
                    </div>
                    {/* Footer - Full Width No Padding */}
                    <div className="-mx-2 sm:-mx-4 md:-mx-6">
                        <Footer />
                    </div>
                </div>

                {/* Sticky Mobile Action Bar - Bottom */}
                <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
                    <div className="grid grid-cols-2 gap-2 p-3">
                        <button
                            onClick={handleAddToEnquiry}
                            disabled={!inStock}
                            className="flex items-center justify-center gap-1.5 py-3 bg-orange-50 text-orange-600 font-bold text-sm rounded-lg active:scale-95 transition-all disabled:opacity-50 border-2 border-orange-500/20"
                        >
                            <FaClipboardList className="w-4 h-4" />
                            <span className="uppercase tracking-tight">{isInCart ? 'View' : 'Enquiry'}</span>
                        </button>
                        <button
                            onClick={handleRequestQuotation}
                            disabled={!inStock}
                            className="flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-orange-500/30 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <FaFileInvoice className="w-4 h-4" />
                            <span className="uppercase tracking-tight">Quotation</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default Productview;

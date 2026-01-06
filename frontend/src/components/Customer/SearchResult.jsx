import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import showToast from '../../utils/toast.jsx';
import { FaStar, FaShoppingCart, FaCheckCircle, FaExclamationCircle, FaHeart, FaSearch, FaFilter, FaTimes, FaClipboardList, FaTag } from 'react-icons/fa';
import { BsFillBagHeartFill } from 'react-icons/bs';
import API from '../../../api';
import { SkeletonProductCard } from '../Common/SkeletonLoaders';

const SearchResult = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addingToCart, setAddingToCart] = useState(null);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [togglingWishlist, setTogglingWishlist] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        inStock: false,
        sortBy: 'relevance'
    });

    const categories = ['Sparklers', 'Rockets', 'Fountains', 'Gift Boxes', 'Chakras', 'Bombs', 'Flower Pots', 'Ground Chakkars'];

    useEffect(() => {
        if (searchQuery) {
            searchProducts();
            fetchWishlist();
            fetchCart();
        }
    }, [searchQuery]);

    const searchProducts = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await API.get(`/search?q=${encodeURIComponent(searchQuery)}`);
            setAllProducts(response.data.products || []);
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Search error:', error);
            setError('Failed to search products. Please try again.');
            setAllProducts([]);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [filters, allProducts]);

    const applyFilters = () => {
        let filtered = [...allProducts];

        if (filters.category) {
            filtered = filtered.filter(p =>
                (p.category?.main || p.category)?.toLowerCase() === filters.category.toLowerCase()
            );
        }

        if (filters.minPrice) {
            filtered = filtered.filter(p => (p.pricing?.selling_price || p.price) >= parseFloat(filters.minPrice));
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(p => (p.pricing?.selling_price || p.price) <= parseFloat(filters.maxPrice));
        }

        if (filters.inStock) {
            filtered = filtered.filter(p => (p.stock_control?.available_pieces || p.stock) > 0);
        }

        switch (filters.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => (a.pricing?.selling_price || a.price) - (b.pricing?.selling_price || b.price));
                break;
            case 'price-high':
                filtered.sort((a, b) => (b.pricing?.selling_price || b.price) - (a.pricing?.selling_price || a.price));
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'rating':
                filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
            default:
                break;
        }

        setProducts(filtered);
    };

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await API.get('/wishlist');
            const wishlistProductIds = (Array.isArray(response.data) ? response.data : []).map(item => item.productId._id);
            setWishlistItems(wishlistProductIds);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await API.get('/cart');
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const toggleWishlist = async (e, productId) => {
        e.stopPropagation();

        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please login to add items to wishlist', 'error');
            setTimeout(() => navigate('/Login'), 1500);
            return;
        }

        setTogglingWishlist(productId);

        try {
            const isInWishlist = wishlistItems.includes(productId);

            if (isInWishlist) {
                await API.delete(`/wishlist/remove/${productId}`);
                setWishlistItems(prev => prev.filter(id => id !== productId));
                showNotification('Removed from wishlist', 'success');
            } else {
                await API.post('/wishlist/add', { productId });
                setWishlistItems(prev => [...prev, productId]);
                showNotification('Added to wishlist!', 'success');
            }
        } catch (error) {
            console.error('Wishlist error:', error);
            if (error.response?.status === 401) {
                showNotification('Session expired. Please login again', 'error');
                setTimeout(() => navigate('/Login'), 1500);
            } else {
                showNotification(error.response?.data?.message || 'Failed to update wishlist', 'error');
            }
        } finally {
            setTogglingWishlist(null);
        }
    };

    const handleAddToEnquiry = async (e, productId) => {
        e.stopPropagation();

        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please login to add items to enquiry list', 'error');
            setTimeout(() => navigate('/Login'), 1500);
            return;
        }

        setAddingToCart(productId);

        try {
            await API.post('/cart/add', {
                productId: productId.toString(),
                quantity: 1
            });

            showNotification('Added to enquiry list successfully!', 'success');
            fetchCart();
        } catch (error) {
            console.error('Add to enquiry error:', error);
            if (error.response?.status === 401) {
                showNotification('Session expired. Please login again', 'error');
                setTimeout(() => navigate('/Login'), 1500);
            } else {
                showNotification(error.response?.data?.message || 'Failed to add to enquiry list', 'error');
            }
        } finally {
            setAddingToCart(null);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const showNotification = (message, type) => {
        if (type === 'success') showToast.success(message);
        else if (type === 'error') showToast.error(message);
        else showToast.info(message);
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            inStock: false,
            sortBy: 'relevance'
        });
    };

    const isGiftBox = (category) => {
        const catName = typeof category === 'object' ? category?.main : category;
        return catName?.toLowerCase() === 'gift boxes' || catName?.toLowerCase() === 'gift box';
    };

    const giftBoxProducts = products.filter(p => isGiftBox(p.category));
    const otherProducts = products.filter(p => !isGiftBox(p.category));

    const FilterSidebar = () => (
        <div className="w-full h-full bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <h2 className="text-base sm:text-lg lg:text-xl font-black text-gray-900 flex items-center gap-2">
                        <FaFilter className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                        Filters
                    </h2>
                    <button
                        onClick={clearFilters}
                        className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-bold px-2.5 py-1 hover:bg-orange-50 rounded-lg transition-all"
                    >
                        Clear All
                    </button>
                </div>

                <div className="space-y-5 sm:space-y-6">
                    {/* Sort By */}
                    <div>
                        <h3 className="text-xs sm:text-sm font-black text-gray-800 mb-3 uppercase tracking-wide">Sort By</h3>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all bg-white"
                        >
                            <option value="relevance">Relevance</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="newest">Newest First</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <h3 className="text-xs sm:text-sm font-black text-gray-800 mb-3 uppercase tracking-wide">Category</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setFilters({ ...filters, category: '' })}
                                className={`w-full text-left px-3 sm:px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${filters.category === ''
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                All Categories
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilters({ ...filters, category: cat })}
                                    className={`w-full text-left px-3 sm:px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${filters.category === cat
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="text-xs sm:text-sm font-black text-gray-800 mb-3 uppercase tracking-wide">Price Range</h3>
                        <div className="space-y-3">
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                className="w-full px-3 sm:px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* In Stock */}
                    <div className="pt-4 border-t border-gray-200">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.inStock}
                                onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                                className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                            />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600 transition-colors">In Stock Only</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProductCard = (product) => {
        const isInCart = cartItems.some(item => (item.productId?._id || item.productId) === product._id);
        const cartItem = cartItems.find(item => (item.productId?._id || item.productId) === product._id);
        const availableStock = product.stock_control?.available_pieces || product.stock || 0;
        const sellingPrice = product.pricing?.selling_price || product.price || 0;
        const mrp = product.pricing?.mrp || product.originalPrice;
        const discount = mrp && mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
        const [imageError, setImageError] = useState(false);
        const [imageLoading, setImageLoading] = useState(true);

        return (
            <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 cursor-pointer transform hover:-translate-y-2"
            >
                {/* Image Container */}
                <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-orange-50 via-gray-50 to-yellow-50">
                    {/* Loading Skeleton */}
                    {imageLoading && !imageError && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-pulse space-y-3 w-full p-4">
                                <div className="h-32 bg-gray-200 rounded-lg"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    )}

                    {/* Image or Placeholder */}
                    {!imageError ? (
                        <img
                            src={product.images?.[0] || '/images/placeholder.jpg'}
                            alt={product.name}
                            className={`w-full h-full object-contain p-3 sm:p-4 group-hover:scale-110 transition-all duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                            loading="lazy"
                            onLoad={() => setImageLoading(false)}
                            onError={(e) => {
                                // If the original image fails, try the placeholder
                                if (product.images?.[0] && e.target.src !== window.location.origin + '/images/placeholder.jpg') {
                                    e.target.src = '/images/placeholder.jpg';
                                } else {
                                    // If even the placeholder fails or there was no original image
                                    setImageError(true);
                                    setImageLoading(false);
                                }
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-3">
                                <FaShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-gray-600">Product Image</p>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">No preview available</p>
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => toggleWishlist(e, product._id)}
                        disabled={togglingWishlist === product._id}
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-10 active:scale-90"
                    >
                        {togglingWishlist === product._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                        ) : (
                            <BsFillBagHeartFill
                                className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${wishlistItems.includes(product._id) ? 'text-red-500' : 'text-gray-400 group-hover:text-red-400'
                                    }`}
                            />
                        )}
                    </button>

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs sm:text-sm font-black px-2 sm:px-3 py-1 rounded-lg shadow-lg flex items-center gap-1">
                            <FaTag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            {discount}% OFF
                        </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {availableStock <= 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white font-black text-sm sm:text-base bg-red-500 px-4 py-2 rounded-lg shadow-lg">Out of Stock</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4">
                    {/* Title & Rating */}
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 line-clamp-2 flex-1 leading-tight hover:text-orange-600 transition-colors">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-lg text-xs sm:text-sm font-black shadow-md flex-shrink-0">
                            <FaStar className="w-3 h-3" />
                            <span>4.2</span>
                        </div>
                    </div>

                    {/* Category & Stock */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-2.5 border border-gray-200">
                            <p className="text-[10px] sm:text-xs text-gray-500 font-bold mb-0.5 uppercase tracking-wide">Category</p>
                            <p className="text-xs sm:text-sm font-bold text-gray-900 capitalize truncate">
                                {product.category?.main || product.category || 'General'}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-2.5 text-right border border-gray-200">
                            <p className="text-[10px] sm:text-xs text-gray-500 font-bold mb-0.5 uppercase tracking-wide">Stock</p>
                            <p className={`text-xs sm:text-sm font-black ${availableStock > 10 ? 'text-green-600' : availableStock > 0 ? 'text-orange-600' : 'text-red-600'
                                }`}>
                                {availableStock > 0 ? `${availableStock} units` : 'Out'}
                            </p>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b-2 border-gray-200">
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                                    ₹{sellingPrice.toFixed(2)}
                                </span>
                                {discount > 0 && (
                                    <span className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">-{discount}%</span>
                                )}
                            </div>
                            {mrp && mrp > sellingPrice && (
                                <span className="text-xs sm:text-sm text-gray-400 line-through mt-0.5">
                                    ₹{mrp.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action Button */}
                    {isInCart ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/enquiry-list');
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-white border-2 border-orange-500 text-orange-600 rounded-lg sm:rounded-xl transition-all shadow-sm hover:shadow-md hover:bg-orange-50 font-bold text-sm active:scale-95"
                        >
                            <FaCheckCircle className="w-4 h-4" />
                            <span>In Enquiry ({cartItem?.quantity || 1})</span>
                        </button>
                    ) : (
                        <button
                            onClick={(e) => handleAddToEnquiry(e, product._id)}
                            disabled={addingToCart === product._id || availableStock <= 0}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-white rounded-lg sm:rounded-xl transition-all shadow-md hover:shadow-lg font-bold text-sm active:scale-95 ${addingToCart === product._id || availableStock <= 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                                }`}
                        >
                            {addingToCart === product._id ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Adding...</span>
                                </>
                            ) : (
                                <>
                                    <FaClipboardList className="w-4 h-4" />
                                    <span>{availableStock <= 0 ? 'Out of Stock' : 'Add Enquiry'}</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 xl:w-80 flex-shrink-0">
                <FilterSidebar />
            </div>

            {/* Mobile Filter Drawer */}
            {showMobileFilters && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
                    <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
                            <h2 className="text-lg font-black text-gray-900">Filters</h2>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="p-2 hover:bg-white rounded-full transition-all active:scale-90"
                            >
                                <FaTimes className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <FilterSidebar />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-white px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 border-b border-gray-200 shadow-sm flex-shrink-0">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                <FaSearch className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-gray-900 truncate">
                                    Search: "{searchQuery}"
                                </h1>
                                {!loading && (
                                    <p className="text-gray-600 text-xs sm:text-sm font-medium mt-0.5">
                                        {products.length} {products.length === 1 ? 'result' : 'results'} found
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="lg:hidden px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg flex items-center gap-2 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all flex-shrink-0 active:scale-95"
                        >
                            <FaFilter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Filters</span>
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                            {[...Array(8)].map((_, index) => (
                                <SkeletonProductCard key={index} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 sm:py-32 px-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <FaExclamationCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
                            </div>
                            <p className="text-gray-700 text-base sm:text-lg font-bold text-center mb-2">{error}</p>
                            <button
                                onClick={searchProducts}
                                className="mt-4 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all text-sm sm:text-base font-bold active:scale-95"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 sm:py-32 px-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FaSearch className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-700 text-lg sm:text-xl font-bold mb-2 text-center">No products found</p>
                            <p className="text-gray-500 text-sm sm:text-base mb-6 text-center">Try adjusting your filters or search terms</p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all text-sm sm:text-base font-bold active:scale-95"
                            >
                                Browse All Products
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 sm:space-y-10">
                            {/* Gift Boxes Section */}
                            {giftBoxProducts.length > 0 && (
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                                        <span className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></span>
                                        Gift Boxes
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                                        {giftBoxProducts.map(renderProductCard)}
                                    </div>
                                </div>
                            )}

                            {/* Other Products Section */}
                            {otherProducts.length > 0 && (
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                                        <span className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></span>
                                        All Products
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                                        {otherProducts.map(renderProductCard)}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResult;

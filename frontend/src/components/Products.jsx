import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaChevronDown, FaShoppingCart, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import API from '../../api';

const Products = () => {
    const navigate = useNavigate();
    const [filterDropdown, setFilterDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [addingToCart, setAddingToCart] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await API.get('/products/customer');
            const productsData = Array.isArray(response.data) ? response.data : [];
            setProducts(productsData);
            setError('');
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again later.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const filterOptions = ['All', 'Night', 'Day'];

    const filteredProducts = selectedFilter === 'All'
        ? products
        : products.filter(product => product.category === selectedFilter.toLowerCase());

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleAddToCart = async (e, productId) => {
        e.stopPropagation();

        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please login to add items to cart', 'error');
            setTimeout(() => navigate('/Login'), 1500);
            return;
        }

        setAddingToCart(productId);

        try {
            const response = await API.post('/cart/add', {
                productId: productId.toString(),
                quantity: 1
            });

            showNotification('Added to cart successfully!', 'success');
        } catch (error) {
            console.error('Add to cart error:', error);
            if (error.response?.status === 401) {
                showNotification('Session expired. Please login again', 'error');
                setTimeout(() => navigate('/Login'), 1500);
            } else {
                showNotification(error.response?.data?.message || 'Failed to add to cart', 'error');
            }
        } finally {
            setAddingToCart(null);
        }
    };

    return (
        <div className="flex-1 bg-gray-50 overflow-y-auto">
            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg transform transition-all ${notification.type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    {notification.type === 'success' ? (
                        <FaCheckCircle className="w-5 h-5" />
                    ) : (
                        <FaExclamationCircle className="w-5 h-5" />
                    )}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            {/* Header Section */}
            <div className="bg-white px-6 py-2">
                <div className="flex items-center justify-between">
                    {/* Left - Title */}
                    <h1 className="text-xl font-bold text-gray-800">All Crackers</h1>

                    {/* Right - Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Scan Barcode Button */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-full hover:border-gray-400 transition-all cursor-pointer">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                                <path d="M7 7h.01M7 12h.01M7 17h.01M12 7h.01M12 12h.01M12 17h.01M17 7h.01M17 12h.01M17 17h.01" strokeWidth="2" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Scan Barcode</span>
                        </button>

                        {/* Slicedice Button */}
                        <button className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-all cursor-pointer">
                            Slicedice
                        </button>

                        {/* Filter Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setFilterDropdown(!filterDropdown)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-full hover:border-gray-400 transition-all cursor-pointer"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 4h18M3 12h18M3 20h18" />
                                    <circle cx="7" cy="4" r="2" fill="currentColor" />
                                    <circle cx="17" cy="12" r="2" fill="currentColor" />
                                    <circle cx="7" cy="20" r="2" fill="currentColor" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Filter</span>
                                <FaChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${filterDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {filterDropdown && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    {filterOptions.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedFilter(option);
                                                setFilterDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer ${index === 0 ? 'rounded-t-lg' : ''
                                                } ${index === filterOptions.length - 1 ? 'rounded-b-lg' : ''
                                                } ${selectedFilter === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Selected Filter Display */}
            {selectedFilter !== 'All' && (
                <div className="px-6 pt-4">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full">
                        <span className="text-sm font-medium">Filter: {selectedFilter}</span>
                        <button
                            onClick={() => setSelectedFilter('All')}
                            className="hover:bg-orange-200 rounded-full p-1 transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FaExclamationCircle className="w-16 h-16 text-red-500 mb-4" />
                        <p className="text-gray-600 text-lg">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-gray-600 text-lg">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                onClick={() => handleProductClick(product._id)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer"
                            >
                                {/* Product Image */}
                                <div className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer">
                                    <img
                                        src={product.images?.[0] || 'https://img.freepik.com/premium-photo/illustration-diwali-crackers-in-the-sky-white-background_756405-49701.jpg?w=2000'}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">Out of Stock</span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    {/* Product Name and Rating */}
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-base font-semibold text-gray-800">{product.name}</h3>
                                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded cursor-pointer">
                                            <FaStar className="w-3 h-3 text-yellow-400" />
                                            <span className="text-sm font-medium text-gray-700">4.2</span>
                                            <span className="text-xs text-gray-500">(0)</span>
                                        </div>
                                    </div>

                                    {/* Category and Stock Row */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex flex-col">
                                            <span className="text-m text-gray-500 font-medium mb-1">Category</span>
                                            <span className="text-sm font-bold text-gray-800 capitalize">{product.category || 'General'}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-m text-gray-500 font-medium mb-1">Stock</span>
                                            <span className={`text-sm font-bold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                                {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price and Action Buttons */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <span className="text-lg font-bold text-gray-800">₹{product.price?.toFixed(2) || '0.00'}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => handleAddToCart(e, product._id)}
                                                disabled={addingToCart === product._id || product.stock <= 0}
                                                className={`p-2 text-white rounded-lg transition-all shadow-sm hover:shadow-md ${addingToCart === product._id || product.stock <= 0
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 cursor-pointer'
                                                    }`}
                                            >
                                                <FaShoppingCart className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleProductClick(product._id);
                                                }}
                                                disabled={product.stock <= 0}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${product.stock <= 0
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 group cursor-pointer'
                                                    }`}
                                            >
                                                <span className={`text-sm font-medium ${product.stock <= 0 ? 'text-gray-400' : 'text-gray-700 group-hover:text-orange-500'}`}>
                                                    {product.stock <= 0 ? 'Unavailable' : 'Buy now'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;

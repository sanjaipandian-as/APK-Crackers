import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaMinus, FaPlus, FaHeart, FaShare } from 'react-icons/fa';
import { MdLocalShipping, MdSecurity, MdVerified } from 'react-icons/md';
import API from '../../api';

const Productview = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchProduct();
            fetchSimilarProducts();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/products/customer/product/${id}`);
            setProduct(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to load product. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarProducts = async () => {
        try {
            const response = await API.get('/products/customer');
            const productsData = Array.isArray(response.data) ? response.data : [];
            // Filter out current product and limit to 6 items
            const filtered = productsData.filter(p => p._id !== id).slice(0, 6);
            setSimilarProducts(filtered);
        } catch (error) {
            console.error('Error fetching similar products:', error);
        }
    };

    const handleQuantityChange = (action) => {
        if (!product) return;
        if (action === 'increase' && quantity < product.stock) {
            setQuantity(quantity + 1);
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handlePlaceOrder = () => {
        navigate('/checkout', { state: { product, quantity } });
    };

    const handleAddToCart = async () => {
        try {
            await API.post('/cart/add', {
                productId: product._id,
                quantity
            });
            alert('Added to cart successfully!');
        } catch (error) {
            console.error('Add to cart error:', error);
            alert('Failed to add to cart');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <p className="text-gray-600 text-lg mb-4">{error || 'Product not found'}</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                    Go Back to Products
                </button>
            </div>
        );
    }

    const productImages = product.images && product.images.length > 0
        ? product.images
        : ['https://img.freepik.com/premium-photo/illustration-diwali-crackers-in-the-sky-white-background_756405-49701.jpg?w=2000'];

    const inStock = product.stock > 0;

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="max-w-screen-2xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left - Images (5 columns) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-8">
                            {/* Main Image */}
                            <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
                                <img
                                    src={productImages[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-[500px] object-contain p-8"
                                />
                                <div className="absolute bottom-4 right-4 flex gap-2">
                                    <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                        <FaHeart className="w-5 h-5 text-gray-700" />
                                    </button>
                                    <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                        <FaShare className="w-5 h-5 text-gray-700" />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnail Images */}
                            <div className="grid grid-cols-4 gap-3">
                                {productImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`border-2 rounded-lg overflow-hidden transition-all ${selectedImage === index
                                            ? 'border-orange-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-20 object-contain p-2"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Action Buttons - Desktop */}
                            <div className="hidden lg:flex gap-3 mt-6">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!inStock}
                                    className="flex-1 py-4 bg-orange-100 border-2 border-orange-500 text-orange-600 font-bold text-lg rounded-lg hover:bg-orange-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaShoppingCart className="w-5 h-5" />
                                    ADD TO CART
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={!inStock}
                                    className="flex-1 py-4 bg-orange-500 text-white font-bold text-lg rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    BUY NOW
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right - Product Details (7 columns) */}
                    <div className="lg:col-span-7">
                        {/* Product Title */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                        {/* Category */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                            <span className="px-3 py-2 bg-orange-100 text-orange-700 rounded font-bold text-sm capitalize">
                                {product.category || 'General'}
                            </span>
                        </div>

                        {/* Price Section */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-4xl font-bold text-gray-900">₹{product.price?.toFixed(2) || '0.00'}</span>
                            </div>
                            <p className="text-sm text-gray-600">+ Free Delivery • Inclusive of all taxes</p>
                        </div>

                        {/* Stock */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                {inStock ? (
                                    <>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-green-600 font-bold">In Stock</span>
                                        <span className="text-gray-600">({product.stock} units available)</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span className="text-red-600 font-bold">Out of Stock</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <p className="text-sm font-bold text-gray-700 mb-3">Quantity:</p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleQuantityChange('decrease')}
                                    disabled={quantity <= 1}
                                    className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaMinus className="w-4 h-4 text-gray-700" />
                                </button>
                                <span className="text-2xl font-bold text-gray-900 w-16 text-center border-2 border-gray-300 rounded-lg py-2">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => handleQuantityChange('increase')}
                                    disabled={quantity >= product.stock}
                                    className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaPlus className="w-4 h-4 text-gray-700" />
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                                <MdLocalShipping className="w-10 h-10 text-orange-500 mb-2" />
                                <p className="text-xs font-bold text-gray-900">Free Delivery</p>
                                <p className="text-xs text-gray-600">On all orders</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                                <MdSecurity className="w-10 h-10 text-orange-500 mb-2" />
                                <p className="text-xs font-bold text-gray-900">Secure Payment</p>
                                <p className="text-xs text-gray-600">100% Protected</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                                <MdVerified className="w-10 h-10 text-orange-500 mb-2" />
                                <p className="text-xs font-bold text-gray-900">Certified Safe</p>
                                <p className="text-xs text-gray-600">Quality Assured</p>
                            </div>
                        </div>

                        {/* Product Description */}
                        {product.description && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-3">Product Description</h2>
                                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Similar Products Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
                        <button
                            onClick={() => navigate('/')}
                            className="text-orange-600 hover:text-orange-700 font-semibold"
                        >
                            View All →
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {similarProducts.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => {
                                    navigate(`/product/${item._id}`);
                                    window.scrollTo(0, 0);
                                }}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <div className="relative overflow-hidden bg-gray-50">
                                    <img
                                        src={item.images?.[0] || 'https://img.freepik.com/premium-photo/illustration-diwali-crackers-in-the-sky-white-background_756405-49701.jpg?w=2000'}
                                        alt={item.name}
                                        className="w-full h-40 object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10">{item.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-900">₹{item.price?.toFixed(0) || '0'}</span>
                                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded font-bold capitalize">
                                            {item.category || 'General'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
                <div className="flex gap-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        className="flex-1 py-3 bg-orange-100 border-2 border-orange-500 text-orange-600 font-bold rounded-lg flex items-center justify-center gap-2"
                    >
                        <FaShoppingCart className="w-5 h-5" />
                        CART
                    </button>
                    <button
                        onClick={handlePlaceOrder}
                        disabled={!inStock}
                        className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-lg"
                    >
                        BUY NOW
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Productview;

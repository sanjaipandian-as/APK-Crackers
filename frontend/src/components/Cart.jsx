import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import API from '../../api';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingItem, setUpdatingItem] = useState(null);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/Login');
                return;
            }

            const response = await API.get('/cart');
            setCartItems(response.data.items || []);
            setLoading(false);
        } catch (err) {
            console.error('Fetch cart error:', err);
            if (err.response?.status === 401) {
                navigate('/Login');
            } else {
                setError('Failed to load cart');
                setLoading(false);
            }
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItem(productId);
        try {
            await API.put('/cart/update', {
                productId,
                quantity: newQuantity
            });

            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.productId._id === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        } catch (err) {
            console.error('Update quantity error:', err);
            setError('Failed to update quantity');
        } finally {
            setUpdatingItem(null);
        }
    };

    const removeItem = async (productId) => {
        setUpdatingItem(productId);
        try {
            await API.delete(`/cart/remove/${productId}`);
            setCartItems(prevItems => prevItems.filter(item => item.productId._id !== productId));
        } catch (err) {
            console.error('Remove item error:', err);
            setError('Failed to remove item');
            setUpdatingItem(null);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.productId.price * item.quantity);
        }, 0);
    };

    const calculateTax = (subtotal) => {
        return subtotal * 0.18; // 18% GST
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        return subtotal + tax;
    };

    if (loading) {
        return (
            <div className="flex-1 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex-1 bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaShoppingCart className="w-16 h-16 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven't added any crackers yet. Start shopping to light up your celebrations!</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white rounded-full transition-all cursor-pointer"
                        >
                            <FaArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                        <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-semibold">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.productId._id}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                            >
                                <div className="flex gap-6">
                                    {/* Product Image */}
                                    <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                        <img
                                            src={item.productId.images?.[0] || 'https://img.freepik.com/premium-photo/illustration-diwali-crackers-in-the-sky-white-background_756405-49701.jpg?w=2000'}
                                            alt={item.productId.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                {item.productId.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-3">
                                                {item.productId.description || 'Premium quality crackers'}
                                            </p>
                                            <p className="text-2xl font-bold text-orange-600">
                                                ₹{item.productId.price.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                                                    disabled={updatingItem === item.productId._id || item.quantity <= 1}
                                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    <FaMinus className="w-3 h-3 text-gray-600" />
                                                </button>
                                                <span className="w-12 text-center font-semibold text-gray-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                                                    disabled={updatingItem === item.productId._id}
                                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    <FaPlus className="w-3 h-3 text-gray-600" />
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeItem(item.productId._id)}
                                                disabled={updatingItem === item.productId._id}
                                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                                <span className="font-medium">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (GST 18%)</span>
                                    <span className="font-semibold">₹{calculateTax(calculateSubtotal()).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">Total</span>
                                        <span className="text-2xl font-bold text-orange-600">
                                            ₹{calculateTotal().toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg cursor-pointer"
                            >
                                Proceed to Checkout
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full mt-3 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-all cursor-pointer"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

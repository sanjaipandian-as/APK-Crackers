import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from '../utils/toast.jsx';
import { FaUser, FaBell, FaShoppingBag, FaMapMarkerAlt, FaCheck, FaBox, FaTicketAlt } from 'react-icons/fa';
import { SkeletonForm } from '../components/Common/SkeletonLoaders';

// Lazy load components for better performance
const AccountSettings = lazy(() => import('./Settingscomponants/AccountSettings'));
const OrdersPage = lazy(() => import('../components/Customer/Quotations'));
const AddressManagement = lazy(() => import('./Settingscomponants/AddressManagement'));
const NotificationSettings = lazy(() => import('./Settingscomponants/NotificationSettings'));
const Tickets = lazy(() => import('./Settingscomponants/Tickets'));

const Settings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(true);

    // User Data State
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Fetch user data on component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    // Update document title based on active tab
    useEffect(() => {
        const tabTitles = {
            'account': 'Account Settings',
            'orders': 'My Quatation',
            'addresses': 'My Addresses',
            'tickets': 'Support Tickets',
            'notifications': 'Notifications'
        };
        document.title = `${tabTitles[activeTab] || 'Settings'} - APK Crackers`;
    }, [activeTab]);

    // Fetch user profile data
    const fetchUserData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');

            if (!token) {
                navigate('/Login');
                return;
            }

            // For all users, use stored data
            const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUserData({
                    name: user.name || user.username || user.businessName || 'User',
                    email: user.email || '',
                    phone: user.phone || ''
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            showToast.error('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: FaUser, description: 'Personal information' },
        { id: 'orders', label: 'My Quatation', icon: FaBox, description: 'Track your orders' },
        { id: 'addresses', label: 'Addresses', icon: FaMapMarkerAlt, description: 'Manage delivery addresses' },
        { id: 'tickets', label: 'Support Tickets', icon: FaTicketAlt, description: 'View support tickets' },
        { id: 'notifications', label: 'Notifications', icon: FaBell, description: 'Manage alerts' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 flex flex-col">
                {/* Header Skeleton */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 animate-pulse">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-200 rounded-xl sm:rounded-2xl"></div>
                            <div className="text-center space-y-2">
                                <div className="h-8 bg-gray-200 rounded w-32 mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Tabs Skeleton */}
                <div className="lg:hidden bg-white border-b border-gray-200 overflow-x-auto">
                    <div className="flex gap-2 p-3 animate-pulse">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-10 bg-gray-200 rounded-lg w-32 flex-shrink-0"></div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex w-full">
                        {/* Desktop Sidebar Skeleton */}
                        <div className="hidden lg:block w-80 flex-shrink-0 bg-white border-r border-gray-200">
                            <div className="p-6 space-y-2 animate-pulse">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Content Skeleton */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="bg-white h-full">
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <SkeletonForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 flex flex-col">
            {/* Enhanced Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                            <FaUser className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
                            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500">Manage your account and preferences</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Tabs - Horizontal Scroll */}
            <div className="lg:hidden bg-white border-b border-gray-200 overflow-x-auto">
                <div className="flex gap-2 p-3 min-w-max">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex w-full">
                    {/* Desktop Sidebar Navigation - Full Height */}
                    <div className="hidden lg:block w-80 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
                        <div className="p-6 space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all group ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'
                                            } transition-all`}>
                                            <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-600'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-semibold ${activeTab === tab.id ? 'text-white' : 'text-gray-900'}`}>
                                                {tab.label}
                                            </div>
                                            <div className={`text-xs ${activeTab === tab.id ? 'text-white/80' : 'text-gray-500'}`}>
                                                {tab.description}
                                            </div>
                                        </div>
                                        {activeTab === tab.id && (
                                            <FaCheck className="w-4 h-4 text-white" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Enhanced Main Content - Full Height */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="bg-white h-full">
                            <div className="p-4 sm:p-6 lg:p-8">
                                <Suspense fallback={<SkeletonForm />}>
                                    {/* Account Settings */}
                                    {activeTab === 'account' && (
                                        <AccountSettings userData={userData} setUserData={setUserData} />
                                    )}

                                    {/* My Orders */}
                                    {activeTab === 'orders' && (
                                        <OrdersPage standalone={false} />
                                    )}

                                    {/* Address Management */}
                                    {activeTab === 'addresses' && (
                                        <AddressManagement />
                                    )}

                                    {/* Support Tickets */}
                                    {activeTab === 'tickets' && (
                                        <Tickets />
                                    )}

                                    {/* Notifications */}
                                    {activeTab === 'notifications' && (
                                        <NotificationSettings />
                                    )}
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

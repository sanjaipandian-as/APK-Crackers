import { useState, useEffect } from 'react';
import showToast from '../../utils/toast.jsx';
import { FaBell, FaEnvelope, FaPhone, FaShoppingBag, FaGlobe, FaSave } from 'react-icons/fa';

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        orderUpdates: true,
        promotions: true,
        newsletter: true
    });

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(prev => ({ ...prev, ...parsed }));
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }, []);

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveSettings = () => {
        // Save settings to localStorage
        localStorage.setItem('userSettings', JSON.stringify(settings));
        showToast.success('Settings saved successfully!');
    };

    const notificationOptions = [
        { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive notifications via email', icon: FaEnvelope },
        { key: 'smsNotifications', title: 'SMS Notifications', desc: 'Receive notifications via SMS', icon: FaPhone },
        { key: 'orderUpdates', title: 'Order Updates', desc: 'Get updates about your orders', icon: FaShoppingBag },
        { key: 'promotions', title: 'Promotions & Offers', desc: 'Receive exclusive deals and offers', icon: FaGlobe },
        { key: 'newsletter', title: 'Newsletter', desc: 'Stay updated with our newsletter', icon: FaBell }
    ];

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header Section */}
            <div className="flex items-center gap-2 sm:gap-3 pb-4 sm:pb-6 border-b border-gray-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaBell className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Notification Preferences</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Choose how you want to be notified</p>
                </div>
            </div>

            {/* Notification Options */}
            <div className="space-y-3 sm:space-y-4">
                {notificationOptions.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                        <div
                            key={item.key}
                            className="flex items-center justify-between p-3 sm:p-4 md:p-5 bg-gradient-to-r from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-100 hover:border-orange-200 transition-all group"
                        >
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0 pr-3">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-all flex-shrink-0">
                                    <ItemIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{item.title}</h4>
                                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 sm:line-clamp-none">{item.desc}</p>
                                </div>
                            </div>

                            {/* Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                <input
                                    type="checkbox"
                                    checked={settings[item.key]}
                                    onChange={(e) => handleChange(item.key, e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 sm:w-14 sm:h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 sm:after:h-6 sm:after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-orange-600 shadow-inner"></div>
                            </label>
                        </div>
                    );
                })}
            </div>

            {/* Save Button Section */}
            <div className="pt-4 sm:pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center">
                <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">Changes will be saved to your account</p>
                <button
                    onClick={handleSaveSettings}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 flex items-center justify-center gap-2 active:scale-95"
                >
                    <FaSave className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default NotificationSettings;

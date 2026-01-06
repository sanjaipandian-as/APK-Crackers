import { useState } from 'react';
import showToast from '../../utils/toast.jsx';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaKey, FaLock, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import API from '../../../api';

const AccountSettings = ({ userData, setUserData }) => {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedData, setEditedData] = useState({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || ''
    });
    const [saving, setSaving] = useState(false);

    // Password Change State
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const inputClasses = "w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-gray-200 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all placeholder:text-gray-400 bg-white hover:border-gray-300";
    const labelClasses = "block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2.5";

    // Save profile changes
    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');

            // Update based on role
            if (userRole === 'seller') {
                await API.put('/seller/profile', {
                    businessName: editedData.name,
                    email: editedData.email,
                    phone: editedData.phone
                });
            } else {
                // For customer/admin, update local storage
                const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    user.name = editedData.name;
                    user.email = editedData.email;
                    user.phone = editedData.phone;

                    if (localStorage.getItem('user')) {
                        localStorage.setItem('user', JSON.stringify(user));
                    }
                    if (sessionStorage.getItem('user')) {
                        sessionStorage.setItem('user', JSON.stringify(user));
                    }
                }
            }

            setUserData(editedData);
            setIsEditingProfile(false);
            showToast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // Handle password change
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');

        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return;
        }

        if (passwordData.oldPassword === passwordData.newPassword) {
            setPasswordError('New password must be different from old password');
            return;
        }

        try {
            setSaving(true);
            const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');

            // Call appropriate password change endpoint based on role
            if (userRole === 'customer') {
                await API.put('/customer/auth/change-password', {
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword
                });
            } else {
                // For seller and admin, show message that it's not implemented
                setPasswordError('Password change is only available for customers');
                setSaving(false);
                return;
            }

            showToast.success('Password changed successfully!');
            setShowPasswordForm(false);
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError(error.response?.data?.message || 'Failed to change password. Please check your old password.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-3 pb-4 sm:pb-6 border-b border-gray-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <FaUser className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Account Information</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Update your personal details and information</p>
                </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
                <div>
                    <label className={labelClasses}>
                        <FaUser className="inline mr-1.5 sm:mr-2 text-orange-500 text-xs sm:text-sm" />
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={isEditingProfile ? editedData.name : userData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        disabled={!isEditingProfile}
                        className={`${inputClasses} ${!isEditingProfile ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label className={labelClasses}>
                        <FaEnvelope className="inline mr-1.5 sm:mr-2 text-orange-500 text-xs sm:text-sm" />
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={isEditingProfile ? editedData.email : userData.email}
                        onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                        disabled={!isEditingProfile}
                        className={`${inputClasses} ${!isEditingProfile ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        placeholder="your.email@example.com"
                    />
                </div>

                <div>
                    <label className={labelClasses}>
                        <FaPhone className="inline mr-1.5 sm:mr-2 text-orange-500 text-xs sm:text-sm" />
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={isEditingProfile ? editedData.phone : userData.phone}
                        onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                        disabled={!isEditingProfile}
                        className={`${inputClasses} ${!isEditingProfile ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        placeholder="+91 98765 43210"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {!isEditingProfile ? (
                    <button
                        onClick={() => setIsEditingProfile(true)}
                        className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                    >
                        <FaEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Edit Profile
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/30 hover:shadow-xl disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <FaSave className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={() => {
                                setIsEditingProfile(false);
                                setEditedData(userData);
                            }}
                            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>

            {/* Password Section */}
            <div className="pt-4 sm:pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FaKey className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">Password & Security</h3>
                </div>

                {!showPasswordForm ? (
                    <button
                        onClick={() => setShowPasswordForm(true)}
                        className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2"
                    >
                        <FaLock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Change Password
                    </button>
                ) : (
                    <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-orange-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900">Change Password</h4>
                            <button
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                    setPasswordError('');
                                }}
                                className="p-1.5 sm:p-2 hover:bg-white rounded-lg transition-all active:scale-95 flex-shrink-0"
                            >
                                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                            </button>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-6">
                            {passwordError && (
                                <div className="p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl text-red-700 font-medium text-sm sm:text-base">
                                    {passwordError}
                                </div>
                            )}

                            <div>
                                <label className={labelClasses}>Old Password</label>
                                <div className="relative">
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                        className={inputClasses}
                                        placeholder="Enter old password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 active:scale-95"
                                    >
                                        {showOldPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className={inputClasses}
                                        placeholder="Enter new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 active:scale-95"
                                    >
                                        {showNewPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className={inputClasses}
                                        placeholder="Confirm new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 active:scale-95"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full sm:flex-1 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl disabled:opacity-50 active:scale-95"
                                >
                                    {saving ? 'Changing...' : 'Change Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                        setPasswordError('');
                                    }}
                                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountSettings;

import { useState, useEffect } from 'react';
import showToast from '../../utils/toast.jsx';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSave } from 'react-icons/fa';
import API from '../../../api';
import { SkeletonList } from '../../components/Common/SkeletonLoaders';

const AddressManagement = () => {
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressForm, setAddressForm] = useState({
        fullname: '',
        phone: '',
        pincode: '',
        state: '',
        city: '',
        addressLine: '',
        landmark: ''
    });

    const inputClasses = "w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-gray-200 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all placeholder:text-gray-400 bg-white hover:border-gray-300";
    const labelClasses = "block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2.5";

    useEffect(() => {
        fetchAddresses();
    }, []);

    // Fetch all addresses
    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const response = await API.get('/address');
            setAddresses(response.data || []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            showToast.error('Failed to load addresses');
        } finally {
            setLoadingAddresses(false);
        }
    };

    // Add new address
    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            await API.post('/address', addressForm);
            showToast.success('Address added successfully!');
            setShowAddressForm(false);
            resetAddressForm();
            fetchAddresses();
        } catch (error) {
            console.error('Error adding address:', error);
            showToast.error(error.response?.data?.message || 'Failed to add address');
        }
    };

    // Update address
    const handleUpdateAddress = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/address/${editingAddress}`, addressForm);
            showToast.success('Address updated successfully!');
            setEditingAddress(null);
            setShowAddressForm(false);
            resetAddressForm();
            fetchAddresses();
        } catch (error) {
            console.error('Error updating address:', error);
            showToast.error(error.response?.data?.message || 'Failed to update address');
        }
    };

    // Delete address
    const handleDeleteAddress = (addressId) => {
        showToast.confirm("Are you sure you want to delete this address?", async () => {
            try {
                await API.delete(`/address/${addressId}`);
                showToast.success('Address deleted successfully!');
                fetchAddresses();
            } catch (error) {
                console.error('Error deleting address:', error);
                showToast.error(error.response?.data?.message || 'Failed to delete address');
            }
        });
    };

    // Set default address
    const handleSetDefaultAddress = async (addressId) => {
        try {
            await API.put(`/address/default/${addressId}`);
            showToast.success('Default address updated!');
            fetchAddresses();
        } catch (error) {
            console.error('Error setting default address:', error);
            showToast.error(error.response?.data?.message || 'Failed to set default address');
        }
    };

    // Edit address
    const handleEditAddress = (address) => {
        setEditingAddress(address._id);
        setAddressForm({
            fullname: address.fullname,
            phone: address.phone,
            pincode: address.pincode,
            state: address.state,
            city: address.city,
            addressLine: address.addressLine,
            landmark: address.landmark || ''
        });
        setShowAddressForm(true);
    };

    // Reset form
    const resetAddressForm = () => {
        setAddressForm({
            fullname: '',
            phone: '',
            pincode: '',
            state: '',
            city: '',
            addressLine: '',
            landmark: ''
        });
        setEditingAddress(null);
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 sm:pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FaMapMarkerAlt className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Delivery Addresses</h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage your saved addresses</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        resetAddressForm();
                        setShowAddressForm(true);
                    }}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl flex items-center justify-center gap-2 active:scale-95"
                >
                    <FaPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Add New Address
                </button>
            </div>

            {/* Address Form */}
            {showAddressForm && (
                <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-orange-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        <button
                            onClick={() => {
                                setShowAddressForm(false);
                                resetAddressForm();
                            }}
                            className="p-1.5 sm:p-2 hover:bg-white rounded-lg transition-all flex-shrink-0 active:scale-95"
                        >
                            <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </button>
                    </div>

                    <form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                            <div>
                                <label className={labelClasses}>Full Name</label>
                                <input
                                    type="text"
                                    value={addressForm.fullname}
                                    onChange={(e) => setAddressForm({ ...addressForm, fullname: e.target.value })}
                                    className={inputClasses}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>Phone Number</label>
                                <input
                                    type="tel"
                                    value={addressForm.phone}
                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                    className={inputClasses}
                                    placeholder="+91 98765 43210"
                                    required
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClasses}>Address Line</label>
                                <input
                                    type="text"
                                    value={addressForm.addressLine}
                                    onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                                    className={inputClasses}
                                    placeholder="House No., Building Name, Street"
                                    required
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClasses}>Landmark (Optional)</label>
                                <input
                                    type="text"
                                    value={addressForm.landmark}
                                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                                    className={inputClasses}
                                    placeholder="Near..."
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>City</label>
                                <input
                                    type="text"
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                    className={inputClasses}
                                    placeholder="City"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>State</label>
                                <input
                                    type="text"
                                    value={addressForm.state}
                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                    className={inputClasses}
                                    placeholder="State"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>PIN Code</label>
                                <input
                                    type="text"
                                    value={addressForm.pincode}
                                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                    className={inputClasses}
                                    placeholder="600001"
                                    pattern="[0-9]{6}"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddressForm(false);
                                    resetAddressForm();
                                }}
                                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:flex-1 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl flex items-center justify-center gap-2 active:scale-95"
                            >
                                <FaSave className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                {editingAddress ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Address List */}
            {loadingAddresses ? (
                <div className="space-y-4 sm:space-y-6">
                    <SkeletonList items={3} />
                </div>
            ) : addresses.length === 0 ? (
                <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300">
                    <FaMapMarkerAlt className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 px-4">No addresses saved</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">Add your first delivery address to get started</p>
                    <button
                        onClick={() => {
                            resetAddressForm();
                            setShowAddressForm(true);
                        }}
                        className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl inline-flex items-center gap-2 active:scale-95"
                    >
                        <FaPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Add Address
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className={`p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${address.isDefault
                                ? 'border-orange-500 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 shadow-lg shadow-orange-500/20'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${address.isDefault ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gray-100'
                                        }`}>
                                        <FaMapMarkerAlt className={`w-4 h-4 sm:w-5 sm:h-5 ${address.isDefault ? 'text-white' : 'text-gray-600'
                                            }`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-sm sm:text-base text-gray-900 truncate">{address.fullname}</h4>
                                        {address.isDefault && (
                                            <span className="inline-block px-2 py-0.5 sm:py-1 bg-orange-500 text-white text-[10px] sm:text-xs font-semibold rounded mt-1">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-700">
                                <p className="leading-relaxed">{address.addressLine}</p>
                                {address.landmark && <p className="text-gray-600">Landmark: {address.landmark}</p>}
                                <p>{address.city}, {address.state} - {address.pincode}</p>
                                <p className="font-semibold">Phone: {address.phone}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-3 sm:pt-4 border-t border-gray-200">
                                {!address.isDefault && (
                                    <button
                                        onClick={() => handleSetDefaultAddress(address._id)}
                                        className="flex-1 min-w-[120px] px-3 sm:px-4 py-2 bg-orange-100 text-orange-600 font-semibold text-xs sm:text-sm rounded-lg hover:bg-orange-200 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                    >
                                        <FaCheck className="w-3 h-3" />
                                        Set Default
                                    </button>
                                )}
                                <button
                                    onClick={() => handleEditAddress(address)}
                                    className="flex-1 min-w-[100px] px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 font-semibold text-xs sm:text-sm rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                >
                                    <FaEdit className="w-3 h-3" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteAddress(address._id)}
                                    className="px-3 sm:px-4 py-2 bg-red-50 text-red-600 font-semibold text-xs sm:text-sm rounded-lg hover:bg-red-100 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                >
                                    <FaTrash className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressManagement;

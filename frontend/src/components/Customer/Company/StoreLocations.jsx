import { useState, useEffect } from 'react'
import { FaMapMarkerAlt, FaStore, FaClock, FaPhoneAlt, FaStar } from 'react-icons/fa'
import API from '../../../../api'

const StoreLocations = () => {
    const [sellers, setSellers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        document.title = 'Store Locations - APK Crackers'
        const fetchSellers = async () => {
            try {
                setLoading(true)
                const response = await API.get('/sellers/all')
                setSellers(response.data || [])
            } catch (error) {
                console.error('Error fetching sellers:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSellers()
    }, [])

    // Group sellers by state for better organization
    const groupedSellers = sellers.reduce((acc, seller) => {
        const state = seller.address?.state || 'Others'
        if (!acc[state]) acc[state] = []
        acc[state].push(seller)
        return acc
    }, {})

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Licensed Seller Locations</h1>
                    <p className="text-lg text-gray-600 mt-3">
                        Find and connect with verified firecracker shops in your region
                    </p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 animate-pulse">
                                <div className="h-6 bg-gray-100 rounded w-2/3 mb-4"></div>
                                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : Object.keys(groupedSellers).length > 0 ? (
                    <div className="space-y-12">
                        {Object.entries(groupedSellers).map(([state, stateSellers]) => (
                            <div key={state}>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-orange-600" />
                                    {state}
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {stateSellers.map((seller) => (
                                        <div
                                            key={seller._id}
                                            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                                        {seller.businessName}
                                                    </h3>
                                                    <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-gray-500">
                                                        <FaStar className="text-yellow-400" />
                                                        <span>{seller.rating}</span>
                                                        <span className="mx-1">•</span>
                                                        <span>{seller.totalProducts} Products</span>
                                                    </div>
                                                </div>
                                                <div className="bg-orange-50 text-orange-600 p-2.5 rounded-lg border border-orange-100">
                                                    <FaStore />
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {[
                                                        seller.address?.addressLine,
                                                        seller.address?.landmark && `Landmark: ${seller.address.landmark}`,
                                                        `${seller.address?.city}, ${seller.address?.state} - ${seller.address?.pincode}`
                                                    ].filter(Boolean).join(', ')}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                    <FaPhoneAlt className="text-orange-600" />
                                                    {seller.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded border border-green-100">
                                                    Open Now
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                        <FaStore className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No stores found</h3>
                        <p className="text-gray-500 mt-2">Check back later for newly joined licensed sellers.</p>
                    </div>
                )}
            </div>

            <section className="py-16 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Are you a licensed seller?</h2>
                    <p className="text-gray-400 mb-8">
                        List your store on APK Crackers to reach verified customers looking for quality fireworks.
                    </p>
                    <a
                        href="/seller-register"
                        className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
                    >
                        Register Your Store
                    </a>
                </div>
            </section>
        </div>
    )
}

export default StoreLocations

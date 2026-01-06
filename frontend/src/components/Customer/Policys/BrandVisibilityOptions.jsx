import { useEffect } from 'react'
import { FaBullhorn, FaEye, FaAward, FaChartLine } from 'react-icons/fa'

const BrandVisibilityOptions = () => {
    useEffect(() => {
        document.title = 'Brand Visibility Options - APK Crackers'
    }, [])
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Brand Visibility Options</h1>
                    <p className="text-lg text-gray-600 mt-3">
                        Enhance your store's presence and reach more customers
                    </p>
                </div>
            </header>

            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaEye className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">Featured Listing</h3>
                            <p className="text-gray-600 text-sm">
                                Get your products featured on the homepage for maximum eye-balls
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaBullhorn className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">Store Promotions</h3>
                            <p className="text-gray-600 text-sm">
                                Promote your entire store collection to users in specific regions
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaAward className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">Verified Badge</h3>
                            <p className="text-gray-600 text-sm">
                                Stand out with a verified seller badge that builds customer trust
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaChartLine className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">Insights Dashboard</h3>
                            <p className="text-gray-600 text-sm">
                                Track enquiry trends and popular products in your area
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-orange-50 border-y border-orange-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Visibility Matters</h2>
                    <p className="text-gray-700 text-lg">
                        In a competitive market like Sivakasi crackers, being visible to the right customer at the right time
                        significantly increases your enquiry conversion rates.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Visibility Levels
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3">Basic Listing</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Standard placement in search results</li>
                                <li>• Store-specific profile page</li>
                                <li>• Direct enquiry forwarding</li>
                            </ul>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6 bg-orange-50 border-orange-200">
                            <h3 className="font-bold text-gray-900 mb-3 text-orange-700">Premium Visibility</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Top-tier placement in search</li>
                                <li>• Highlighted store appearance</li>
                                <li>• Region-specific targeting</li>
                                <li>• Enhanced trust signals & badges</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started with Visibility</h2>
                    <p className="text-gray-600 mb-6">
                        Contact our seller relations team to discuss the best visibility plan for your store.
                    </p>
                    <p className="text-gray-700 font-semibold">
                        Email: partners@apkcrackers.com | Phone: +91 98765 43210
                    </p>
                </div>
            </section>
        </div>
    )
}

export default BrandVisibilityOptions

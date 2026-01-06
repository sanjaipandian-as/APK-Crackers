import { useEffect } from 'react'
import { FaBullhorn, FaMousePointer, FaAd, FaPaperPlane } from 'react-icons/fa'

const Advertise = () => {
    useEffect(() => {
        document.title = 'Advertise With Us - APK Crackers'
    }, [])
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Promote Your Store</h1>
                    <p className="text-lg text-gray-600 mt-3">
                        Boost your enquiries with targeted advertising on APK Crackers
                    </p>
                </div>
            </header>

            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-8 border border-gray-200 rounded-2xl group hover:border-orange-500 transition-all">
                            <FaBullhorn className="w-12 h-12 text-orange-600 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Banner Ads</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Premium placement on homepage and category pages to capture immediate attention.
                            </p>
                        </div>
                        <div className="p-8 border border-gray-200 rounded-2xl group hover:border-orange-500 transition-all">
                            <FaMousePointer className="w-12 h-12 text-orange-600 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Sponsored Search</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Appear at the top of search results when customers look for specific crackers.
                            </p>
                        </div>
                        <div className="p-8 border border-gray-200 rounded-2xl group hover:border-orange-500 transition-all">
                            <FaAd className="w-12 h-12 text-orange-600 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Regional Targeted Ads</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Show your ads only to users in your specific city or delivery radius.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-orange-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Start Advertising Today</h2>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Reach thousands of potential customers looking for high-quality Sivakasi crackers.
                        Our advertising solutions are built to drive genuine enquiries to your store.
                    </p>
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-orange-100 flex flex-col items-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Contact</h3>
                        <p className="text-gray-500 mb-8">Send us your requirements and we will build a custom plan for you</p>
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-xl font-bold transition-all flex items-center gap-2 transform hover:scale-105">
                            <FaPaperPlane />
                            Get a Free Quote
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Advertising Benefits</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaBullhorn className="text-orange-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">High ROI</h4>
                                <p className="text-gray-600 text-sm">Target customers who are already interested in firecrackers.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaBullhorn className="text-orange-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Detailed Analytics</h4>
                                <p className="text-gray-600 text-sm">Track impressions, clicks, and enquiries generated through your ads.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Advertise

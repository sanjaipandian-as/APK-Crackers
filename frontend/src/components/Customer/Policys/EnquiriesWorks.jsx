import { useEffect } from 'react'
import { FaSearch, FaPaperPlane, FaPhoneAlt, FaCheckCircle } from 'react-icons/fa'

const HowEnquiriesWork = () => {
    useEffect(() => {
        document.title = 'How Enquiries Work - APK Crackers'
    }, [])
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">How Enquiries Work</h1>
                    <p className="text-lg text-gray-600 mt-3">
                        Simple steps to connect with licensed firecracker sellers
                    </p>
                </div>
            </header>

            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaSearch className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">Browse Products</h3>
                            <p className="text-gray-600 text-sm">
                                Explore products listed by licensed sellers with indicative details
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaCheckCircle className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">Select Your Interest</h3>
                            <p className="text-gray-600 text-sm">
                                Choose products you are interested in without placing an order
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaPaperPlane className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">Send Enquiry</h3>
                            <p className="text-gray-600 text-sm">
                                Share your interest with the seller as an enquiry or quotation request
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaPhoneAlt className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">Seller Contacts You</h3>
                            <p className="text-gray-600 text-sm">
                                The seller contacts you directly to discuss price, availability, and next steps offline
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-orange-50 border-y border-orange-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Clarification</h2>
                    <p className="text-gray-700 text-lg">
                        This platform does not sell, accept payments, generate bills, or arrange delivery.
                        All pricing, payment, billing, and delivery are handled offline between you and the licensed seller.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        What the Platform Does and Does Not Do
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3">What We Do</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Show product information and indicative prices</li>
                                <li>• Connect customers with licensed sellers</li>
                                <li>• Forward enquiries to sellers</li>
                                <li>• Provide basic enquiry support</li>
                            </ul>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3">What We Don’t Do</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Do not sell or book products</li>
                                <li>• Do not accept payments</li>
                                <li>• Do not generate invoices or bills</li>
                                <li>• Do not handle delivery or transport</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
                    <p className="text-gray-600 mb-6">
                        If you have questions about how enquiries work, our support team can guide you.
                    </p>
                    <p className="text-gray-700 font-semibold">
                        Email: support@apkcrackers.com | Phone: +91 98765 43210
                    </p>
                </div>
            </section>
        </div>
    )
}

export default HowEnquiriesWork

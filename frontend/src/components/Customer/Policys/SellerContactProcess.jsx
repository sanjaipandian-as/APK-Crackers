import { useEffect } from 'react'
import { FaUserCheck, FaEnvelopeOpenText, FaPhoneAlt, FaHandshake } from 'react-icons/fa'

const SellerContactProcess = () => {
    useEffect(() => {
        document.title = 'Seller Contact Process - APK Crackers'
    }, [])
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Seller Contact Process</h1>
                    <p className="text-lg text-gray-600 mt-3">
                        How sellers and customers connect after an enquiry
                    </p>
                </div>
            </header>

            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaUserCheck className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">Verified Seller</h3>
                            <p className="text-gray-600 text-sm">
                                Enquiries are sent only to sellers who have submitted valid license documents
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaEnvelopeOpenText className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">Enquiry Received</h3>
                            <p className="text-gray-600 text-sm">
                                Seller receives your enquiry details and product interest summary
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaPhoneAlt className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">Direct Contact</h3>
                            <p className="text-gray-600 text-sm">
                                Seller contacts you directly via phone or message to discuss details
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaHandshake className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">Offline Discussion</h3>
                            <p className="text-gray-600 text-sm">
                                Pricing, availability, payment, and delivery are discussed offline
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-orange-50 border-y border-orange-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Clarification</h2>
                    <p className="text-gray-700 text-lg">
                        This platform does not control seller communication, pricing, payment, or delivery.
                        The seller and customer interact directly after the enquiry is sent.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        What to Expect From Sellers
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3">Seller Will</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Respond to your enquiry directly</li>
                                <li>• Confirm product availability</li>
                                <li>• Share final pricing offline</li>
                                <li>• Explain delivery or pickup options</li>
                            </ul>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3">Platform Will Not</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Interfere in seller communication</li>
                                <li>• Negotiate prices</li>
                                <li>• Collect payments</li>
                                <li>• Arrange delivery or transport</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Assistance?</h2>
                    <p className="text-gray-600 mb-6">
                        If you face issues contacting a seller, our support team can guide you on next steps.
                    </p>
                    <p className="text-gray-700 font-semibold">
                        Email: support@apkcrackers.com | Phone: +91 98765 43210
                    </p>
                </div>
            </section>
        </div>
    )
}

export default SellerContactProcess

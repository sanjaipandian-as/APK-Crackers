import { useEffect } from 'react'
import {
    FaStore,
    FaUserCheck,
    FaHandshake,
    FaClipboardList,
    FaPhoneAlt,
    FaShieldAlt
} from 'react-icons/fa'

const SellerEnquiryProgram = () => {
    useEffect(() => {
        document.title = 'Seller Enquiry Program - APK Crackers'
    }, [])
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Seller Enquiry Program
                    </h1>
                    <p className="text-lg text-gray-600 mt-3">
                        Connect with interested customers through verified enquiries
                    </p>
                </div>
            </header>

            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaStore className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">
                                Showcase Your Store
                            </h3>
                            <p className="text-gray-600 text-sm">
                                List your shop and products to reach customers who are actively
                                looking for crackers
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaClipboardList className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">
                                Receive Enquiries
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Get genuine product enquiries directly from interested customers
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaHandshake className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">
                                Close Deals Offline
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Discuss price, payment, and delivery directly with customers
                                outside the platform
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-orange-50 border-y border-orange-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        How the Seller Enquiry Program Works
                    </h2>
                    <p className="text-gray-700 text-lg">
                        Customers browse product information and send enquiries. The platform
                        forwards the enquiry details to you. All further communication,
                        pricing confirmation, and delivery are handled directly by you.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Seller Responsibilities
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3">
                                What Sellers Must Do
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Hold valid firecracker licenses</li>
                                <li>• Respond to enquiries promptly</li>
                                <li>• Confirm pricing and availability offline</li>
                                <li>• Follow all safety and transport regulations</li>
                            </ul>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3">
                                What the Platform Does Not Do
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Does not sell or book products</li>
                                <li>• Does not collect payments</li>
                                <li>• Does not arrange delivery</li>
                                <li>• Does not issue invoices or bills</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Seller Verification
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 border border-gray-200 rounded-xl bg-white">
                            <FaUserCheck className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">
                                Document Submission
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Sellers submit license and business details during onboarding
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl bg-white">
                            <FaShieldAlt className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">
                                Basic Verification
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Documents are checked for validity before approval
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl bg-white">
                            <FaPhoneAlt className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">
                                Direct Contact
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Sellers communicate directly with customers after enquiry
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Join the Seller Enquiry Program
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Grow your reach while staying compliant with Indian regulations
                    </p>
                    <p className="text-gray-700 font-semibold">
                        Contact: sellers@apkcrackers.com | Phone: +91 98765 43210
                    </p>
                </div>
            </section>
        </div>
    )
}

export default SellerEnquiryProgram

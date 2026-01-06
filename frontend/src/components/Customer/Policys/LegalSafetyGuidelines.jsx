import { useEffect } from 'react'
import {
    FaGavel,
    FaShieldAlt,
    FaExclamationTriangle,
    FaUserCheck,
    FaTruck,
    FaInfoCircle
} from 'react-icons/fa'

const LegalSafetyGuidelines = () => {
    useEffect(() => {
        document.title = 'Legal & Safety Guidelines - APK Crackers'
    }, [])
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Legal & Safety Guidelines
                    </h1>
                    <p className="text-lg text-gray-600 mt-3">
                        Important information for customers and sellers using this platform
                    </p>
                </div>
            </header>

            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaGavel className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">
                                Legal Compliance
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Firecrackers are regulated products in India and can be sold
                                only by licensed sellers through offline methods
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaUserCheck className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">
                                Licensed Sellers Only
                            </h3>
                            <p className="text-gray-600 text-sm">
                                This platform connects customers only with sellers who have
                                submitted valid license documents
                            </p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-xl">
                            <FaShieldAlt className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 mb-2">
                                Safety First
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Always follow safety instructions provided by sellers and on
                                product packaging
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-orange-50 border-y border-orange-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Platform Responsibility
                    </h2>
                    <p className="text-gray-700 text-lg">
                        This platform does not sell, book, store, transport, or deliver
                        firecrackers. It only facilitates enquiries between customers and
                        licensed sellers. All transactions take place offline.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Customer Guidelines
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3">
                                What Customers Should Do
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Use the platform only to send enquiries</li>
                                <li>• Verify seller details during offline discussion</li>
                                <li>• Follow all safety instructions carefully</li>
                                <li>• Discuss pricing and delivery directly with sellers</li>
                            </ul>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3">
                                What Customers Should Not Expect
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Online ordering or checkout</li>
                                <li>• Online payment or refunds</li>
                                <li>• Delivery arranged by the platform</li>
                                <li>• Platform-issued bills or invoices</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Seller Guidelines
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3">
                                Seller Responsibilities
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Maintain valid licenses and approvals</li>
                                <li>• Communicate clearly with customers</li>
                                <li>• Handle pricing, billing, and delivery offline</li>
                                <li>• Follow all transport and safety regulations</li>
                            </ul>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3">
                                Seller Restrictions
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• No courier or public transport misuse</li>
                                <li>• No online payment links through the platform</li>
                                <li>• No misrepresentation of platform role</li>
                                <li>• No violation of explosive safety laws</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-red-50 border-y border-red-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <FaExclamationTriangle className="w-10 h-10 text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Safety Warning
                    </h2>
                    <p className="text-gray-700 text-lg">
                        Firecrackers are hazardous products. Use only in open areas, keep
                        away from children, and strictly follow all safety and legal
                        guidelines.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <FaInfoCircle className="w-8 h-8 text-orange-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Need Clarification?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        If you have questions about legal or safety guidelines, our support
                        team can help explain the process.
                    </p>
                    <p className="text-gray-700 font-semibold">
                        Email: support@apkcrackers.com | Phone: +91 98765 43210
                    </p>
                </div>
            </section>
        </div>
    )
}

export default LegalSafetyGuidelines

import { useEffect } from 'react'
import { FiRotateCcw, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi'

const Returns = () => {
    useEffect(() => {
        document.title = 'Returns & Refund Information - APK Crackers'
    }, [])
    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl font-bold text-gray-900">Returns & Refund Information</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Important information regarding issues handled by sellers
                    </p>
                </div>
            </header>

            <section className="bg-orange-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <FiClock className="w-10 h-10 mx-auto mb-3" />
                            <div className="text-3xl font-bold mb-1">48 Hours</div>
                            <p className="text-orange-100">Issue reporting window</p>
                        </div>
                        <div>
                            <FiDollarSign className="w-10 h-10 mx-auto mb-3" />
                            <div className="text-3xl font-bold mb-1">Seller Policy</div>
                            <p className="text-orange-100">Handled offline</p>
                        </div>
                        <div>
                            <FiRotateCcw className="w-10 h-10 mx-auto mb-3" />
                            <div className="text-3xl font-bold mb-1">Direct Contact</div>
                            <p className="text-orange-100">With seller</p>
                        </div>
                        <div>
                            <FiCheckCircle className="w-10 h-10 mx-auto mb-3" />
                            <div className="text-3xl font-bold mb-1">Licensed Sellers</div>
                            <p className="text-orange-100">Verified documents</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-red-50 border-y border-red-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notice</h2>
                        <p className="text-lg text-gray-700">
                            This platform does not sell or deliver products. Any return,
                            replacement, or refund discussions must be handled directly
                            between the customer and the licensed seller, in accordance with
                            applicable safety regulations.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Common Seller-Handled Issues
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: 'Damaged Items',
                                desc: 'Condition issues discussed with seller'
                            },
                            {
                                title: 'Defective Items',
                                desc: 'Manufacturing-related concerns'
                            },
                            {
                                title: 'Wrong Items',
                                desc: 'Mismatch in products received'
                            },
                            {
                                title: 'Missing Items',
                                desc: 'Incomplete delivery cases'
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiCheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                        How Issue Resolution Works
                    </h2>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                        {[
                            {
                                step: 1,
                                title: 'Contact Seller',
                                desc: 'Reach out to the seller directly with details and photos'
                            },
                            {
                                step: 2,
                                title: 'Seller Review',
                                desc: 'Seller reviews the issue as per their policy'
                            },
                            {
                                step: 3,
                                title: 'Resolution Discussion',
                                desc: 'Seller and customer agree on next steps offline'
                            },
                            {
                                step: 4,
                                title: 'Outcome',
                                desc: 'Any replacement or refund is handled by the seller'
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-lg p-8"
                            >
                                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-orange-50 border-y border-orange-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Helpful Tips
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                        {[
                            'Inspect items immediately after receiving them',
                            'Keep original packaging and labels',
                            'Document issues with photos or videos',
                            'Contact the seller promptly',
                            'Follow safety instructions strictly',
                            'Discuss resolution offline with the seller'
                        ].map((tip, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <span className="text-orange-600 font-bold text-xl">•</span>
                                <p className="text-gray-700">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Need Platform Support?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        We can help guide you on contacting sellers
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div>
                            <p className="font-bold text-gray-900 mb-1">Email</p>
                            <p className="text-gray-600">support@apkcrackers.com</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 mb-1">Phone</p>
                            <p className="text-gray-600">+91 98765 43210</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 mb-1">Hours</p>
                            <p className="text-gray-600">Mon-Sat, 9 AM - 6 PM</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Returns

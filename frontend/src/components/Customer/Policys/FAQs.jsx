import { useState, useEffect } from 'react'
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi'

const FAQs = () => {
    useEffect(() => {
        document.title = 'Frequently Asked Questions - APK Crackers'
    }, [])
    const [openFaq, setOpenFaq] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')

    const categories = [
        { id: 'all', name: 'All Questions' },
        { id: 'enquiry', name: 'Enquiries & Quotations' },
        { id: 'process', name: 'How It Works' },
        { id: 'products', name: 'Products & Safety' },
        { id: 'account', name: 'Account & Support' }
    ]

    const faqs = [
        {
            category: 'enquiry',
            question: 'How does the quotation process work?',
            answer:
                'You can select products you are interested in and send an enquiry. The seller will contact you directly offline to provide the final quotation.'
        },
        {
            category: 'enquiry',
            question: 'Can I place an order on this platform?',
            answer:
                'No. This platform does not support online ordering. It only helps you connect with licensed sellers for enquiries.'
        },
        {
            category: 'enquiry',
            question: 'Does the platform handle payments?',
            answer:
                'No. All pricing, payment, and billing are handled offline directly between you and the seller.'
        },
        {
            category: 'process',
            question: 'What happens after I send an enquiry?',
            answer:
                'After you send an enquiry, the seller reviews your interest and contacts you directly to discuss availability, pricing, and next steps offline.'
        },
        {
            category: 'process',
            question: 'Is delivery managed by the platform?',
            answer:
                'No. Delivery, if any, is fully handled by the licensed seller and discussed directly with them.'
        },
        {
            category: 'products',
            question: 'Are the products shown on the platform safe?',
            answer:
                'Product information is shared by licensed sellers. Customers should always follow safety instructions provided by the seller and on product packaging.'
        },
        {
            category: 'products',
            question: 'Do you sell eco-friendly or green crackers?',
            answer:
                'Some sellers may offer eco-friendly or green crackers. Availability and details should be confirmed directly with the seller.'
        },
        {
            category: 'products',
            question: 'What safety precautions should I follow?',
            answer:
                'Always use crackers in open areas, maintain safe distance, supervise children, and follow all safety guidelines provided by the seller and manufacturer.'
        },
        {
            category: 'account',
            question: 'How do I create an account?',
            answer:
                'You can create an account using your name, email, and phone number. This helps sellers contact you regarding your enquiries.'
        },
        {
            category: 'account',
            question: 'How can I contact support?',
            answer:
                'You can reach our support team through the Contact Support page or by emailing support@apkcrackers.com.'
        },
        {
            category: 'account',
            question: 'Can I save my details for future enquiries?',
            answer:
                'Yes. Saving your details makes it easier to send enquiries without re-entering information each time.'
        }
    ]

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory =
            activeCategory === 'all' || faq.category === activeCategory
        const matchesSearch =
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b-2 border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-6">
                            Help Center
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed mb-8">
                            Find answers about enquiries, quotations, safety, and how this
                            platform works
                        </p>

                        <div className="relative max-w-2xl mx-auto">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-wrap gap-3 mb-8">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeCategory === category.id
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 transition-colors"
                            >
                                <button
                                    onClick={() =>
                                        setOpenFaq(openFaq === index ? null : index)
                                    }
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-semibold text-gray-900 pr-4">
                                        {faq.question}
                                    </span>
                                    {openFaq === index ? (
                                        <FiChevronUp className="w-5 h-5 text-orange-600" />
                                    ) : (
                                        <FiChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
                                        <p className="text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                No questions found matching your search.
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Try different keywords or browse all categories.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-12 bg-orange-600 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
                    <p className="text-orange-100 mb-6">
                        Have questions about enquiries or how the platform works? Our team
                        is here to help.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a
                            href="/support"
                            className="bg-white hover:bg-gray-100 text-orange-600 font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            Contact Support
                        </a>
                        <a
                            href="mailto:support@apkcrackers.com"
                            className="border-2 border-white hover:bg-white hover:text-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            Email Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FAQs

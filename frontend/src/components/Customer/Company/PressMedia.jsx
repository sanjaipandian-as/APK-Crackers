import { useEffect } from 'react'
import { FaNewspaper, FaMicrophone, FaUsers, FaShareAlt } from 'react-icons/fa'

const PressMedia = () => {
    useEffect(() => {
        document.title = 'Press & Media - APK Crackers'
    }, [])
    const news = [
        {
            date: 'Dec 15, 2024',
            title: 'APK Crackers Launches Sustainable Green Crackers Series',
            summary: 'Our latest range of green crackers reduces emissions by 30% while maintaining the traditional sparkle.'
        },
        {
            date: 'Nov 20, 2024',
            title: 'APK Crackers Reaches 10 Million Customer Milestone',
            summary: 'A decade of digital excellence in Sivakasi crackers industry leads to record growth.'
        },
        {
            date: 'Oct 05, 2024',
            title: 'Partnership with NEERI for Better Green Standards',
            summary: 'New collaboration aims to refine atmospheric chemical compositions for better safety.'
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Press & Media</h1>
                    <p className="text-lg text-gray-600 mt-3">
                        Latest news, updates, and media resources from APK Crackers
                    </p>
                </div>
            </header>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <div className="text-orange-600 text-sm font-bold mb-2">{item.date}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 cursor-pointer">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    {item.summary}
                                </p>
                                <button className="text-orange-600 font-semibold text-sm hover:underline">Read More →</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-orange-600 text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Media Kit & Resources</h2>
                    <p className="text-xl text-orange-100 mb-8">
                        Looking for high-resolution logos, product shots, or executive profiles?
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                            Download Media Kit
                        </button>
                        <button className="border-2 border-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition-colors">
                            Brand Guidelines
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Media Contact</h2>
                    <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                        <p className="text-gray-600 mb-4">
                            For all press and media inquiries, please reach out to our communications team.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="text-center md:text-right border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
                                <p className="font-bold text-gray-900">Email</p>
                                <p className="text-orange-600">press@apkcrackers.com</p>
                            </div>
                            <div className="text-center md:text-left md:pl-4">
                                <p className="font-bold text-gray-900">Phone</p>
                                <p className="text-orange-600">+91 98765 43210</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PressMedia

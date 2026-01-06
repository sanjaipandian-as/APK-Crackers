import { useNavigate } from 'react-router-dom'
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaLinkedinIn,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaHeadset,
    FaUser
} from 'react-icons/fa'

const Footer = () => {
    const navigate = useNavigate()
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        company: [
            { name: 'About Us', path: '/about' },
            { name: 'Contact Us', path: '/contact' },
            { name: 'Press & Media', path: '/press' },
            { name: 'Our Stores', path: '/stores' }
        ],
        help: [
            { name: 'Customer Support', path: '/support' },
            { name: 'How Enquiries Work', path: '/how-it-works' },
            { name: 'Seller Contact Process', path: '/seller-process' },
            { name: 'Legal & Safety Guidelines', path: '/legal' },
            { name: 'FAQs', path: '/faqs' }
        ],
        policy: [
            { name: 'List as a Licensed Seller', path: '/seller-register' },
            { name: 'Seller Enquiry Program', path: '/seller-program' },
            { name: 'Brand Visibility Options', path: '/brand-visibility' },
            { name: 'Promote Your Store', path: '/advertise' }
        ]
    }

    return (
        <footer className="bg-gray-900 text-white pb-14 lg:pb-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-3">
                                APK Crackers
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                A platform that connects customers with licensed firecracker sellers for enquiries
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-3 text-gray-300">Follow Us</h4>
                            <div className="flex gap-2">
                                {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn].map((Icon, index) => (
                                    <button
                                        key={index}
                                        className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-orange-600 flex items-center justify-center transition-all transform hover:scale-110 border border-gray-700"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-base font-bold mb-4">Company</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => navigate(link.path)}
                                        className="text-gray-400 hover:text-orange-400 text-sm"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-base font-bold mb-4">Help & Support</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.help.map((link, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => navigate(link.path)}
                                        className="text-gray-400 hover:text-orange-400 text-sm"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-base font-bold mb-4">Partner With Us</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.policy.map((link, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => navigate(link.path)}
                                        className="text-gray-400 hover:text-orange-400 text-sm"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-base font-bold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-orange-400 mt-1" />
                                <span className="text-gray-400 text-sm">
                                    123 Sivakasi Main Road,<br />
                                    Tamil Nadu, India - 626123
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhone className="text-orange-400" />
                                <span className="text-gray-400 text-sm">+91 12345 67890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-orange-400" />
                                <span className="text-gray-400 text-sm">support@apkcrackers.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800"></div>

            <div className="bg-gray-800/50">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: FaHeadset, title: 'Enquiry Support', desc: 'Help with enquiries only' },
                            { icon: FaShieldAlt, title: 'Licensed Sellers', desc: 'Verified seller documents' },
                            { icon: FaMapMarkerAlt, title: 'Local Sellers', desc: 'Connect with nearby stores' },
                            { icon: FaUser, title: 'Direct Contact', desc: 'Talk to sellers offline' }
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <item.icon className="text-orange-400" />
                                <div>
                                    <p className="text-sm font-semibold">{item.title}</p>
                                    <p className="text-xs text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800"></div>

            <div className="bg-gray-800/30">
                <div className="container mx-auto px-4 py-5">
                    <p className="text-xs text-center text-gray-400 leading-relaxed">
                        Payments are not processed on this platform. All pricing, billing, and delivery are handled offline between customers and licensed sellers.
                    </p>
                </div>
            </div>

            <div className="border-t border-gray-800"></div>

            <div className="bg-gray-950">
                <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-sm text-gray-400">
                        © {currentYear} <span className="text-orange-400 font-semibold">APK Crackers</span>. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-500">Made with ❤️ in India</p>
                </div>
            </div>

            <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border-t border-orange-800/50">
                <div className="container mx-auto px-4 py-3">
                    <p className="text-xs text-center text-orange-200">
                        This platform does not sell, store, transport, or deliver firecrackers. It only facilitates enquiries between customers and licensed sellers.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer

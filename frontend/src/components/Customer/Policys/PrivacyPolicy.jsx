import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaGlobe } from 'react-icons/fa'

const PrivacyPolicy = () => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = 'Privacy Policy - APK Crackers'
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-orange-50 rounded-full transition-all group"
                        >
                            <FaArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                        </button>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <FaGlobe className="w-4 h-4 text-gray-600" />
                                <span className="text-xs text-gray-600">English</span>
                            </div>
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                                PRIVACY POLICY
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 space-y-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded text-sm">
                        <p className="text-yellow-900">
                            <strong>Disclaimer:</strong> In case of any discrepancy, the English version of this policy shall prevail.
                        </p>
                    </div>

                    <div className="space-y-3 text-sm text-gray-700">
                        <p className="leading-relaxed">
                            APK Crackers Private Limited (“APK Crackers”, “we”, “our”, “us”) operates a digital platform that facilitates enquiries between customers and licensed firecracker sellers. This Privacy Policy explains how we collect, use, share, and protect personal data when you access or use our website and related services (collectively, the “Platform”).
                        </p>
                        <p className="leading-relaxed">
                            This Platform does not sell, book, store, transport, or deliver firecrackers. All pricing, payments, billing, delivery, and compliance obligations are handled offline directly between customers and licensed sellers. By using this Platform, you agree to this Privacy Policy and to the laws of India.
                        </p>
                    </div>

                    <section className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900">Information We Collect</h2>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p className="leading-relaxed">
                                We collect information that you voluntarily provide, such as name, phone number, email address, address details, and enquiry-related information, when you submit an enquiry or contact us.
                            </p>
                            <p className="leading-relaxed">
                                We may also collect limited technical information such as browser type, IP address, and usage data to improve platform performance, security, and user experience. We do not collect or process payment information.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900">How We Use Your Information</h2>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p className="leading-relaxed">
                                Your information is used solely to facilitate communication between you and licensed sellers, respond to enquiries, provide support, improve platform functionality, and comply with legal requirements.
                            </p>
                            <p className="leading-relaxed">
                                We do not use your data to process orders, accept payments, or arrange delivery.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900">Sharing of Information</h2>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p className="leading-relaxed">
                                We may share your enquiry details and contact information with licensed sellers solely for the purpose of responding to your enquiry.
                            </p>
                            <p className="leading-relaxed">
                                We may disclose information if required by law or to protect our legal rights. We do not sell personal data to third parties.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900">Cookies</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            We use cookies and similar technologies to improve platform performance, analyze usage, and enhance user experience. You may control cookies through your browser settings.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900">Data Security</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            We implement reasonable technical and organizational measures to protect your information. However, no internet transmission is completely secure, and you use the Platform at your own risk.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900">Children’s Privacy</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            This Platform is intended for users aged 18 years and above. We do not knowingly collect personal data from minors.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900">Your Rights</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            You may request access, correction, or deletion of your personal data by contacting us. Requests will be handled in accordance with applicable laws.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900">Changes to This Policy</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            We may update this Privacy Policy from time to time. Continued use of the Platform constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900">Contact & Grievance Officer</h2>
                        <div className="text-sm text-gray-700 space-y-2">
                            <p><strong>Mr. Selvadhanush S</strong></p>
                            <p>Designation: Privacy Officer</p>
                            <p>APK Crackers Private Limited</p>
                            <p>Sivakasi, Tamil Nadu, India – 626123</p>
                            <p>Email: <a href="mailto:privacy.grievance@apkcrackers.com" className="text-orange-600 underline">privacy.grievance@apkcrackers.com</a></p>
                        </div>
                    </section>

                    <div className="text-center text-xs text-gray-500 pt-6 border-t border-gray-200">
                        <p className="font-semibold">Last Updated: December 2024</p>
                        <p className="mt-2">© 2024 APK Crackers Private Limited. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy

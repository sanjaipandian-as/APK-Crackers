import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * DEPRECATED: This component has been replaced by EnquiryList.jsx
 * for compliance with Indian firecracker regulations.
 * 
 * This component now redirects to /enquiry-list
 */
const Cart = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to the new enquiry list page after a brief moment
        const timer = setTimeout(() => {
            navigate('/enquiry-list', { replace: true });
        }, 1500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
            <Sidebar showFilter={false} />

            <div className="flex flex-col flex-1 overflow-y-auto">
                <Topbar />

                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="mb-6">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Redirecting to Enquiry List
                        </h2>

                        <p className="text-gray-600 mb-4">
                            We've updated our platform to comply with regulations. Your cart is now called "Enquiry List".
                        </p>

                        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mt-6">
                            <p className="text-sm text-orange-800">
                                <strong>Note:</strong> This platform does not sell firecrackers. We connect you with licensed sellers for quotations.
                            </p>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default Cart;

import { useEffect } from 'react';
import Sidebar from '../components/Customer/Sidebar';
import Topbar from '../components/Customer/Topbar';
import Cart from '../components/Customer/Cart';
import Footer from '../components/Customer/Footer';

const CartPage = () => {
    useEffect(() => {
        document.title = 'My Enquiry List - APK Crackers';
    }, []);
    return (
        <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
            <Sidebar showFilter={false} />
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Topbar />
                <Cart />
                <Footer />
            </div>
        </div>
    );
};

export default CartPage;

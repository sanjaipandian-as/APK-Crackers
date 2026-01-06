import { toast } from 'react-toastify';
import GlassToast from '../components/Common/GlassToast';

const showToast = {
    success: (message) => {
        toast(({ closeToast }) => (
            <GlassToast message={message} type="success" closeToast={closeToast} />
        ), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: false
        });
    },
    error: (message) => {
        toast(({ closeToast }) => (
            <GlassToast message={message} type="error" closeToast={closeToast} />
        ), {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: false
        });
    },
    info: (message) => {
        toast(({ closeToast }) => (
            <GlassToast message={message} type="info" closeToast={closeToast} />
        ), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: false
        });
    },
    warning: (message) => {
        toast(({ closeToast }) => (
            <GlassToast message={message} type="warning" closeToast={closeToast} />
        ), {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: false
        });
    },
    confirm: (message, onConfirm) => {
        toast(({ closeToast }) => (
            <GlassToast
                message={message}
                isConfirmation={true}
                onConfirm={onConfirm}
                closeToast={closeToast}
            />
        ), {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            hideProgressBar: true,
            pauseOnHover: false,
            pauseOnFocusLoss: false
        });
    }
};

export default showToast;

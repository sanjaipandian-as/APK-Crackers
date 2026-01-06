import React from 'react';

const ConfirmToast = ({ message, onConfirm, closeToast }) => {
    return (
        <div className="p-1">
            <p className="text-sm font-bold text-gray-900 mb-3">{message}</p>
            <div className="flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onConfirm();
                        closeToast();
                    }}
                    className="flex-1 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-full transition-colors shadow-sm active:scale-95"
                >
                    Yes, Delete
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        closeToast();
                    }}
                    className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-full transition-colors active:scale-95"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConfirmToast;

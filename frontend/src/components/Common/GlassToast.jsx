import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const GlassToast = ({ message, type = 'info', onConfirm, closeToast, isConfirmation = false }) => {
    const icons = {
        success: <FaCheckCircle className="text-orange-500 w-5 h-5" />,
        error: <FaExclamationCircle className="text-red-500 w-5 h-5" />,
        info: <FaInfoCircle className="text-blue-500 w-5 h-5" />,
        warning: <FaExclamationTriangle className="text-orange-400 w-5 h-5" />
    };

    return (
        <div className="flex flex-col p-4 w-full max-w-xs">
            <div className="flex items-start gap-3">
                {!isConfirmation && (
                    <div className="flex-shrink-0 mt-0.5">
                        {icons[type] || icons.info}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold text-gray-900 leading-tight ${isConfirmation ? 'mb-4' : ''}`}>
                        {message}
                    </p>
                </div>
            </div>

            {isConfirmation && (
                <div className="flex gap-2.5 mt-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onConfirm();
                            closeToast();
                        }}
                        className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            closeToast();
                        }}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default GlassToast;

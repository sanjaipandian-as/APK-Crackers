import React from 'react';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const LegalDisclaimer = ({ variant = 'default', className = '' }) => {
    const variants = {
        default: {
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-300',
            textColor: 'text-amber-900',
            iconColor: 'text-amber-600',
            icon: FaExclamationTriangle
        },
        info: {
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-300',
            textColor: 'text-blue-900',
            iconColor: 'text-blue-600',
            icon: FaInfoCircle
        },
        compact: {
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            textColor: 'text-orange-800',
            iconColor: 'text-orange-600',
            icon: FaExclamationTriangle
        }
    };

    const style = variants[variant] || variants.default;
    const Icon = style.icon;

    if (variant === 'compact') {
        return (
            <div className={`${style.bgColor} ${style.borderColor} border-l-4 p-3 rounded ${className}`}>
                <div className="flex items-start gap-2">
                    <Icon className={`${style.iconColor} w-4 h-4 flex-shrink-0 mt-0.5`} />
                    <p className={`${style.textColor} text-xs leading-relaxed`}>
                        <strong>Note:</strong> This platform does not sell firecrackers. All prices are indicative.
                        Final pricing, payment & delivery are handled offline by licensed sellers.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${style.bgColor} ${style.borderColor} border-2 rounded-xl p-4 sm:p-6 ${className}`}>
            <div className="flex items-start gap-3 sm:gap-4">
                <div className={`${style.bgColor} p-2 sm:p-3 rounded-full flex-shrink-0`}>
                    <Icon className={`${style.iconColor} w-5 h-5 sm:w-6 sm:h-6`} />
                </div>
                <div className="flex-1">
                    <h3 className={`${style.textColor} font-bold text-base sm:text-lg mb-2 sm:mb-3`}>
                        ⚠️ IMPORTANT LEGAL NOTICE
                    </h3>
                    <ul className={`${style.textColor} space-y-1.5 sm:space-y-2 text-xs sm:text-sm leading-relaxed`}>
                        <li className="flex items-start gap-2">
                            <span className="font-bold mt-0.5">•</span>
                            <span>This platform does <strong>NOT sell, book, or deliver</strong> firecrackers</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold mt-0.5">•</span>
                            <span>All prices shown are <strong>INDICATIVE ONLY</strong> and subject to change</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold mt-0.5">•</span>
                            <span>Final pricing, payment, and delivery are handled <strong>OFFLINE</strong> between customers and licensed sellers</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold mt-0.5">•</span>
                            <span>Sellers are <strong>fully responsible</strong> for pricing, billing, delivery, transport, and legal compliance</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold mt-0.5">•</span>
                            <span>This platform only <strong>connects customers with licensed sellers</strong> for enquiries</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LegalDisclaimer;

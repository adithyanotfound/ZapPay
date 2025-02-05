import React from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface FeedbackModalProps {
    message: string | null;
    type: 'success' | 'error' | null;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ message, type, onClose }) => {
    if (!message) {
        return null;
    }

    const Icon = type === 'success' ? CheckIcon : XMarkIcon;
    const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';
    const title = type === 'success' ? 'Success!' : 'Error!'; // Title based on type

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-12 shadow-md flex flex-col items-center w-96"> {/* Increased width */}
                <div className="text-2xl font-bold mb-4">{title}</div> {/* Title added */}
                <Icon className={`h-24 w-24 ${iconColor} mb-4`} />
                <p className="text-lg text-center mb-6">{message}</p> {/* Increased margin bottom */}
                <button onClick={onClose} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"> {/* Increased padding */}
                    Close
                </button>
            </div>
        </div>
    );
};

export default FeedbackModal;
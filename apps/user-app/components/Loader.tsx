import React from 'react';

interface LoadingIndicatorProps {
  loading: boolean;
  text?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loading, text = "Loading..." }) => {
  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black/20 z-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-8 border-b-8 border-green-500 font-bold"> 
          </div>
          <span className="mt-2 text-white font-bold text-3xl">{text}</span> {/* Bold text */}
        </div>
      </div>
    );
  }
  return null;
};

export default LoadingIndicator;
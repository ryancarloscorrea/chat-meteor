import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center">
        <div className={`spinner mx-auto mb-2 ${sizeClasses[size]}`}></div>
        {message && <p className="text-gray-600 text-sm">{message}</p>}
      </div>
    </div>
  );
};

import React from 'react';
import Spinner from '../atoms/Spinner';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <Spinner size={size} />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;

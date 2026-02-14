import React from 'react';

export interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 ${className}`}>
      {icon && <div className="mb-4">{icon}</div>}
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;

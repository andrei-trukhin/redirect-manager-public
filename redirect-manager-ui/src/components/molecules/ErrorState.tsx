import React from 'react';
import Alert from './Alert';
import Button from '../atoms/Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = 'Error',
  message,
  onRetry,
  retryLabel = 'Retry',
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="max-w-md mx-auto">
        <Alert variant="error" title={title}>
          <p>{message}</p>
          {onRetry && (
            <div className="mt-4">
              <Button variant="danger" size="sm" onClick={onRetry}>
                {retryLabel}
              </Button>
            </div>
          )}
        </Alert>
      </div>
    </div>
  );
};

export default ErrorState;

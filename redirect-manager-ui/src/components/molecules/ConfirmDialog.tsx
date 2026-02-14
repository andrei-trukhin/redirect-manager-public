import React from 'react';
import Alert from './Alert';
import Button from '../atoms/Button';

export interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmIcon?: React.ReactNode;
  variant?: 'warning' | 'error' | 'info';
  isLoading?: boolean;
  loadingLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmIcon,
  variant = 'warning',
  isLoading = false,
  loadingLabel = 'Processing...',
  onConfirm,
  onCancel,
  className = '',
}) => {
  return (
    <Alert variant={variant} title={title} className={className}>
      <p className="mb-4">{message}</p>
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {confirmIcon && <span className="mr-2">{confirmIcon}</span>}
          {isLoading ? loadingLabel : confirmLabel}
        </Button>
      </div>
    </Alert>
  );
};

export default ConfirmDialog;

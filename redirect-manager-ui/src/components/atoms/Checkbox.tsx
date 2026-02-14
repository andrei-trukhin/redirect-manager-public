import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  
  const baseClasses = 'h-4 w-4 rounded transition-colors focus:ring-2 focus:ring-offset-2 cursor-pointer';
  const normalClasses = 'accent-blue-600 border-gray-300 focus:ring-blue-500 text-blue-600';
  const errorClasses = 'accent-red-600 border-red-500 focus:ring-red-500 text-red-600';

  const checkboxClasses = `${baseClasses} ${error ? errorClasses : normalClasses} ${className}`;

  return (
    <div className="w-full">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          className={checkboxClasses}
          {...props}
        />
        {label && (
          <label htmlFor={checkboxId} className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Checkbox;

import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  active = false,
  size = 'md',
  variant = 'outline',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: active
      ? 'bg-blue-700 border border-blue-700 text-white'
      : 'bg-blue-600 border border-blue-600 text-white hover:bg-blue-700',
    secondary: active
      ? 'bg-gray-700 border border-gray-700 text-white'
      : 'bg-gray-600 border border-gray-600 text-white hover:bg-gray-700',
    outline: active
      ? 'bg-blue-50 border border-blue-500 text-blue-600'
      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50',
    ghost: active
      ? 'bg-gray-100 border border-transparent text-gray-900'
      : 'bg-transparent border border-transparent text-gray-600 hover:bg-gray-100',
    danger: active
      ? 'bg-red-700 border border-red-700 text-white'
      : 'bg-red-600 border border-red-600 text-white hover:bg-red-700',
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      <div className={`flex items-center justify-center ${iconSizeClasses[size]}`}>{icon}</div>
    </button>
  );
};

export default IconButton;

import { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
  className?: string;
}

export function Button({ children, href, variant = 'primary', className = '' }: Readonly<ButtonProps>) {
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 text-base font-semibold transition-all duration-200';
  
  const variantStyles = {
    primary: 'rounded-lg bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5',
    secondary: 'rounded-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
  };

  return (
    <a
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

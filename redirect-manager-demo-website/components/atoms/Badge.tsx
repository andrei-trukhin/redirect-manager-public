import { ReactNode } from 'react';

export type BadgeVariant = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = '' }: Readonly<BadgeProps>) {
  const variantStyles = {
    GET: 'bg-green-100 text-green-800 border-green-200',
    POST: 'bg-blue-100 text-blue-800 border-blue-200',
    PUT: 'bg-orange-100 text-orange-800 border-orange-200',
    PATCH: 'bg-purple-100 text-purple-800 border-purple-200',
    DELETE: 'bg-red-100 text-red-800 border-red-200'
  };

  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border font-mono';
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <span className={combinedClassName}>
      {children}
    </span>
  );
}

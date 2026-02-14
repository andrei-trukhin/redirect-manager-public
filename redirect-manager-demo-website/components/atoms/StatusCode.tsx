import { ReactNode } from 'react';

export type StatusCodeVariant = 'success' | 'redirect' | 'client-error' | 'server-error';

export interface StatusCodeProps {
  code: number;
  children: ReactNode;
  className?: string;
}

export function StatusCode({ code, children, className = '' }: Readonly<StatusCodeProps>) {
  const getVariant = (code: number): StatusCodeVariant => {
    if (code >= 200 && code < 300) return 'success';
    if (code >= 300 && code < 400) return 'redirect';
    if (code >= 400 && code < 500) return 'client-error';
    return 'server-error';
  };

  const variantStyles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    redirect: 'bg-blue-100 text-blue-800 border-blue-200',
    'client-error': 'bg-orange-100 text-orange-800 border-orange-200',
    'server-error': 'bg-red-100 text-red-800 border-red-200'
  };

  const variant = getVariant(code);
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold border font-mono';
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <span className={combinedClassName}>
      {code} {children}
    </span>
  );
}

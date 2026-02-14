import {ReactNode} from 'react';

export type TextSize = 'sm' | 'base' | 'lg' | 'xl';
export type TextColor = 'primary' | 'secondary';

export interface TextProps {
  children: ReactNode;
  size?: TextSize;
  color?: TextColor;
  className?: string;
}

export function Text({children, size = 'base', color = 'secondary', className = ''}: Readonly<TextProps>) {
  const sizeStyles = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg leading-8',
    xl: 'text-xl leading-8'
  };

  const colorStyles = {
    primary: 'text-gray-900',
    secondary: 'text-gray-600'
  };

  return (
    <p className={`${sizeStyles[size]} ${colorStyles[color]} ${className}`}>
      {children}
    </p>
  );
}

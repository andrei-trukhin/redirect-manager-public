import { ReactNode } from 'react';

export type HeadingLevel = 'h1' | 'h2' | 'h3';
export type HeadingAlign = 'left' | 'center';

export interface HeadingProps {
  level: HeadingLevel;
  children: ReactNode;
  align?: HeadingAlign;
  className?: string;
}

export function Heading({ level, children, align = 'left', className = '' }: HeadingProps) {
  const baseStyles = 'font-bold tracking-tight text-gray-900';
  
  const levelStyles = {
    h1: 'text-4xl sm:text-5xl md:text-6xl',
    h2: 'text-3xl sm:text-4xl',
    h3: 'text-xl sm:text-2xl'
  };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center'
  };

  const Tag = level;
  const combinedClassName = `${baseStyles} ${levelStyles[level]} ${alignStyles[align]} ${className}`;

  return <Tag className={combinedClassName}>{children}</Tag>;
}

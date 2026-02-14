import { ReactNode } from 'react';

export interface MenuItemProps {
  children: ReactNode;
  href: string;
  isActive?: boolean;
  className?: string;
}

export function MenuItem({ children, href, isActive = false, className = '' }: Readonly<MenuItemProps>) {
  const baseStyles = 'block px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 hover:text-indigo-600';
  const activeStyles = isActive ? 'text-indigo-600 bg-indigo-50 border-r-2 border-indigo-600' : 'text-gray-700';

  return (
    <a
      href={href}
      className={`${baseStyles} ${activeStyles} ${className}`}
    >
      {children}
    </a>
  );
}

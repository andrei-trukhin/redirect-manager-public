import { ReactNode } from 'react';

export interface BackButtonProps {
  onClick?: () => void;
  href?: string;
  children?: ReactNode;
  className?: string;
}

export function BackButton({ onClick, href, children = 'Back', className = '' }: Readonly<BackButtonProps>) {
  const baseStyles = 'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200';

  const content = (
    <>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyles} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${className}`}
    >
      {content}
    </button>
  );
}

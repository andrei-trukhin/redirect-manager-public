export interface MenuIconProps {
  isOpen?: boolean;
  className?: string;
}

export function MenuIcon({ isOpen = false, className = '' }: Readonly<MenuIconProps>) {
  return (
    <svg
      className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

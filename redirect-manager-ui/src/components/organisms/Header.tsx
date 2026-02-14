import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoutButton } from '../atoms';

export interface HeaderProps {
  onLogout: () => void;
  isLoggingOut?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onLogout,
  isLoggingOut = false,
  className = '',
}) => {
  const location = useLocation();

  return (
    <header className={`sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200/50 ${className}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Redirect Manager</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/redirects"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname.startsWith('/redirects') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Redirects
            </Link>
            <Link
              to="/tokens"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname.startsWith('/tokens') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              API Tokens
            </Link>
            <Link
              to="/users"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname.startsWith('/users') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Users
            </Link>
            <Link
              to="/account"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname.startsWith('/account') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Account
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LogoutButton onLogout={onLogout} isLoading={isLoggingOut} />
        </div>
      </div>
    </header>
  );
};

export default Header;



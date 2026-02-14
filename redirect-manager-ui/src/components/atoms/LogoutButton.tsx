import React from 'react';
import { LogOut } from 'lucide-react';
import Button from './Button';

export interface LogoutButtonProps {
  onLogout: () => void;
  isLoading?: boolean;
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  onLogout,
  isLoading = false,
  className = '',
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onLogout}
      disabled={isLoading}
      className={`flex items-center gap-2 ${className}`}
      title="Logout"
    >
      <LogOut className="w-4 h-4" />
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  );
};

export default LogoutButton;

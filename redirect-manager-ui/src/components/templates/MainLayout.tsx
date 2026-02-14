import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../organisms';
import { AuthService } from '../../services/auth.service';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await AuthService.logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to logout:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        className="w-full"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;


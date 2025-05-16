import React, { type ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">Company App</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link to="/companies" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  Companies
                </Link>
                {isAdmin && (
                  <>
                    <Link to="/products" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                      Products
                    </Link>
                    <Link to="/inventory" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                      Inventory
                    </Link>
                  </>
                )}
              </div>
            </div>
            {user && (
              <div className="flex items-center">
                <span className="mr-4 text-sm text-gray-700">
                  Hello, {user.email} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

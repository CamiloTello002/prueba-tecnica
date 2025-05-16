import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Welcome to Company App
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          A system for managing companies and products
        </p>
      </div>
      
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Available Modules
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
              <div className="space-y-4">
                {isAdmin && (
                  <div>
                    <Link to="/companies" className="text-blue-600 hover:text-blue-900 mr-4">
                      Manage Companies
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      Create, edit, delete and view companies
                    </p>
                  </div>
                )}
                
                <div>
                  <Link to="/companies" className="text-blue-600 hover:text-blue-900 mr-4">
                    View Companies
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    Browse the list of registered companies
                  </p>
                </div>

                {isAdmin && (
                  <div>
                    <Link to="/products" className="text-blue-600 hover:text-blue-900 mr-4">
                      Manage Products
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      Create, edit, delete and view products
                    </p>
                  </div>
                )}
                
                {isAdmin && (
                  <div>
                    <Link to="/inventory" className="text-blue-600 hover:text-blue-900 mr-4">
                      Inventory
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage inventory and generate reports
                    </p>
                  </div>
                )}
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

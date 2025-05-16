import React from 'react';
import { CompanyList } from '../components/molecules/CompanyList';

export const Companies: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Company Management</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <CompanyList />
      </div>
    </div>
  );
};

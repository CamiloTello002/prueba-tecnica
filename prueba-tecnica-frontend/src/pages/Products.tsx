import React from 'react';
import { ProductList } from '../components/molecules/ProductList';

export const Products: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <ProductList />
      </div>
    </div>
  );
};

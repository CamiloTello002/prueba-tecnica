import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../components/molecules/ProductForm';
import { ProductService } from '../services/productService';
import type { CreateProductDto, UpdateProductDto } from '../types/product';

export const CreateProduct: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateProductDto | UpdateProductDto) => {
    // Since this is the create page, we know all required fields will be present
    // We can safely cast this to CreateProductDto as the form ensures all required fields exist
    try {
      setIsLoading(true);
      await ProductService.create(data as CreateProductDto);
      navigate('/products');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error creating product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <button
          onClick={() => navigate('/products')}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Products
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

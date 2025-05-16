import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductForm } from '../components/molecules/ProductForm';
import { ProductService } from '../services/productService';
import type { Product, UpdateProductDto } from '../types/product';

export const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await ProductService.getById(id);
        setProduct(data);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(`Failed to fetch product with code: ${id}`);
        }
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (data: UpdateProductDto) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await ProductService.update(id, data);
      navigate('/products');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Loading product information...</p>
      </div>
    );
  }

  if (!isLoading && !product && !error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>No product found with the provided code.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <button
          onClick={() => navigate('/products')}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Products
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        {error && !isSubmitting && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}
        {product && (
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            error={isSubmitting ? error : null}
            isEditMode
          />
        )}
      </div>
    </div>
  );
};

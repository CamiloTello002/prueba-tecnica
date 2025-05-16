import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/productService';
import type { Product } from '../../types/product';
import { useAuth } from '../../hooks/useAuth';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState<boolean>(false);
  const [generatingDescription, setGeneratingDescription] = useState<boolean>(false);
  const [enhancedDescription, setEnhancedDescription] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getAll();
        setProducts(data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (code: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await ProductService.delete(code);
      setProducts(products.filter((product) => product.code !== code));
    } catch (error) {
      setError('Failed to delete product. Please try again later.');
      console.error('Error deleting product:', error);
    }
  };

  const handleGenerateDescription = async (product: Product) => {
    setSelectedProduct(product);
    setEnhancedDescription('');
    setGeneratingDescription(true);
    setIsDescriptionModalOpen(true);

    try {
      // Create a modified product object with number prices and without __company__
      const modifiedProduct = {
        ...product,
        priceUSD: Number(product.priceUSD),
        priceEUR: Number(product.priceEUR),
        priceCOP: Number(product.priceCOP)
      };

      // Remove __company__ field if it exists
      if ('__company__' in modifiedProduct) {
        delete modifiedProduct.__company__;
      }

      const { description } = await ProductService.generateAIDescription(modifiedProduct);
      setEnhancedDescription(description);
    } catch (error) {
      setError('Failed to generate AI description. Please try again later.');
      console.error('Error generating AI description:', error);
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleApplyDescription = async () => {
    if (!selectedProduct || !enhancedDescription) return;

    try {
      const updatedProduct = {
        ...selectedProduct,
        features: enhancedDescription
      };

      await ProductService.update(selectedProduct.code, updatedProduct);

      // Update the product in the local state
      setProducts(products.map(product =>
        product.code === selectedProduct.code
          ? { ...product, features: enhancedDescription }
          : product
      ));

      setIsDescriptionModalOpen(false);
    } catch (error) {
      setError('Failed to update product description. Please try again later.');
      console.error('Error updating product description:', error);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading products...</div>;

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        {isAdmin && (
          <button
            onClick={() => navigate('/products/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Product
          </button>
        )}
      </div>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Code</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Features</th>
              <th className="py-3 px-6 text-right">USD</th>
              <th className="py-3 px-6 text-right">EUR</th>
              <th className="py-3 px-6 text-right">COP</th>
              <th className="py-3 px-6 text-left">Company</th>
              {isAdmin && <th className="py-3 px-6 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {products.map((product) => (
              <tr key={product.code} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left">{product.code}</td>
                <td className="py-3 px-6 text-left">{product.name}</td>
                <td className="py-3 px-6 text-left">{product.features}</td>
                <td className="py-3 px-6 text-right">${typeof product.priceUSD === 'number' ? product.priceUSD.toFixed(2) : Number(product.priceUSD).toFixed(2)}</td>
                <td className="py-3 px-6 text-right">€{typeof product.priceEUR === 'number' ? product.priceEUR.toFixed(2) : Number(product.priceEUR).toFixed(2)}</td>
                <td className="py-3 px-6 text-right">COP {typeof product.priceCOP === 'number' ? product.priceCOP.toLocaleString() : Number(product.priceCOP).toLocaleString()}</td>
                <td className="py-3 px-6 text-left">
                  {product.__company__?.nit}
                </td>
                {isAdmin && (
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => navigate(`/products/edit/${product.code}`)}
                        className="mr-2 transform hover:text-blue-500 hover:scale-110"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.code)}
                        className="mr-2 transform hover:text-red-500 hover:scale-110"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleGenerateDescription(product)}
                        className="transform hover:text-green-500 hover:scale-110"
                      >
                        AI Description
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* AI Description Modal */}
      <Dialog
        open={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-xl font-semibold mb-4">
              {selectedProduct?.name} - AI Enhanced Description
            </Dialog.Title>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Original Description:</h3>
              <p className="bg-gray-100 p-3 rounded-md">{selectedProduct?.features || 'No description available'}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">AI-Enhanced Description:</h3>
              {generatingDescription ? (
                <div className="flex items-center justify-center p-6 bg-gray-100 rounded-md">
                  <p>Generating improved description...</p>
                </div>
              ) : (
                <p className="bg-blue-50 p-3 rounded-md">{enhancedDescription || 'Description will appear here'}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={() => setIsDescriptionModalOpen(false)}
              >
                Cancel
              </button>
              {/*
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                onClick={handleApplyDescription}
                disabled={!enhancedDescription || generatingDescription}
              >
                Apply Description
              </button>
              */}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

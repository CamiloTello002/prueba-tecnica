import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InventoryService } from '../services/inventoryService';
import { ProductService } from '../services/productService';
import { CompanyService } from '../services/companyService';
import type { Product } from '../types/product';
import type { Company } from '../types/company';
import type { CreateInventoryDto } from '../types/inventory';

export const CreateInventory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateInventoryDto>({
    productCode: '',
    companyNit: '',
    quantity: 0,
    notes: '',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, companiesData] = await Promise.all([
          ProductService.getAll(),
          CompanyService.getAll(),
        ]);
        setProducts(productsData);
        setCompanies(companiesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'quantity') {
      setFormData({
        ...formData,
        [name]: Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productCode) {
      setError('Please select a product');
      return;
    }
    
    if (!formData.companyNit) {
      setError('Please select a company');
      return;
    }
    
    if (formData.quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }
    
    try {
      setSubmitting(true);
      await InventoryService.create(formData);
      navigate('/inventory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create inventory item');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading data...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Inventory Item</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Item Details</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="productCode" className="block text-sm font-medium text-gray-700 mb-2">Product</label>
              <select
                id="productCode"
                name="productCode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.productCode}
                onChange={handleChange}
                required
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.code} value={product.code}>
                    {product.name} ({product.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="companyNit" className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <select
                id="companyNit"
                name="companyNit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.companyNit}
                onChange={handleChange}
                required
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.nit} value={company.nit}>
                    {company.name} ({company.nit})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Inventory Item'}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={() => navigate('/inventory')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

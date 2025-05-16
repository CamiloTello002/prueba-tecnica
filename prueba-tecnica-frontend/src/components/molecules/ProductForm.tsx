import React, { useState, useEffect } from 'react';
import { CompanyService } from '../../services/companyService';
import type { Product, CreateProductDto, UpdateProductDto } from '../../types/product';
import type { Company } from '../../types/company';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: CreateProductDto | UpdateProductDto) => void;
  isLoading: boolean;
  error: string | null;
  isEditMode?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  error,
  isEditMode = false,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState<CreateProductDto>({
    code: '',
    name: '',
    features: '',
    priceUSD: 0,
    priceEUR: 0,
    priceCOP: 0,
    companyId: '',
  });
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);

  // Load initial data if provided (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        name: initialData.name,
        features: initialData.features,
        priceUSD: initialData.priceUSD,
        priceEUR: initialData.priceEUR,
        priceCOP: initialData.priceCOP,
        companyId: initialData.__company__?.nit || '',
      });
    }
  }, [initialData]);

  // Load companies for the dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const data = await CompanyService.getAll();
        setCompanies(data);
        setCompanyError(null);
      } catch (error) {
        setCompanyError('Failed to load companies. Please refresh the page.');
        console.error('Error fetching companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle numeric values for prices
    if (name === 'priceUSD' || name === 'priceEUR' || name === 'priceCOP') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Product Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          disabled={isEditMode}
          className={`mt-1 block w-full px-3 py-2 border ${
            isEditMode ? 'bg-gray-100' : 'bg-white'
          } border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          required
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="features" className="block text-sm font-medium text-gray-700">
          Features <span className="text-red-500">*</span>
        </label>
        <textarea
          id="features"
          name="features"
          value={formData.features}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="priceUSD" className="block text-sm font-medium text-gray-700">
            Price (USD) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="priceUSD"
              name="priceUSD"
              min="0"
              step="0.01"
              value={formData.priceUSD}
              onChange={handleChange}
              className="pl-7 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="priceEUR" className="block text-sm font-medium text-gray-700">
            Price (EUR) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">€</span>
            </div>
            <input
              type="number"
              id="priceEUR"
              name="priceEUR"
              min="0"
              step="0.01"
              value={formData.priceEUR}
              onChange={handleChange}
              className="pl-7 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="priceCOP" className="block text-sm font-medium text-gray-700">
            Price (COP) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">COP</span>
            </div>
            <input
              type="number"
              id="priceCOP"
              name="priceCOP"
              min="0"
              step="1"
              value={formData.priceCOP}
              onChange={handleChange}
              className="pl-12 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">
          Company <span className="text-red-500">*</span>
        </label>
        <select
          id="companyId"
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
          disabled={loadingCompanies}
        >
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company.nit} value={company.nit}>
              {company.name} ({company.nit})
            </option>
          ))}
        </select>
        {loadingCompanies && <p className="text-sm text-gray-500 mt-1">Loading companies...</p>}
        {companyError && <p className="text-sm text-red-500 mt-1">{companyError}</p>}
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || loadingCompanies}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
            isLoading || loadingCompanies ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

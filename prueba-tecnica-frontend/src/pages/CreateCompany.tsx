import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyForm } from '../components/molecules/CompanyForm';
import { CompanyService } from '../services/companyService';
import type { CompanyFormData } from '../types/company';

export const CreateCompany: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: CompanyFormData) => {
    try {
      setIsLoading(true);
      await CompanyService.create(data);
      navigate('/companies');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while creating the company');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Company</h1>
        <button
          onClick={() => navigate('/companies')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Companies
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <CompanyForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CompanyForm } from '../components/molecules/CompanyForm';
import { CompanyService } from '../services/companyService';
import type { Company, CompanyFormData } from '../types/company';

export const EditCompany: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) {
        navigate('/companies');
        return;
      }

      try {
        setIsLoading(true);
        const data = await CompanyService.getById(id);
        setCompany(data);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(`Failed to fetch company with NIT: ${id}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [id, navigate]);

  const handleSubmit = async (data: CompanyFormData) => {
    if (!id) return;

    try {
      setIsSaving(true);
      await CompanyService.update(id, data);
      navigate('/companies');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while updating the company');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center">
        Loading company data...
      </div>
    );
  }

  if (!company && !isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Company not found or you don't have permission to view it.
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/companies')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Company</h1>
        <button
          onClick={() => navigate('/companies')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Companies
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        {company && (
          <CompanyForm
            initialData={company}
            onSubmit={handleSubmit}
            isLoading={isSaving}
            error={error}
            isEditMode={true}
          />
        )}
      </div>
    </div>
  );
};

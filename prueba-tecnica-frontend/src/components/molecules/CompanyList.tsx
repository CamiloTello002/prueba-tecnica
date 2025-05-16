import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyService } from '../../services/companyService';
import type { Company } from '../../types/company';
import { useAuth } from '../../hooks/useAuth';

export const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await CompanyService.getAll();
        setCompanies(data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch companies. Please try again later.');
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleDelete = async (nit: string) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    
    try {
      await CompanyService.delete(nit);
      setCompanies(companies.filter((company) => company.nit !== nit));
    } catch (error) {
      setError('Failed to delete company. Please try again later.');
      console.error('Error deleting company:', error);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading companies...</div>;

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Companies</h2>
        {isAdmin && (
          <button
            onClick={() => navigate('/companies/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Company
          </button>
        )}
      </div>
      {companies.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">NIT</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Address</th>
              <th className="py-3 px-6 text-left">Phone</th>
              {isAdmin && <th className="py-3 px-6 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {companies.map((company) => (
              <tr key={company.nit} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left">{company.nit}</td>
                <td className="py-3 px-6 text-left">{company.name}</td>
                <td className="py-3 px-6 text-left">{company.address}</td>
                <td className="py-3 px-6 text-left">{company.phone}</td>
                {isAdmin && (
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => navigate(`/companies/edit/${company.nit}`)}
                        className="mr-2 transform hover:text-blue-500 hover:scale-110"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(company.nit)}
                        className="transform hover:text-red-500 hover:scale-110"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

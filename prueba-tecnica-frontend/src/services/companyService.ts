import { COMPANY_ENDPOINTS } from '../constants/api';
import { AuthService } from './authService';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/company';

export class CompanyService {
  static async getAll(): Promise<Company[]> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(COMPANY_ENDPOINTS.BASE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch companies');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to fetch companies');
    }
  }

  static async getById(id: string): Promise<Company> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(COMPANY_ENDPOINTS.DETAIL(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch company with NIT: ${id}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to fetch company with NIT: ${id}`);
    }
  }

  static async create(company: CreateCompanyDto): Promise<Company> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(COMPANY_ENDPOINTS.BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(company),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create company');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to create company');
    }
  }

  static async update(id: string, companyData: UpdateCompanyDto): Promise<Company> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(COMPANY_ENDPOINTS.DETAIL(id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update company with NIT: ${id}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to update company with NIT: ${id}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(COMPANY_ENDPOINTS.DETAIL(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete company with NIT: ${id}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to delete company with NIT: ${id}`);
    }
  }
}

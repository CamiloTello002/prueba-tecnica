// Company type definitions
export interface Company {
  nit: string;
  name: string;
  address: string;
  phone: string;
}

export type CreateCompanyDto = Company;

export type UpdateCompanyDto = Partial<Company>;

export interface CompanyFormData {
  nit: string;
  name: string;
  address: string;
  phone: string;
}

export interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  isLoading: boolean;
  error: string | null;
}

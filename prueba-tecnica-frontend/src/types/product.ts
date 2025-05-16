export interface Product {
  code: string;
  name: string;
  features: string;
  priceUSD: number;
  priceEUR: number;
  priceCOP: number;
  __company__?: {
    nit: string;
  };
  __has_company__?: boolean;
}

export interface CreateProductDto {
  code: string;
  name: string;
  features: string;
  priceUSD: number;
  priceEUR: number;
  priceCOP: number;
  companyId: string;
}

export interface UpdateProductDto {
  code?: string;
  name?: string;
  features?: string;
  priceUSD?: number;
  priceEUR?: number;
  priceCOP?: number;
  companyId?: string;
}

import type { Product } from './product';
import type { Company } from './company';

export interface Inventory {
  id: string;
  quantity: number;
  createdAt: string;
  notes: string | null;
  __product__?: Product;
  __company__?: Company;
}

export interface CreateInventoryDto {
  productCode: string;
  companyNit: string;
  quantity: number;
  notes?: string;
}

export interface UpdateInventoryDto {
  quantity?: number;
  notes?: string;
}

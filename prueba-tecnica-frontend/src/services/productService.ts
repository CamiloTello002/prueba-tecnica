import { PRODUCT_ENDPOINTS } from '../constants/api';
import { AuthService } from './authService';
import type { Product, CreateProductDto, UpdateProductDto } from '../types/product';

export class ProductService {
  static async generateAIDescription(product: Product): Promise<{ description: string }> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(PRODUCT_ENDPOINTS.AI_DESCRIPTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate AI description');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to generate AI description');
    }
  }

  static async getAll(): Promise<Product[]> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(PRODUCT_ENDPOINTS.BASE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to fetch products');
    }
  }

  static async getById(id: string): Promise<Product> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(PRODUCT_ENDPOINTS.DETAIL(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch product with code: ${id}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to fetch product with code: ${id}`);
    }
  }

  static async create(product: CreateProductDto): Promise<Product> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(PRODUCT_ENDPOINTS.BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to create product');
    }
  }

  static async update(id: string, productData: UpdateProductDto): Promise<Product> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(PRODUCT_ENDPOINTS.DETAIL(id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update product with code: ${id}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to update product with code: ${id}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(PRODUCT_ENDPOINTS.DETAIL(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete product with code: ${id}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to delete product with code: ${id}`);
    }
  }
}

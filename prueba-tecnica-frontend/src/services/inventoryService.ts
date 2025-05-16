import { API_BASE_URL, INVENTORY_ENDPOINTS } from '../constants/api';
import { AuthService } from './authService';
import type { Inventory, CreateInventoryDto, UpdateInventoryDto } from '../types/inventory';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';

export class InventoryService {
  static async getAll(): Promise<Inventory[]> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(INVENTORY_ENDPOINTS.BASE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch inventory items');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to fetch inventory items');
    }
  }

  static async getById(id: string): Promise<Inventory> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(INVENTORY_ENDPOINTS.DETAIL(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch inventory item with id: ${id}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to fetch inventory item with id: ${id}`);
    }
  }

  static async create(inventoryItem: CreateInventoryDto): Promise<Inventory> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(INVENTORY_ENDPOINTS.BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inventoryItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create inventory item');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to create inventory item');
    }
  }

  static async update(id: string, inventoryData: UpdateInventoryDto): Promise<Inventory> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(INVENTORY_ENDPOINTS.DETAIL(id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inventoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update inventory item with id: ${id}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to update inventory item with id: ${id}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(INVENTORY_ENDPOINTS.DETAIL(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete inventory item with id: ${id}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(`Failed to delete inventory item with id: ${id}`);
    }
  }

  static async generatePDF(): Promise<Blob> {
    try {
      // Get inventory data
      const inventoryData = await this.getAll();

      // Create a new PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text('Inventory Report', 14, 20);

      // Add generation date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);

      // Prepare table data
      const tableData = inventoryData.map(item => [
        item.__product__?.name || 'N/A',
        item.__company__?.name || 'N/A',
        item.quantity.toString(),
        new Date(item.createdAt).toLocaleDateString(),
        item.notes || 'N/A'
      ]);

      // Create table
      autoTable(doc, {
        head: [['Product', 'Company', 'Quantity', 'Created At', 'Notes']],
        body: tableData,
        startY: 40,
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { top: 20 }
      });

      // Convert the PDF to blob
      const pdfOutput = doc.output('blob');
      return pdfOutput;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to generate PDF');
    }
  }

  static async sendPDFByEmail(email: string): Promise<void> {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/inventory/report/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send PDF by email');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to send PDF by email');
    }
  }
}

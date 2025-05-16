import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Inventory } from '../entities/inventory.entity';

@Injectable()
export class PdfService {
  async generateInventoryPdf(inventoryItems: Inventory[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      // Collect PDF data chunks
      doc.on('data', (chunk) => chunks.push(chunk));

      // Resolve promise with complete PDF data
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add document title
      doc.fontSize(20).text('Inventory Report', { align: 'center' });
      doc.moveDown();

      // Add generation date
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown();

      // Format table header
      this.addTableHeader(doc);

      // Format table data
      inventoryItems.forEach((item, index) => {
        const y = 150 + (index + 1) * 30;

        // Alternate row colors for better readability
        if (index % 2 === 0) {
          doc.rect(50, y - 10, 500, 30).fill('#f2f2f2').stroke('#d3d3d3');
        }

        doc.fillColor('black');

        // Instead of item.product.code
        doc.text(item["__product__"].code, 60, y);

        // Instead of item.product.name
        doc.text(item["__product__"].name, 150, y, { width: 100, ellipsis: true });

        // Instead of item.company.name
        doc.text(item["__company__"].name, 260, y, { width: 100, ellipsis: true });

        // Quantity
        doc.text(item.quantity.toString(), 370, y);

        // Date
        doc.text(item.createdAt.toLocaleDateString(), 440, y);
      });

      // Add company summary if there are items
      if (inventoryItems.length > 0) {
        doc.addPage();
        doc.fontSize(16).text('Company Summary', { align: 'center' });
        doc.moveDown();

        // Group by company
        const companyMap = new Map();
        inventoryItems.forEach(item => {
          const companyNit = item.company.nit;
          if (!companyMap.has(companyNit)) {
            companyMap.set(companyNit, {
              name: item.company.name,
              totalItems: 0,
              products: new Set()
            });
          }

          const company = companyMap.get(companyNit);
          company.totalItems += item.quantity;
          company.products.add(item.product.code);
        });

        // Add company summary table
        doc.fontSize(12).text('Company', 60, 150);
        doc.text('Total Items', 240, 150);
        doc.text('Unique Products', 380, 150);
        doc.moveDown();

        let index = 0;
        companyMap.forEach((data, nit) => {
          const y = 180 + index * 30;

          if (index % 2 === 0) {
            doc.rect(50, y - 10, 500, 30).fill('#f2f2f2').stroke('#d3d3d3');
          }

          doc.fillColor('black');
          doc.text(data.name, 60, y, { width: 150, ellipsis: true });
          doc.text(data.totalItems.toString(), 240, y);
          doc.text(data.products.size.toString(), 380, y);

          index++;
        });
      }

      // Finalize the PDF
      doc.end();
    });
  }

  private addTableHeader(doc: PDFKit.PDFDocument): void {
    // Add table header with styling
    doc.fontSize(12).fillColor('#444444');

    doc.rect(50, 120, 500, 30).fill('#dddddd').stroke('#bbbbbb');
    doc.fillColor('#000000');

    // Column headers
    doc.text('Code', 60, 130);
    doc.text('Product', 150, 130);
    doc.text('Company', 260, 130);
    doc.text('Quantity', 370, 130);
    doc.text('Date', 440, 130);

    // Draw table border
    doc.rect(50, 120, 500, 30).stroke();
  }
}

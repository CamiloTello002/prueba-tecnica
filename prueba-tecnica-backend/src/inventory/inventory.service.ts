import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { SendInventoryEmailDto } from './dto/send-inventory-email.dto';
import { Inventory } from './entities/inventory.entity';
import { getRepository } from 'typeorm';
import { PdfService } from './pdf/pdf.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly pdfService: PdfService,
    private readonly mailService: MailService,
  ) { }

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    try {
      // First, verify that the product exists
      const productRepository = this.inventoryRepository.manager.getRepository('Product');
      const product = await productRepository.findOne({
        where: { code: createInventoryDto.productCode }
      });

      if (!product) {
        throw new NotFoundException(`Product with code ${createInventoryDto.productCode} not found`);
      }

      // Then, verify that the company exists
      const companyRepository = this.inventoryRepository.manager.getRepository('Company');
      const company = await companyRepository.findOne({
        where: { nit: createInventoryDto.companyNit }
      });

      if (!company) {
        throw new NotFoundException(`Company with NIT ${createInventoryDto.companyNit} not found`);
      }

      // Create a new inventory instance
      const inventory = this.inventoryRepository.create({
        product,
        company,
        quantity: createInventoryDto.quantity,
        notes: createInventoryDto.notes || null
      });

      return await this.inventoryRepository.save(inventory);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error creating inventory: ${error.message}`);
    }
  }

  async findAll(): Promise<Inventory[]> {
    return await this.inventoryRepository.find({
      relations: ['product', 'company']
    });
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['product', 'company']
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return inventory;
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto): Promise<Inventory> {
    const inventory = await this.findOne(id);

    if (updateInventoryDto.productCode) {
      const productRepository = this.inventoryRepository.manager.getRepository('Product');
      const product = await productRepository.findOne({
        where: { code: updateInventoryDto.productCode }
      });

      if (!product) {
        throw new NotFoundException(`Product with code ${updateInventoryDto.productCode} not found`);
      }

      inventory.product = product;
    }

    if (updateInventoryDto.companyNit) {
      const companyRepository = this.inventoryRepository.manager.getRepository('Company');
      const company = await companyRepository.findOne({
        where: { nit: updateInventoryDto.companyNit }
      });

      if (!company) {
        throw new NotFoundException(`Company with NIT ${updateInventoryDto.companyNit} not found`);
      }

      inventory.company = company;
    }

    if (updateInventoryDto.quantity !== undefined) {
      inventory.quantity = updateInventoryDto.quantity;
    }

    if (updateInventoryDto.notes !== undefined) {
      inventory.notes = updateInventoryDto.notes;
    }

    return await this.inventoryRepository.save(inventory);
  }

  async remove(id: string): Promise<{ message: string }> {
    const inventory = await this.findOne(id);
    await this.inventoryRepository.remove(inventory);
    return { message: `Inventory with ID ${id} successfully removed` };
  }

  async findByCompany(companyNit: string): Promise<Inventory[]> {
    // First verify that the company exists
    const companyRepository = this.inventoryRepository.manager.getRepository('Company');
    const company = await companyRepository.findOne({
      where: { nit: companyNit }
    });

    if (!company) {
      throw new NotFoundException(`Company with NIT ${companyNit} not found`);
    }

    return await this.inventoryRepository.find({
      where: {
        company: { nit: companyNit }
      },
      relations: ['product', 'company']
    });
  }

  async generateInventoryPdf(): Promise<Buffer> {
    // Get inventory items with eager loaded relationships
    const inventoryItems = await this.findAll();

    // Manually load lazy relationships to ensure they're available for PDF generation
    for (const item of inventoryItems) {
      if (item.product instanceof Promise) {
        item.product = await item.product;
      }
      if (item.company instanceof Promise) {
        item.company = await item.company;
      }
    }

    return this.pdfService.generateInventoryPdf(inventoryItems);
  }

  async sendInventoryEmail(sendInventoryEmailDto: SendInventoryEmailDto): Promise<any> {
    try {
      // Get inventory items with eager loaded relationships
      const inventoryItems = await this.findAll();

      // Manually load lazy relationships to ensure they're available for PDF generation
      for (const item of inventoryItems) {
        if (item.product instanceof Promise) {
          item.product = await item.product;
        }
        if (item.company instanceof Promise) {
          item.company = await item.company;
        }
      }

      // Generate inventory PDF with fully loaded relationships
      const pdfBuffer = await this.pdfService.generateInventoryPdf(inventoryItems);

      // Set default values if not provided
      const subject = sendInventoryEmailDto.subject || 'Inventory Report';
      const body = sendInventoryEmailDto.body || 'Please find attached the inventory report.';

      // Send email with PDF attachment
      const result = await this.mailService.sendEmail(
        sendInventoryEmailDto.email,
        subject,
        body,
        [
          {
            filename: `inventory-report-${new Date().toISOString().slice(0, 10)}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      );

      return {
        message: 'Inventory report sent successfully',
        ...result,
      };
    } catch (error) {
      throw new BadRequestException(`Error sending inventory report: ${error.message}`);
    }
  }
}

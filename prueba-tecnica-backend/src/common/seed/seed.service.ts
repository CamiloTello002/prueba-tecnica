import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Product } from '../../products/entities/product.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { User, UserRole } from '../../user/entities/user.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async clearDatabase(): Promise<void> {
    this.logger.log('Clearing database tables (except User)...');

    // Using queryRunner for the transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clear tables in order to avoid foreign key constraint issues
      await queryRunner.query('DELETE FROM inventory');
      await queryRunner.query('DELETE FROM product');
      await queryRunner.query('DELETE FROM company');
      await queryRunner.query('DELETE FROM public.user');

      await queryRunner.commitTransaction();
      this.logger.log('Database cleared successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error clearing database: ${error.message}`);
      throw new Error(`Failed to clear database: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async seedCompanies(): Promise<void> {
    this.logger.log('Seeding companies...');
    const companies = [
      {
        nit: '900123456-7',
        name: 'Tech Solutions Inc.',
        address: '123 Innovation St, Silicon Valley',
        phone: '+1 555-123-4567',
      },
      {
        nit: '900123433-7',
        name: 'Global Software Ltd.',
        address: '456 Code Avenue, Tech Park',
        phone: '+1 555-987-6543',
      },
      {
        nit: '900121103-7',
        name: 'Digital Enterprise S.A.',
        address: 'Calle 85 #15-23, Bogotá, Colombia',
        phone: '+57 301-345-6789',
      },
    ];

    try {
      const createdCompanies = this.companyRepository.create(companies);
      await this.companyRepository.save(createdCompanies);
      this.logger.log(`Seeded ${companies.length} companies`);
    } catch (error) {
      this.logger.error(`Error seeding companies: ${error.message}`);
      throw new Error(`Failed to seed companies: ${error.message}`);
    }
  }

  async seedProducts(): Promise<void> {
    this.logger.log('Seeding products...');
    const companies = await this.companyRepository.find();

    if (companies.length === 0) {
      throw new Error('No companies found, please seed companies first');
    }

    const products = [
      {
        code: 'P001',
        name: 'Laptop Pro X1',
        features: 'Intel Core i7, 16GB RAM, 512GB SSD',
        priceUSD: 1299.99,
        priceEUR: 1099.99,
        priceCOP: 4900000,
        company: companies[0],
      },
      {
        code: 'P002',
        name: 'Smartphone Ultimate',
        features: '6.5" OLED, 128GB Storage, Dual Camera',
        priceUSD: 899.99,
        priceEUR: 799.99,
        priceCOP: 3400000,
        company: companies[0],
      },
      {
        code: 'P003',
        name: 'Wireless Headphones',
        features: 'Noise Cancelling, 30hr Battery Life',
        priceUSD: 249.99,
        priceEUR: 229.99,
        priceCOP: 950000,
        company: companies[1],
      },
      {
        code: 'P004',
        name: 'Smart Watch Pro',
        features: 'Heart Rate Monitor, GPS, Water Resistant',
        priceUSD: 349.99,
        priceEUR: 319.99,
        priceCOP: 1320000,
        company: companies[1],
      },
      {
        code: 'P005',
        name: 'Cloud Services Premium',
        features: '1TB Storage, API Access, 24/7 Support',
        priceUSD: 49.99,
        priceEUR: 44.99,
        priceCOP: 189000,
        company: companies[2],
      },
    ];

    try {
      const createdProducts = this.productRepository.create(products);
      await this.productRepository.save(createdProducts);
      this.logger.log(`Seeded ${products.length} products`);
    } catch (error) {
      this.logger.error(`Error seeding products: ${error.message}`);
      throw new Error(`Failed to seed products: ${error.message}`);
    }
  }

  async seedInventory(): Promise<void> {
    this.logger.log('Seeding inventory...');
    const products = await this.productRepository.find();
    const companies = await this.companyRepository.find();

    if (products.length === 0) {
      throw new Error('No products found, please seed products first');
    }

    const inventoryItems = [
      {
        product: products[0],
        company: companies[0],
        quantity: 50,
        notes: 'Initial stock'
      },
      {
        product: products[1],
        company: companies[0],
        quantity: 100,
        notes: 'From latest shipment'
      },
      {
        product: products[2],
        company: companies[1],
        quantity: 75,
        notes: 'Limited edition models'
      },
      {
        product: products[3],
        company: companies[1],
        quantity: 30,
        notes: 'New release'
      },
      {
        product: products[4],
        company: companies[2],
        quantity: 200,
        notes: 'Subscription licenses'
      },
      // Cross-company inventory
      {
        product: products[0],
        company: companies[1],
        quantity: 20,
        notes: 'Partner distribution'
      },
      {
        product: products[3],
        company: companies[2],
        quantity: 15,
        notes: 'Test units'
      }
    ];

    try {
      const createdInventory = this.inventoryRepository.create(inventoryItems);
      await this.inventoryRepository.save(createdInventory);
      this.logger.log(`Seeded ${inventoryItems.length} inventory items`);
    } catch (error) {
      this.logger.error(`Error seeding inventory: ${error.message}`);
      throw new Error(`Failed to seed inventory: ${error.message}`);
    }
  }

  async checkAndCreateAdminUser(): Promise<void> {
    this.logger.log('Checking for admin user...');
    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@example.com' }
    });

    if (!adminExists) {
      this.logger.log('Creating default admin user...');
      // Admin user will be created with password hash via entity lifecycle hook
      const admin = this.userRepository.create({
        email: 'admin@example.com',
        password: 'adminuser', // This will be hashed by the entity's BeforeInsert hook
        role: UserRole.ADMIN,
        isActive: true
      });

      const external = this.userRepository.create({
        email: 'external@example.com',
        password: 'externaluser',
        role: UserRole.EXTERNAL,
        isActive: true
      })

      await this.userRepository.save([admin, external]);
      this.logger.log('Default admin user created');
    } else {
      this.logger.log('Admin user already exists, skipping creation');
    }
  }

  async seedDatabase(): Promise<void> {
    try {
      await this.clearDatabase();
      await this.checkAndCreateAdminUser();
      await this.seedCompanies();
      await this.seedProducts();
      await this.seedInventory();

      this.logger.log('Database seeding completed successfully!');
    } catch (error) {
      this.logger.error(`Database seeding failed: ${error.message}`);
      throw error;
    }
  }
}

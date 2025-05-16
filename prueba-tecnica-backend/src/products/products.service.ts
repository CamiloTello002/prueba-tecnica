import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // Check if product with this code already exists
      const existingProduct = await this.productRepository.findOne({
        where: { code: createProductDto.code }
      });

      if (existingProduct) {
        throw new BadRequestException(`Product with code ${createProductDto.code} already exists`);
      }
      
      // Extract companyId from DTO
      const { companyId, ...productData } = createProductDto;
      
      // Create new product instance with all properties except companyId
      const product = this.productRepository.create(productData);
      
      // Set company reference explicitly
      product.company = { nit: companyId } as any;

      // Save to the database
      return await this.productRepository.save(product);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error creating product: ' + error.message);
    }
  }

  async findAll() {
    try {
      // Cargamos la relación de forma explícita (eager loading)
      return await this.productRepository.find({
        relations: { company: true }
      });
    } catch (error) {
      throw new BadRequestException('Error fetching products: ' + error.message);
    }
  }

  async findOne(code: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { code },
        relations: { company: true }
      });

      if (!product) {
        throw new NotFoundException(`Product with code ${code} not found`);
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching product: ' + error.message);
    }
  }

  async update(code: string, updateProductDto: UpdateProductDto) {
    try {
      // Find the product first
      const product = await this.findOne(code);

      // Extract companyId if it exists
      const { companyId, ...productUpdateData } = updateProductDto;
      
      // Update product with remaining DTO values
      const updatedProduct = this.productRepository.merge(product, productUpdateData);
      
      // Set company reference if provided
      if (companyId) {
        updatedProduct.company = { nit: companyId } as any;
      }

      // Save changes
      return await this.productRepository.save(updatedProduct);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error updating product: ' + error.message);
    }
  }

  async remove(code: string) {
    try {
      // Find the product first
      const product = await this.findOne(code);

      // Delete it
      await this.productRepository.remove(product);
      return { message: `Product with code ${code} has been deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error deleting product: ' + error.message);
    }
  }
}

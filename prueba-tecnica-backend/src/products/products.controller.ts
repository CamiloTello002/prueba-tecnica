import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.productsService.findOne(code);
  }

  @Patch(':code')
  update(@Param('code') code: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(code, updateProductDto);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.OK)
  remove(@Param('code') code: string) {
    return this.productsService.remove(code);
  }
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsString, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  features?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  priceUSD?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  priceEUR?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  priceCOP?: number;

  @IsOptional()
  @IsString()
  companyId?: string;
}

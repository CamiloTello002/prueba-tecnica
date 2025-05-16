import { IsNotEmpty, IsString, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  features: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  priceUSD: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  priceEUR: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  priceCOP: number;

  @IsNotEmpty()
  @IsString()
  companyId: string;
}

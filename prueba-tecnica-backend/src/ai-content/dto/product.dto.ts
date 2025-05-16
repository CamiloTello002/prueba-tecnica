import { IsString, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CompanyDto {
  @IsString()
  nit: string;
}

export class ProductDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  features: string;

  @IsNumber()
  priceUSD: number;

  @IsNumber()
  priceEUR: number;

  @IsNumber()
  priceCOP: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyDto)
  __company__?: {
    nit: string;
  };

  @IsOptional()
  __has_company__?: boolean;
}

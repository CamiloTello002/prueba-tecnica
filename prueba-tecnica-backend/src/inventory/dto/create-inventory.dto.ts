import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsString()
  productCode: string;

  @IsNotEmpty()
  @IsString()
  companyNit: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

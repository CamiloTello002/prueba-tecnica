import { IsEmail, IsString, IsOptional } from 'class-validator';

export class SendInventoryEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  body?: string;
}

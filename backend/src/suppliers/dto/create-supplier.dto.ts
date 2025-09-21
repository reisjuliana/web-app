import { IsString, IsOptional, IsEmail, Length } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsOptional()
  @Length(14, 14)
  cnpj?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
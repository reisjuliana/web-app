import { IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateProductEntryDto {
  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  supplierId: number;

  @IsDateString()
  entryDate: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitValue: number;

  @IsNumber()
  totalValue: number;

  @IsNotEmpty()
  invoiceNumber: string;

  @IsOptional()
  batch?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  observations?: string;
}

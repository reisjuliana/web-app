import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductEntryDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  supplierId: string;

  @IsString()
  @IsNotEmpty()
  supplierName: string;

  @IsNotEmpty()
  entryDate: Date;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitValue: number;

  @IsNumber()
  totalValue: number;

  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsOptional()
  batch?: string;

  @IsOptional()
  expirationDate?: Date;

  @IsOptional()
  category?: string;

  @IsOptional()
  observations?: string;
}

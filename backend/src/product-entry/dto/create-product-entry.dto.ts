import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateProductEntryDto {
  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  supplierId: number;

  @IsDateString()
  entryDate: string;

  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  unitValue: number;

  @IsNumber()
  @Type(() => Number)
  totalValue: number;

  @IsNotEmpty()
  invoiceNumber: string;

  @IsOptional()
  batch?: string;

   @IsOptional()
  category?: string;

  @IsOptional()
  observations?: string;

}

// src/product-entry/dto/search-product-entry.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class SearchProductEntryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;
  @IsOptional()
  @IsString()
  productName?: string;
  @IsOptional()
  @IsString()
  supplierName?: string;
  @IsOptional()
  @IsString()
  category?: string;
  @IsOptional()
  @IsString()
  batch?: string;
}

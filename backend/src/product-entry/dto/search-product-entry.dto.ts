// src/product-entry/dto/search-product-entry.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class SearchProductEntryDto {
  @IsOptional()
  @IsString()
  search?: string;
}

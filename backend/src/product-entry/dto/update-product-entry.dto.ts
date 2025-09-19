import { PartialType } from '@nestjs/mapped-types';
import { CreateProductEntryDto } from './create-product-entry.dto';

export class UpdateProductEntryDto extends PartialType(CreateProductEntryDto) {}

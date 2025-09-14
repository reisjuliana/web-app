import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductEntryDto {
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

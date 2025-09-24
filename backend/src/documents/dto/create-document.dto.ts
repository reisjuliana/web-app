import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateDocumentDTO {
  @IsNotEmpty()
  filename: string;

  @IsNotEmpty()
  file_content: Buffer;

  @IsEnum(['pdf', 'xml'])
  file_type: 'pdf' | 'xml';

  @IsOptional()
  product_id?: number;

  @IsOptional()
  product_entry_id?: number;

  @IsNotEmpty()
  user_id: number;
}

import { IsInt } from 'class-validator';

export class GetProductByCodeDto {
  @IsInt()
  code: number;
}

import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProductEntryService } from './product-entry.service';
import { CreateProductEntryDto } from './dto/create-product-entry.dto';

@Controller('product-entry')
export class ProductEntryController {
  constructor(private readonly productEntryService: ProductEntryService) {}

  @Post()
  create(@Body() createProductEntryDto: CreateProductEntryDto) {
    return this.productEntryService.create(createProductEntryDto);
  }

  @Get()
  findAll() {
    return this.productEntryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productEntryService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productEntryService.remove(+id);
  }
}

// src/product-entry/product-entry.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProductEntryService } from './product-entry.service';
import { CreateProductEntryDto } from './dto/create-product-entry.dto';
import { UpdateProductEntryDto } from './dto/update-product-entry.dto';

@Controller('api')
export class ProductEntryController {
  constructor(private readonly service: ProductEntryService) {}

  @Get('entries')
  findAll() {
    return this.service.findAll();
  }

  @Get('entries/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post('entries')
  create(@Body() dto: CreateProductEntryDto) {
    return this.service.create(dto);
  }

  @Put('entries/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductEntryDto) {
    return this.service.update(+id, dto);
  }

  @Delete('entries/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  // Endpoints para frontend Angular
  @Get('products')
  findAllProducts() {
    return this.service.findAllProducts();
  }

  @Get('suppliers')
  findAllSuppliers() {
    return this.service.findAllSuppliers();
  }
}

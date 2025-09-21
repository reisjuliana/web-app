// src/product-entry/product-entry.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ProductEntryService } from './product-entry.service';
import { CreateProductEntryDto } from './dto/create-product-entry.dto';
import { UpdateProductEntryDto } from './dto/update-product-entry.dto';

@Controller('product-entry')
export class ProductEntryController {
  constructor(private readonly service: ProductEntryService) {}

  // Entradas
  @Get()
  findAll() {
    const entries = this.service.findAll();
    return { entries }; // agora retorna { entries: [...] }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
  return this.service.findOne(id);
}

  @Post()
  async create(@Body() dto: CreateProductEntryDto) {
    const entry = this.service.create(dto);
    return entry;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductEntryDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  // Produtos
 @Get('products')
  async findAllProducts() {
  const products = await this.service.findAllProducts();
  return { products };
}

  // Fornecedores
  @Get('suppliers')
  async findAllSuppliers() {
  const suppliers = await this.service.findAllSuppliers();
  return { suppliers };
}
}

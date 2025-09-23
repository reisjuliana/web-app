// src/product-entry/product-entry.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductEntryService } from './product-entry.service';
import { CreateProductEntryDto } from './dto/create-product-entry.dto';
import { UpdateProductEntryDto } from './dto/update-product-entry.dto';
import { SearchProductEntryDto } from './dto/search-product-entry.dto';
import { ProductEntryListDto } from './dto/list-product-entry.dto';
import { UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserEntity } from '../users/entities/user.entity';

@Controller('product-entry')
@UseGuards(JwtAuthGuard)
export class ProductEntryController {
  constructor(private readonly service: ProductEntryService) {}

  // Entradas
  @Get()
  findAll(@Query() dto: SearchProductEntryDto): Promise<ProductEntryListDto[]> {
    return this.service.findAllFiltered(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductEntryListDto> {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File | null,
    @Body() dto: CreateProductEntryDto,
    @Req() req: any,
  ): Promise<ProductEntryListDto> {
    const user: UserEntity = req.user; // usuário logado pelo JwtAuthGuard
    return this.service.createEntry(dto, file, user);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductEntryDto,
  ): Promise<ProductEntryListDto> {
    return this.service.update(id, dto);
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

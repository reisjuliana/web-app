import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET /products → retorna todos
  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  // GET /products/:id → retorna 1 produto pelo id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findByCode(id);
  }
}

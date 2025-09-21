import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Buscar todos os produtos
  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  // Buscar produto por código/id
  async findByCode(code: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id: code } });
    if (!product) {
      throw new NotFoundException(`Produto com código ${code} não encontrado.`);
    }
    return product;
  }
}

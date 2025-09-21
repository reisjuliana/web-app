import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';


@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getMetrics() {
    // Busca todos os produtos
    const products = await this.productRepository.find();

    // Extrai os valores desejados
    const labels = products.map(p => p.name);
    const averageConsumption = products.map(p => Number(p.average_consumption) || 0);
    const stockQuantity = products.map(p => Number(p.stock_quantity) || 0);

    // const bar = products.map(p => Number(p.average_consumption) || 0);
    // const line = products.map(p => Number(p.stock_quantity) || 0);
    // const labels = products.map(p => p.name);

    return {
      labels,
      averageConsumption,
      stockQuantity
    };

  }

}

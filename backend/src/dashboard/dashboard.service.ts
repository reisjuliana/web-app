import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { ProductEntry } from '../product-entry/entities/product-entry.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ProductEntry)
    private readonly productEntryRepository: Repository<ProductEntry>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,

    
  ) {}

  async getMetrics() {
    // Busca todos os produtos
    const products = await this.productRepository.find();

    // Calcula dias para acabar para cada produto
    const productsWithDays = products
      .map(p => ({
        ...p,
        daysToEnd: (p.average_consumption && p.average_consumption > 0)
          ? Number(p.stock_quantity) / Number(p.average_consumption)
          : Infinity // evita divisão por zero
      }))
      .filter(p => p.daysToEnd !== Infinity); // remove produtos sem consumo médio

    // Ordena pelo menor tempo para acabar e pega os 4 primeiros
    const soonestToEnd = productsWithDays
      .sort((a, b) => a.daysToEnd - b.daysToEnd)
      .slice(0, 4);

    const labels = soonestToEnd.map(p => p.name);
    const averageConsumption = soonestToEnd.map(p => Number(p.average_consumption) || 0);
    const stockQuantity = soonestToEnd.map(p => Number(p.stock_quantity) || 0);
    const daysToEnd = soonestToEnd.map(p => Number(p.daysToEnd.toFixed(2)));

    return {
      labels,
      averageConsumption,
      stockQuantity,
      daysToEnd
    };
  }

   async getLastEntries() {
    // Busca as 5 últimas entradas, incluindo produto e fornecedor
    const entries = await this.productEntryRepository.find({
      order: { entryDate: 'DESC' },
      take: 5,
      relations: ['product', 'supplier'],
    });

    // Mapeia para o formato desejado
    return entries.map(e => ({
      // entryDate: e.entryDate,
      product: e.product?.name,
      supplier: e.supplier?.name,
      quantity: e.quantity,
    }));
  }

   async getProductQuantities() {
    const products = await this.productRepository.find();
    return {
      labels: products.map(p => p.name),
      quantities: products.map(p => Number(p.stock_quantity) || 0)
    };
  }


}

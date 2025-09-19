// src/product-entry/product-entry.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntry } from './entities/product-entry.entity';
import { Product } from './entities/product.entity';
import { Supplier } from './entities/supplier.entity';
import { CreateProductEntryDto } from './dto/create-product-entry.dto';
import { UpdateProductEntryDto } from './dto/update-product-entry.dto';

@Injectable()
export class ProductEntryService {
  constructor(
    @InjectRepository(ProductEntry)
    private repo: Repository<ProductEntry>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Supplier)
    private supplierRepo: Repository<Supplier>,
  ) {}

  findAll(): Promise<ProductEntry[]> {
    return this.repo.find({ relations: ['product', 'supplier'] });
  }

  findOne(id: number): Promise<ProductEntry> {
    return this.repo.findOne({ where: { id }, relations: ['product', 'supplier'] });
  }

  create(dto: CreateProductEntryDto): Promise<ProductEntry> {
    const entry = this.repo.create(dto);
    return this.repo.save(entry);
  }

  async update(id: number, dto: UpdateProductEntryDto): Promise<ProductEntry> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  // Métodos adicionais para o frontend
  findAllProducts(): Promise<Product[]> {
    return this.productRepo.find();
  }

  findAllSuppliers(): Promise<Supplier[]> {
    return this.supplierRepo.find();
  }
}

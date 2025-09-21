// src/product-entry/product-entry.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntry } from './entities/product-entry.entity';
import { Product } from '../products/entities/product.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
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

  // Retorna todas as entradas
  findAll(): Promise<ProductEntry[]> {
    return this.repo.find({ relations: ['product', 'supplier'] });
  }

  // Retorna uma entrada pelo id
  findOne(id: number): Promise<ProductEntry> {
    return this.repo.findOne({ where: { id }, relations: ['product', 'supplier'] });
  }

  // Cria uma entrada, vinculando produto e fornecedor
  async create(dto: CreateProductEntryDto): Promise<ProductEntry> {
    // Buscar o produto e fornecedor pelo id enviado
    const product = await this.productRepo.findOneBy({ id: dto.productId });
    const supplier = await this.supplierRepo.findOneBy({ id: dto.supplierId });

    if (!product) {
      throw new BadRequestException(`Produto com ID ${dto.productId} não encontrado`);
    }
    if (!supplier) {
      throw new BadRequestException(`Fornecedor com ID ${dto.supplierId} não encontrado`);
    }

    const entry = this.repo.create({
      product,
      supplier,
      entryDate: new Date(dto.entryDate),
      quantity: dto.quantity,
      unitValue: dto.unitValue,
      totalValue: dto.totalValue,
      invoiceNumber: dto.invoiceNumber,
      batch: dto.batch,
      expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : null,
      category: dto.category,
      observations: dto.observations,
    });

    return this.repo.save(entry);
  }

  // Atualiza uma entrada
  async update(id: number, dto: UpdateProductEntryDto): Promise<ProductEntry> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  // Remove uma entrada
  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  // Métodos adicionais para frontend
  findAllProducts(): Promise<Product[]> {
    return this.productRepo.find();
  }

  findAllSuppliers(): Promise<Supplier[]> {
    return this.supplierRepo.find();
  }
}

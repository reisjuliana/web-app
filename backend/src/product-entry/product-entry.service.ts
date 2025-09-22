// src/product-entry/product-entry.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntry } from './entities/product-entry.entity';
import { Product } from '../products/entities/product.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { CreateProductEntryDto } from './dto/create-product-entry.dto';
import { UpdateProductEntryDto } from './dto/update-product-entry.dto';
import { SearchProductEntryDto } from './dto/search-product-entry.dto';
import { ProductEntryListDto } from './dto/list-product-entry.dto';

// DTO interno de retorno para frontend
interface ProductEntryResponseDto {
  id: number;
  productId: number;
  productName: string;
  supplierId: number;
  supplierName: string;
  entryDate: Date;
  quantity: number;
  unitValue: number;
  totalValue: number;
  invoiceNumber: string;
  batch: string;
  expirationDate: Date | null;
  category: string;
  observations: string;
}

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

  // Retorna todas as entradas ou filtradas (com nomes já incluídos)
  async findAllFiltered(dto: SearchProductEntryDto): Promise<ProductEntryListDto[]> {
    const query = this.repo
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.product', 'product')
      .leftJoinAndSelect('entry.supplier', 'supplier');

    if (dto.productName) {
      query.andWhere('LOWER(product.name) LIKE :productName', { productName: `%${dto.productName.toLowerCase()}%` });
    }

    if (dto.supplierName) {
      query.andWhere('LOWER(supplier.name) LIKE :supplierName', { supplierName: `%${dto.supplierName.toLowerCase()}%` });
    }

    if (dto.invoiceNumber) {
      query.andWhere('LOWER(entry.invoiceNumber) LIKE :invoiceNumber', { invoiceNumber: `%${dto.invoiceNumber.toLowerCase()}%` });
    }

    if (dto.category) {
      query.andWhere('LOWER(entry.category) LIKE :category', { category: `%${dto.category.toLowerCase()}%` });
    }

    if (dto.batch) {
      query.andWhere('LOWER(entry.batch) LIKE :batch', { batch: `%${dto.batch.toLowerCase()}%` });
    }

   const entries = await query
  .orderBy('entry.id', 'DESC') // do mais recente para o mais antigo
  .getMany();

    // Transformar para DTO de resposta, incluindo nomes
    return entries.map(entry => ({
      id: entry.id,
      productId: entry.product.id,
      productName: entry.product.name,
      supplierId: entry.supplier.id,
      supplierName: entry.supplier.name,
      entryDate: entry.entryDate,
      quantity: entry.quantity,
      unitValue: entry.unitValue,
      totalValue: entry.totalValue,
      invoiceNumber: entry.invoiceNumber,
      batch: entry.batch,
      expirationDate: entry.expirationDate,
      category: entry.category,
      observations: entry.observations,
    }));
  }

  // Retorna uma entrada pelo id
  async findOne(id: number): Promise<ProductEntryListDto> {
    const entry = await this.repo.findOne({ 
      where: { id }, 
      relations: ['product', 'supplier'] });
    if (!entry) return null;

    return {
      id: entry.id,
      productId: entry.product.id,
      productName: entry.product.name,
      supplierId: entry.supplier.id,
      supplierName: entry.supplier.name,
      entryDate: entry.entryDate,
      quantity: entry.quantity,
      unitValue: entry.unitValue,
      totalValue: entry.totalValue,
      invoiceNumber: entry.invoiceNumber,
      batch: entry.batch,
      expirationDate: entry.expirationDate,
      category: entry.category,
      observations: entry.observations,
    };
  }

  // Cria uma entrada, vinculando produto e fornecedor
  async create(dto: CreateProductEntryDto): Promise<ProductEntryListDto> {
    const product = await this.productRepo.findOneBy({ id: dto.productId });
    const supplier = await this.supplierRepo.findOneBy({ id: dto.supplierId });

    if (!product) throw new BadRequestException(`Produto com ID ${dto.productId} não encontrado`);
    if (!supplier) throw new BadRequestException(`Fornecedor com ID ${dto.supplierId} não encontrado`);

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

    const saved = await this.repo.save(entry);

    // Faz um reload da entrada com relations para garantir que supplier e product estejam completos
  const fullEntry = await this.repo.findOne({
    where: { id: saved.id },
    relations: ['product', 'supplier'],
  });

  if (!fullEntry) throw new BadRequestException('Erro ao buscar a entrada salva');
  
    return {
      id: saved.id,
      productId: product.id,
      productName: product.name,
      supplierId: supplier.id,
      supplierName: supplier.name,
      entryDate: saved.entryDate,
      quantity: saved.quantity,
      unitValue: saved.unitValue,
      totalValue: saved.totalValue,
      invoiceNumber: saved.invoiceNumber,
      batch: saved.batch,
      expirationDate: saved.expirationDate,
      category: saved.category,
      observations: saved.observations,
    };
  }

  // Atualiza uma entrada
  async update(id: number, dto: UpdateProductEntryDto): Promise<ProductEntryListDto> {
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

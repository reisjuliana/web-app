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
import { DocumentEntity } from '../documents/entities/document.entity';
import { UserEntity } from '../users/entities/user.entity';

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
      query.andWhere('LOWER(product.name) LIKE :productName', {
        productName: `%${dto.productName.toLowerCase()}%`,
      });
    }

    if (dto.supplierName) {
      query.andWhere('LOWER(supplier.name) LIKE :supplierName', {
        supplierName: `%${dto.supplierName.toLowerCase()}%`,
      });
    }

    if (dto.invoiceNumber) {
      query.andWhere('LOWER(entry.invoiceNumber) LIKE :invoiceNumber', {
        invoiceNumber: `%${dto.invoiceNumber.toLowerCase()}%`,
      });
    }

    if (dto.category) {
      query.andWhere('LOWER(entry.category) LIKE :category', {
        category: `%${dto.category.toLowerCase()}%`,
      });
    }

    if (dto.batch) {
      query.andWhere('LOWER(entry.batch) LIKE :batch', { batch: `%${dto.batch.toLowerCase()}%` });
    }

    const entries = await query
      .orderBy('entry.id', 'DESC') // do mais recente para o mais antigo
      .getMany();

    // Transformar para DTO de resposta, incluindo nomes
    return entries.map((entry) => ({
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
      category: entry.category,
      observations: entry.observations,
    }));
  }

  // Retorna uma entrada pelo id
  async findOne(id: number): Promise<ProductEntryListDto> {
    const entry = await this.repo.findOne({
      where: { id },
      relations: ['product', 'supplier'],
    });
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
      category: entry.category,
      observations: entry.observations,
    };
  }

  // Criar a entrada de produto referenciando o documento
  async createEntry(
    dto: CreateProductEntryDto,
    file: Express.Multer.File | null,
    user: UserEntity,
  ): Promise<ProductEntryListDto> {
    // Buscar produto e fornecedor
    const product = await this.productRepo.findOneBy({ id: dto.productId });
    const supplier = await this.supplierRepo.findOneBy({ id: dto.supplierId });

    if (!product) throw new BadRequestException(`Produto com ID ${dto.productId} não encontrado`);
    if (!supplier)
      throw new BadRequestException(`Fornecedor com ID ${dto.supplierId} não encontrado`);

    let savedDocument: DocumentEntity | null = null;
    const documentRepo = this.repo.manager.getRepository(DocumentEntity);

    // Se houver PDF a ser anexado, cria o registro na documents
    if (file) {
      const documentRepo = this.repo.manager.getRepository(DocumentEntity);
      const document = documentRepo.create({
        filename: file.originalname,
        file_content: file.buffer,
        file_type: 'pdf', // pode parametrizar depois
        product: product,
        user: user,
        upload_date: new Date(),
      });
      savedDocument = await documentRepo.save(document);
    }

    // Criar a entrada de produto, referenciando documento se existir
    const entry = this.repo.create({
      product,
      supplier,
      entryDate: new Date(dto.entryDate),
      quantity: dto.quantity,
      unitValue: dto.unitValue,
      totalValue: dto.totalValue,
      invoiceNumber: dto.invoiceNumber,
      batch: dto.batch,
      category: dto.category,
      observations: dto.observations,
      documentId: savedDocument.id,
      user: user,
    });

    const savedEntry = await this.repo.save(entry);

    // Se documento foi criado, atualiza a relação inversa
    if (savedDocument) {
      savedDocument.productEntry = savedEntry;
      await documentRepo.save(savedDocument);
    }

    // Retorna a entrada completa
    return this.findOne(savedEntry.id);
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly repo: Repository<Supplier>,
  ) {}

  findAll(): Promise<Supplier[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Supplier | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.repo.create(dto);
    return this.repo.save(supplier);
  }

  async update(id: number, dto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.repo.preload({ id, ...dto });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return this.repo.save(supplier);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
  // Buscar produto por código/id
    async findByCode(code: number): Promise<Supplier> {
      const supplier = await this.repo.findOne({ where: { id: code } });
      if (!supplier) {
        throw new NotFoundException(`Fornecedor com código ${code} não encontrado.`);
      }
      return supplier;
    }
}

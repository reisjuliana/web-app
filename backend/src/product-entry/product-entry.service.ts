import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntry } from './entities/product-entry.entity';
import { CreateProductEntryDto } from './dto/create-product-entry.dto';

@Injectable()
export class ProductEntryService {
  constructor(
    @InjectRepository(ProductEntry)
    private productEntryRepository: Repository<ProductEntry>,
  ) {}

  create(createProductEntryDto: CreateProductEntryDto) {
    const entry = this.productEntryRepository.create({
      ...createProductEntryDto,
      totalPrice: createProductEntryDto.quantity * createProductEntryDto.unitPrice,
    });
    return this.productEntryRepository.save(entry);
  }

  findAll() {
    return this.productEntryRepository.find();
  }

  findOne(id: number) {
    return this.productEntryRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.productEntryRepository.delete(id);
    return { deleted: true };
  }
}

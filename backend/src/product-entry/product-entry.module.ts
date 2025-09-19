import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntryService } from './product-entry.service';
import { ProductEntryController } from './product-entry.controller';
import { ProductEntry } from './entities/product-entry.entity';
import { Product } from './entities/product.entity';
import { Supplier } from './entities/supplier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntry, Product, Supplier]),
  ],
  controllers: [ProductEntryController],
  providers: [ProductEntryService],
})
export class ProductEntryModule {}

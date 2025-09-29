import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Product } from '../products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { ProductEntry } from '../product-entry/entities/product-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Supplier, ProductEntry])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

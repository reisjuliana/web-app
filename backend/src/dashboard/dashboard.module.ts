import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Product } from '../products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}


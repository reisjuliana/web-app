import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntryService } from './product-entry.service';
import { ProductEntryController } from './product-entry.controller';
import { ProductEntry } from './entities/product-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntry])],
  controllers: [ProductEntryController],
  providers: [ProductEntryService],
})
export class ProductEntryModule {}

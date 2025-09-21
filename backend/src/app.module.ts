import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ProductEntryModule } from './product-entry/product-entry.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SupplierModule } from './suppliers/supplier.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'insumoplus',
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    ProductEntryModule,
    DashboardModule,
    SupplierModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

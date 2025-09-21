import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductEntry } from '../../product-entry/entities/product-entry.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  average_price?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  average_consumption?: number;

  @Column({ type: 'int', nullable: true })
  stock_quantity?: number;

  // Relação inversa com entradas
  @OneToMany(() => ProductEntry, (entry) => entry.product)
  entries: ProductEntry[];
}

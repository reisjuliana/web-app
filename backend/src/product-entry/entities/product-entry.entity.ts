import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';

@Entity('product_entries')
export class ProductEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.entries, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Supplier, (supplier) => supplier.entries, { eager: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'date', name: 'entry_date' })
  entryDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitValue: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalValue: number;

  @Column({ name: 'invoice_number' })
  invoiceNumber: string;

  @Column({ nullable: true })
  batch?: string;

  @Column({ type: 'date', nullable: true, name: 'expiration_date' })
  expirationDate?: Date;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  observations?: string;
}

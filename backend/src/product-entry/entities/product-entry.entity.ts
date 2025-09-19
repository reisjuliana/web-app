import { Entity, Column, PrimaryGeneratedColumn, ManyToOne  } from 'typeorm';
import { Product } from './product.entity';
import { Supplier } from './supplier.entity';

@Entity('product_entries')
export class ProductEntry {
  @PrimaryGeneratedColumn()
  id: number;

   @ManyToOne(() => Product, product => product.entries, { eager: true })
  product: Product;

  @ManyToOne(() => Supplier, supplier => supplier.entries, { eager: true })
  supplier: Supplier;
  
  @Column({ type: 'date', name: 'entry_date', nullable:true })
  entryDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitValue: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalValue: number;

  @Column()
  invoiceNumber: string;

  @Column({ nullable: true })
  batch: string;

  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  observations: string;
}

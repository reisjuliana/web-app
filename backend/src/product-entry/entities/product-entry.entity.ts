import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { DocumentEntity } from 'src/documents/entities/document.entity';

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

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  observations?: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'bigint', name: 'document_id', nullable: true })
  documentId: number;

  @OneToMany(() => DocumentEntity, (document) => document.productEntry, { cascade: true })
 documents: DocumentEntity[];
}

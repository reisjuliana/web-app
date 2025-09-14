import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product_entries')
export class ProductEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productCode: string;

  @Column()
  productName: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

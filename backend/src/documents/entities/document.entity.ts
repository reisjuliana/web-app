import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import * as crypto from 'crypto';
import { ProductEntry } from 'src/product-entry/entities/product-entry.entity';

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'varchar', length: 150 })
  filename: string;

  @Column({ type: 'blob' })
  file_content: Buffer;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  upload_date: Date;

  @Column({ type: 'enum', enum: ['pdf', 'xml'], nullable: true })
  file_type: 'pdf' | 'xml';

  @Column({ type: 'char', length: 64, unique: true })
  hash_sha256: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @BeforeInsert()
  calculateHash() {
    this.hash_sha256 = crypto.createHash('sha256').update(this.file_content).digest('hex');
  }
  @ManyToOne(() => ProductEntry, (entry) => entry.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_entry_id' })
  productEntry: ProductEntry;
}

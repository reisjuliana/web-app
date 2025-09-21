import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { ProductEntry } from '../../product-entry/entities/product-entry.entity';

@Entity({ name: 'suppliers' })
@Unique(['cnpj'])
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'char', length: 14, nullable: true })
  cnpj?: string;

  @Column({ length: 30, nullable: true })
  phone?: string;

  @Column({ length: 120, nullable: true })
  email?: string;

  @OneToMany(() => ProductEntry, (entry) => entry.supplier)
  entries: ProductEntry[];
}

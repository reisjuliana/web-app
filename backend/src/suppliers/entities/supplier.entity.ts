// src/product-entry/entities/supplier.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductEntry } from '../../product-entry/entities/product-entry.entity';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ProductEntry, entry => entry.supplier)
  entries: ProductEntry[];
}

import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductEntry } from '../../product-entry/entities/product-entry.entity';
import { DocumentEntity } from '../../documents/entities/document.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  uid: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  cpf: string;

  @Column()
  password: string;

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

   // Relacionamento com ProductEntry
  @OneToMany(() => ProductEntry, (entry) => entry.user)
  entries: ProductEntry[];

  // Relacionamento com DocumentEntity
  @OneToMany(() => DocumentEntity, (document) => document.user)
  documents: DocumentEntity[];
}

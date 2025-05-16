// inventory.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => require('../../products/entities/product.entity').Product, 'inventoryItems', {
    lazy: true,
  })
  product: any;

  @ManyToOne(() => require('../../company/entities/company.entity').Company, {
    lazy: true,
  })
  company: any;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column('text', { nullable: true })
  notes: string | null;
}

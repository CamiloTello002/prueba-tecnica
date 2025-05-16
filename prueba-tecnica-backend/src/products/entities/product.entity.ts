import { Column, Entity, PrimaryColumn, ManyToOne, OneToMany } from "typeorm";
import { Company } from "../../company/entities/company.entity"; // Regular import
import { Inventory } from "../../inventory/entities/inventory.entity"; // Regular import

@Entity()
export class Product {
  @PrimaryColumn('text', {
    unique: true
  })
  code: string;

  @Column('text')
  name: string;

  @Column('text')
  features: string;

  @Column('numeric', { precision: 10, scale: 2 })
  priceUSD: number;

  @Column('numeric', { precision: 10, scale: 2 })
  priceEUR: number;

  @Column('numeric', { precision: 10, scale: 2 })
  priceCOP: number;

  @ManyToOne(() => Company, (company) => company.products, {
    lazy: true,
  })
  company: Company;

  @OneToMany(() => Inventory, (inventory) => inventory.product, {
    lazy: true,
  })
  inventoryItems: Inventory[];
}

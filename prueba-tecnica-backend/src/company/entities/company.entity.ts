import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { Product } from "../../products/entities/product.entity"; // Regular import

@Entity()
export class Company {
  @PrimaryColumn('text', {
    unique: true
  })
  nit: string;

  @Column('text')
  name: string;

  @Column('text')
  address: string;

  @Column('text')
  phone: string;

  @OneToMany(() => Product, (product) => product.company, {
    lazy: true,
  })
  products: Product[];
}

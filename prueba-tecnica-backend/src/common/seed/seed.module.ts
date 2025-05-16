import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedCommand } from './seed.command';
import { CompanyModule } from '../../company/company.module';
import { ProductsModule } from '../../products/products.module';
import { InventoryModule } from '../../inventory/inventory.module';
import { UserModule } from '../../user/user.module';
import { Company } from '../../company/entities/company.entity';
import { Product } from '../../products/entities/product.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { User } from '../../user/entities/user.entity';

// brings together seeding components AND provides access
// to database repositories
@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Product, Inventory, User]),
    CompanyModule,
    ProductsModule,
    InventoryModule,
    UserModule,
  ],
  providers: [SeedService, SeedCommand],
  exports: [SeedService],
})
export class SeedModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './common/seed/seed.service';
import { SeedCommand } from './common/seed/seed.command';
import { CompanyModule } from './company/company.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { UserModule } from './user/user.module';
import { Company } from './company/entities/company.entity';
import { Product } from './products/entities/product.entity';
import { Inventory } from './inventory/entities/inventory.entity';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Company, Product, Inventory, User]),
    CompanyModule,
    ProductsModule,
    InventoryModule,
    UserModule,
  ],
  providers: [SeedService, SeedCommand],
})
export class CLIModule {}

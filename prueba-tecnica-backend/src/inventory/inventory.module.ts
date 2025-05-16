import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { PdfService } from './pdf/pdf.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]), MailModule],
  controllers: [InventoryController],
  providers: [InventoryService, PdfService]
})
export class InventoryModule { }

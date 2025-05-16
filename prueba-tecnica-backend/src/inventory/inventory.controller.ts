import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { SendInventoryEmailDto } from './dto/send-inventory-email.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.inventoryService.findAll();
  }

  @Get('company/:nit')
  @UseGuards(JwtAuthGuard)
  async findByCompany(@Param('nit') nit: string) {
    return this.inventoryService.findByCompany(nit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }

  @Get('report/pdf')
  @UseGuards(JwtAuthGuard)
  async generatePdf(@Res() res: Response) {
    const buffer = await this.inventoryService.generateInventoryPdf();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=inventory-report-${new Date().toISOString().slice(0, 10)}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Post('report/email')
  @UseGuards(JwtAuthGuard)
  async sendReportByEmail(@Body() sendInventoryEmailDto: SendInventoryEmailDto) {
    return this.inventoryService.sendInventoryEmail(sendInventoryEmailDto);
  }
}

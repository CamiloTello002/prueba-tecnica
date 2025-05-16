import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ProductDto } from './dto/product.dto';

@Controller('ai')
export class AIContentController {
  constructor(private geminiService: GeminiService) { }

  @Post('generate-description')
  @Auth(UserRole.ADMIN)
  async generateDescription(@Body() product: ProductDto) {
    const description = await this.geminiService.generateProductDescription(product);
    return { description };
  }

  @Post('generate-features')
  @Auth(UserRole.ADMIN)
  async generateFeatures(@Body() product: ProductDto) {
    const features = await this.geminiService.generateProductFeatures(product);
    return { features };
  }
}

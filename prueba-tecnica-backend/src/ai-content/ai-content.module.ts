import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIContentController } from './ai-content.controller';
import { GeminiService } from './gemini.service';

@Module({
  imports: [ConfigModule],
  controllers: [AIContentController],
  providers: [GeminiService],
  exports: [GeminiService]
})
export class AIContentModule {}

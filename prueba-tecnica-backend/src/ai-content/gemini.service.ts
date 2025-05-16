import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { GoogleGenAI } from '@google/genai';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class GeminiService {
  private generativeAI: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.generativeAI = new GoogleGenAI({ apiKey });
  }

  async generateProductDescription(product: ProductDto): Promise<string> {
    try {
      const prompt = `Generate a detailed, engaging product description for the following product:
    Name: ${product.name}
    Features: ${product.features}
    Price: ${product.priceUSD} USD
    
    The description should be compelling, highlight key features, and be between 100-150 words.`;
      const result = await this.generativeAI.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt
      });
      return result.text || '';
    } catch (error) {
      console.error('Failed to generate product description:', error);
      // Return a fallback description or rethrow the error if needed
      return `This is a placeholder description for ${product.name || 'product name'}. Features: ${product.features || 'features list'}. Price: ${product.priceUSD || 0} USD.`;
    }
  }

  async generateProductFeatures(product: ProductDto): Promise<string[]> {
    try {
      const prompt = `Based on this product name and any existing features, generate 5 compelling bullet points highlighting the key features:
      Name: ${product.name}
      Existing features: ${product.features}
      
      Generate features that are specific, benefit-focused, and would appeal to potential customers.`;

      const result = await this.generativeAI.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt
      });
      if (result.text)
        return result.text.split('\n')
          .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
          .map(line => line.replace(/^[-•]\s*/, '').trim()) || [];
      return ['no features']
    } catch (error) {
      console.error('Failed to generate product description:', error);
      // Return a fallback description or rethrow the error if needed
      return ['no features']
    }
  }
}

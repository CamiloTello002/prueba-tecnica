import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.createTransporter();
  }

  private async createTransporter() {
    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST') || 'smtp.ethereal.email',
      port: this.configService.get('MAIL_PORT') || 587,
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER') || testAccount.user,
        pass: this.configService.get('MAIL_PASS') || testAccount.pass,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, attachments: any[] = []) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get('MAIL_FROM') || '"Inventory System" <inventory@example.com>',
        to,
        subject,
        text,
        attachments,
      });

      return {
        success: true,
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info),
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

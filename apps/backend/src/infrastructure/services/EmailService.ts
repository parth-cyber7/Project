import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '@/shared/config/env';
import { logger } from '@/infrastructure/logging/logger';

export class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    if (env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS
        }
      });
    }
  }

  async sendOrderConfirmation(email: string, orderId: string, totalAmount: number): Promise<void> {
    if (!this.transporter || !env.EMAIL_FROM) {
      logger.info('Email transport not configured. Skipping order confirmation email', {
        email,
        orderId,
        totalAmount
      });
      return;
    }

    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      subject: `Order Confirmation #${orderId}`,
      text: `Your order ${orderId} has been placed successfully. Total: $${totalAmount}`
    });
  }
}

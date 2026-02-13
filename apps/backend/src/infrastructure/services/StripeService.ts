import Stripe from 'stripe';
import { env } from '@/shared/config/env';

export class StripeService {
  private readonly stripe: Stripe | null;

  constructor() {
    this.stripe = env.STRIPE_SECRET_KEY
      ? new Stripe(env.STRIPE_SECRET_KEY, {
          apiVersion: '2025-02-24.acacia'
        })
      : null;
  }

  async createPaymentIntent(amount: number, currency = 'usd'): Promise<{ clientSecret: string }> {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true }
    });

    return {
      clientSecret: paymentIntent.client_secret ?? ''
    };
  }
}

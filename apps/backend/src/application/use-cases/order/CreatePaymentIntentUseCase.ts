import type { StripeService } from '@/infrastructure/services/StripeService';
import { ValidationError } from '@/shared/errors/ValidationError';

interface Input {
  amount: number;
  currency?: string;
}

export class CreatePaymentIntentUseCase {
  constructor(private readonly stripeService: StripeService) {}

  async execute(input: Input): Promise<{ clientSecret: string }> {
    if (input.amount <= 0) {
      throw new ValidationError('Amount must be greater than 0');
    }

    return this.stripeService.createPaymentIntent(input.amount, input.currency ?? 'usd');
  }
}

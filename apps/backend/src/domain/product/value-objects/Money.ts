export class Money {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error('Amount cannot be negative');
    }

    this.value = Number(value.toFixed(2));
  }

  toNumber(): number {
    return this.value;
  }
}

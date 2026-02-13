export class Email {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new Error('Invalid email format');
    }

    this.value = normalized;
  }

  toString(): string {
    return this.value;
  }
}

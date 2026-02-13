export function toSingleString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }

  return undefined;
}

export function toNumberOr(value: unknown, fallback: number): number {
  const maybeString = toSingleString(value);

  if (maybeString === undefined) {
    return fallback;
  }

  const parsed = Number(maybeString);
  return Number.isFinite(parsed) ? parsed : fallback;
}

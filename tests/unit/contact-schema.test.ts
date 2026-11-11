import { describe, expect, it } from 'vitest';
import { contactSchema, validateContactTiming, MIN_FORM_MS } from '@/lib/contact/schema';

describe('contact schema', () => {
  it('accepts valid payloads', () => {
    const parsed = contactSchema.safeParse({
      name: 'Ana Pérez',
      email: 'ana@example.com',
      message: 'Hola, quiero charlar sobre un proyecto.',
      website: '',
      loadedAt: Date.now() - MIN_FORM_MS - 10,
      lang: 'es',
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects short message and bad email', () => {
    expect(
      contactSchema.safeParse({
        name: 'A',
        email: 'nope',
        message: 'hi',
        loadedAt: Date.now(),
        lang: 'en',
      }).success,
    ).toBe(false);
  });

  it('enforces minimum dwell time', () => {
    const now = Date.now();
    expect(validateContactTiming(now - 500, now)).toBe(false);
    expect(validateContactTiming(now - MIN_FORM_MS - 1, now)).toBe(true);
  });
});

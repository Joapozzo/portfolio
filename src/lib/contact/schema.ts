import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(120),
  message: z.string().trim().min(10).max(2000),
  /** Honeypot — bots fill this; humans leave empty */
  website: z.string().optional().default(''),
  /** Client-rendered form load timestamp (ms) */
  loadedAt: z.number().int().positive(),
  lang: z.enum(['es', 'en']).default('es'),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const MIN_FORM_MS = 3000;

export function validateContactTiming(loadedAt: number, now = Date.now()): boolean {
  const elapsed = now - loadedAt;
  return elapsed >= MIN_FORM_MS && elapsed < 1000 * 60 * 60 * 24;
}

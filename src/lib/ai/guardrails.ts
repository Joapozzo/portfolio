const MAX_INPUT = 500;

const BLOCK_PATTERNS: RegExp[] = [
  /\bignore (all|previous|above) (instructions|prompts)\b/i,
  /\bjailbreak\b/i,
  /\bDAN\b/,
  /\bsystem prompt\b/i,
  /\bact as (if you are|a different)\b/i,
  /\bdeveloper mode\b/i,
  /\bdo anything now\b/i,
  /\baro\b/i,
  /\borbit\b/i,
];

const OFF_TOPIC_HINTS: RegExp[] = [
  /\bwrite (me )?(a |an )?(python|java|c\+\+|rust) (script|program|code)\b/i,
  /\bhomework\b/i,
  /\bsolve this leetcode\b/i,
  /\bgenerate (nudes|nsfw)\b/i,
  /\bhow to (hack|phish|steal)\b/i,
];

export type GuardrailResult =
  | { ok: true; message: string }
  | { ok: false; reason: 'empty' | 'too_long' | 'blocked' | 'off_topic' };

export function sanitizeUserMessage(raw: string): GuardrailResult {
  const message = raw.replace(/\s+/g, ' ').trim();
  if (!message) return { ok: false, reason: 'empty' };
  if (message.length > MAX_INPUT) return { ok: false, reason: 'too_long' };
  if (BLOCK_PATTERNS.some((re) => re.test(message))) return { ok: false, reason: 'blocked' };
  if (OFF_TOPIC_HINTS.some((re) => re.test(message))) return { ok: false, reason: 'off_topic' };
  return { ok: true, message };
}

export function isOnTopicAboutJoaquin(message: string): boolean {
  // Soft allow: most short questions pass; provider + system prompt enforce scope.
  // Reject obvious unrelated "boludeo" that slipped patterns.
  const lower = message.toLowerCase();
  if (/(chiste|meme|boludeo|putea|insulta)/i.test(lower) && !/joaqu[ií]n|proyecto|stack|cv|experiencia/.test(lower)) {
    return false;
  }
  return true;
}

export const MAX_USER_CHARS = MAX_INPUT;

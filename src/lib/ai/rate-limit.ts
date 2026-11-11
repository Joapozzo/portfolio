export interface RateLimitConfig {
  maxPerSession: number;
  maxPerVisitorDay: number;
  maxGlobalDay: number;
}

export const DEFAULT_RATE_LIMITS: RateLimitConfig = {
  maxPerSession: 10,
  maxPerVisitorDay: 5,
  maxGlobalDay: 200,
};

export interface RateLimitStore {
  get(key: string): Promise<number>;
  incr(key: string, ttlSeconds: number): Promise<number>;
}

/** In-memory store — free, resets on cold start (fine for free-tier protection). */
export class MemoryRateLimitStore implements RateLimitStore {
  private counts = new Map<string, { n: number; expires: number }>();

  async get(key: string): Promise<number> {
    this.gc(key);
    return this.counts.get(key)?.n ?? 0;
  }

  async incr(key: string, ttlSeconds: number): Promise<number> {
    this.gc(key);
    const now = Date.now();
    const cur = this.counts.get(key);
    if (!cur || cur.expires <= now) {
      const next = { n: 1, expires: now + ttlSeconds * 1000 };
      this.counts.set(key, next);
      return 1;
    }
    cur.n += 1;
    this.counts.set(key, cur);
    return cur.n;
  }

  private gc(key: string) {
    const cur = this.counts.get(key);
    if (cur && cur.expires <= Date.now()) this.counts.delete(key);
  }

  /** Test helper */
  clear() {
    this.counts.clear();
  }
}

/**
 * Optional Upstash REST backend (free tier).
 * Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to enable.
 * If unset, MemoryRateLimitStore is used.
 */
export class UpstashRateLimitStore implements RateLimitStore {
  constructor(
    private url: string,
    private token: string,
  ) {}

  async get(key: string): Promise<number> {
    const res = await fetch(`${this.url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    if (!res.ok) return 0;
    const data = (await res.json()) as { result?: string | null };
    return data.result ? Number(data.result) || 0 : 0;
  }

  async incr(key: string, ttlSeconds: number): Promise<number> {
    const pipeline = [
      ['INCR', key],
      ['EXPIRE', key, String(ttlSeconds)],
    ];
    const res = await fetch(`${this.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pipeline),
    });
    if (!res.ok) throw new Error('Upstash incr failed');
    const data = (await res.json()) as { result?: Array<{ result?: number }> };
    return Number(data.result?.[0]?.result ?? 0);
  }
}

export function createRateLimitStore(): RateLimitStore {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return new UpstashRateLimitStore(url, token);
  return new MemoryRateLimitStore();
}

function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export interface RateLimitDecision {
  allowed: boolean;
  remainingSession: number;
  remainingDay: number;
}

export async function checkAndConsumeRateLimit(
  store: RateLimitStore,
  opts: {
    ip: string;
    sessionId: string;
    config?: RateLimitConfig;
  },
): Promise<RateLimitDecision> {
  const config = opts.config ?? DEFAULT_RATE_LIMITS;
  const day = dayKey();
  const sessionKey = `chat:session:${opts.sessionId}:${day}`;
  const visitorKey = `chat:ip:${opts.ip}:${day}`;
  const globalKey = `chat:global:${day}`;

  const [sessionCount, visitorCount, globalCount] = await Promise.all([
    store.get(sessionKey),
    store.get(visitorKey),
    store.get(globalKey),
  ]);

  if (
    sessionCount >= config.maxPerSession ||
    visitorCount >= config.maxPerVisitorDay ||
    globalCount >= config.maxGlobalDay
  ) {
    return {
      allowed: false,
      remainingSession: Math.max(0, config.maxPerSession - sessionCount),
      remainingDay: Math.max(0, config.maxPerVisitorDay - visitorCount),
    };
  }

  const ttl = 60 * 60 * 26;
  const [s, v] = await Promise.all([
    store.incr(sessionKey, ttl),
    store.incr(visitorKey, ttl),
    store.incr(globalKey, ttl),
  ]);

  return {
    allowed: true,
    remainingSession: Math.max(0, config.maxPerSession - s),
    remainingDay: Math.max(0, config.maxPerVisitorDay - v),
  };
}

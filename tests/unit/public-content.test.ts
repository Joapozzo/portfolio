import { describe, expect, it } from 'vitest';
import { filterPublicMetrics, filterPublicStack, isTodoValue } from '@/lib/public-content';

describe('public-content', () => {
  it('detects TODO placeholders', () => {
    expect(isTodoValue('TODO')).toBe(true);
    expect(isTodoValue('todo')).toBe(true);
    expect(isTodoValue('TODO — pending')).toBe(true);
    expect(isTodoValue('TBD')).toBe(true);
    expect(isTodoValue('')).toBe(true);
    expect(isTodoValue(null)).toBe(true);
    expect(isTodoValue('Prisma')).toBe(false);
  });

  it('filters TODO stack items', () => {
    expect(filterPublicStack(['Node.js', 'TODO', 'Redis'])).toEqual(['Node.js', 'Redis']);
  });

  it('keeps only verified non-TODO metrics', () => {
    expect(
      filterPublicMetrics([
        { value: '91', verified: true },
        { value: 'TODO', verified: false },
        { value: '12', verified: false },
        { value: 'TODO', verified: true },
      ]),
    ).toEqual([{ value: '91', verified: true }]);
  });
});

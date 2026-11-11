/** Never surface raw TODO placeholders to the UI. */

export function isTodoValue(value: string | undefined | null): boolean {
  if (!value) return true;
  const v = value.trim().toUpperCase();
  return v === 'TODO' || v.startsWith('TODO ') || v === 'TBD';
}

export function filterPublicStack(stack: string[] | undefined): string[] {
  return (stack ?? []).filter((item) => !isTodoValue(item));
}

export function filterPublicMetrics<
  T extends { value: string; verified?: boolean },
>(metrics: T[] | undefined): T[] {
  return (metrics ?? []).filter((m) => m.verified === true && !isTodoValue(m.value));
}

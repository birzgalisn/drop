export const GAP = {
  tight: 'var(--gap-tight)',
  regular: 'var(--gap-regular)',
  loose: 'var(--gap-loose)',
} as const;

export type Gap = keyof typeof GAP;

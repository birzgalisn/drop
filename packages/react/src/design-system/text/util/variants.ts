export const TEXT_VARIANTS = ['title', 'muted', 'label', 'error'] as const;

export type TextVariant = (typeof TEXT_VARIANTS)[number];

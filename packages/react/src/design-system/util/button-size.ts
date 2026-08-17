export const BUTTON_HEIGHT = {
  xxs: 'var(--button-height-xxs)',
  xs: 'var(--button-height-xs)',
  sm: 'var(--button-height-sm)',
} as const;

export type ButtonSize = keyof typeof BUTTON_HEIGHT;

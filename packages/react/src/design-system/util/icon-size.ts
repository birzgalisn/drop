export const ICON_SIZE = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
} as const;

export type IconSize = keyof typeof ICON_SIZE;

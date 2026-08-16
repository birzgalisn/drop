import { createTheme, type MantineColorsTuple, type MantineThemeOverride } from '@mantine/core';

/** Muted sand — photographic, not neon. Used as the single accent. */
const sand: MantineColorsTuple = [
  '#f6f1ea',
  '#e8dfd2',
  '#d4c4ae',
  '#c0a88a',
  '#b39674',
  '#a68765',
  '#8f7154',
  '#765c45',
  '#5c4837',
  '#3f3126',
];

/** Cool graphite surfaces for dark UI chrome. */
const graphite: MantineColorsTuple = [
  '#f2f3f5',
  '#e2e4e8',
  '#c4c8d0',
  '#9aa1ad',
  '#6f7887',
  '#555e6d',
  '#434a57',
  '#343a45',
  '#252a33',
  '#161a21',
];

export const uiTheme: MantineThemeOverride = createTheme({
  primaryColor: 'sand',
  primaryShade: { light: 6, dark: 6 },
  colors: {
    sand,
    graphite,
  },
  fontFamily: 'var(--font-sans)',
  fontFamilyMonospace: 'var(--font-mono)',
  headings: {
    fontFamily: 'var(--font-heading)',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '2.75rem', lineHeight: '1.1', fontWeight: '800' },
      h2: { fontSize: '1.75rem', lineHeight: '1.2', fontWeight: '700' },
      h3: { fontSize: '1.25rem', lineHeight: '1.3', fontWeight: '700' },
    },
  },
  defaultRadius: 'md',
  cursorType: 'pointer',
});

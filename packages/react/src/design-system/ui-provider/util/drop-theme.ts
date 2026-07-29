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

export const dropTheme: MantineThemeOverride = createTheme({
  primaryColor: 'sand',
  primaryShade: { light: 6, dark: 4 },
  colors: {
    sand,
    graphite,
  },
  fontFamily: '"DM Sans", system-ui, sans-serif',
  fontFamilyMonospace: '"DM Mono", ui-monospace, monospace',
  headings: {
    fontFamily: '"Syne", "DM Sans", system-ui, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '2.75rem', lineHeight: '1.1', fontWeight: '800' },
      h2: { fontSize: '1.75rem', lineHeight: '1.2', fontWeight: '700' },
      h3: { fontSize: '1.25rem', lineHeight: '1.3', fontWeight: '700' },
    },
  },
  defaultRadius: 'md',
  cursorType: 'pointer',
  other: {
    dropBg: '#0b0d10',
    dropSurface: '#12151a',
    dropElevated: '#181c24',
    dropBorder: 'rgba(232, 226, 216, 0.08)',
    dropAccentSoft: 'rgba(196, 168, 130, 0.14)',
  },
  components: {
    Notifications: {
      styles: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--mantine-spacing-md)',
        },
        notification: {
          marginTop: 0,
        },
      },
    },
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
      styles: {
        root: {
          backgroundColor: 'var(--drop-surface)',
          borderColor: 'var(--drop-border)',
        },
      },
    },
    Dropzone: {
      styles: {
        root: {
          backgroundColor: 'var(--drop-surface)',
          borderColor: 'var(--drop-border)',
        },
      },
    },
    Stepper: {
      styles: {
        root: {
          maxWidth: 420,
          marginInline: 'auto',
        },
        steps: {
          gap: 0,
        },
        separator: {
          marginInline: 12,
          minWidth: 48,
          flex: '1 1 48px',
        },
        stepIcon: {
          borderWidth: 1,
        },
        stepCompletedIcon: {
          transform: 'scale(0.55)',
        },
      },
    },
  },
});

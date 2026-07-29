import { Text, type TextProps } from '@mantine/core';

/** Middle dot (U+00B7) — inline metadata separator (date · size · status). */
export const DOT_SEPARATOR = '·';

export type DotSeparatorProps = Omit<TextProps, 'children'>;

/** Middle-dot separator for inline metadata rows (date · size · status). */
export function DotSeparator(props: DotSeparatorProps) {
  return (
    <Text size="xs" c="dimmed" aria-hidden {...props}>
      {DOT_SEPARATOR}
    </Text>
  );
}

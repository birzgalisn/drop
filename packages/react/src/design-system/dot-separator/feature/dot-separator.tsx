import { Text } from '../../text/feature/text';

/** Middle dot (U+00B7) — inline metadata separator (date · size · status). */
export const DOT_SEPARATOR = '·';

/** Middle-dot separator for inline metadata rows (date · size · status). */
export function DotSeparator() {
  return (
    <Text component="span" aria-hidden>
      &nbsp;{DOT_SEPARATOR}&nbsp;
    </Text>
  );
}

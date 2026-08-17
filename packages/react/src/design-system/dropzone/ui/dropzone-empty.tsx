import { Stack } from '../../stack/feature/stack';
import { Text } from '../../text/feature/text';

export function DropzoneEmpty({
  title = 'Drop files here',
  hint = 'or click to browse',
}: {
  title?: string;
  hint?: string;
}) {
  return (
    <Stack align="center" gap="tight" mih={180} justify="center" ta="center">
      <Text variant="title">{title}</Text>
      <Stack maw={360} ta="center">
        <Text>{hint}</Text>
      </Stack>
    </Stack>
  );
}

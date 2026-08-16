import { Stack } from '../../stack/feature/stack';
import { Text } from '../../text/feature/text';

export function DropzoneEmpty() {
  return (
    <Stack align="center" gap="tight" mih={180} justify="center" ta="center">
      <Text variant="title">Drop files here</Text>
      <Text>or click to browse</Text>
    </Stack>
  );
}

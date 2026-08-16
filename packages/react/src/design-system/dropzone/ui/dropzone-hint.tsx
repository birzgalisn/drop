import { Button } from '@mantine/core';

import { Group } from '../../group/feature/group';
import { Text } from '../../text/feature/text';
import { useDropzoneOpen } from './dropzone-open-context';

export function DropzoneHint() {
  const open = useDropzoneOpen();

  return (
    <Group justify="center" gap="tight" wrap="wrap">
      <Text>Drop more files here, or</Text>
      <Button size="compact-sm" variant="subtle" onClick={open}>
        browse
      </Button>
    </Group>
  );
}

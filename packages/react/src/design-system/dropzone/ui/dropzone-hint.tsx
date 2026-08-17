import { Button } from '../../button/feature/button';
import { Group } from '../../group/feature/group';
import { Text } from '../../text/feature/text';
import { useDropzoneOpen } from './dropzone-open-context';

export function DropzoneHint() {
  const open = useDropzoneOpen();

  return (
    <Group justify="center" gap="regular" wrap="wrap">
      <Text>Drop more files here, or</Text>
      <Button size="xxs" variant="subtle" onClick={open}>
        browse
      </Button>
    </Group>
  );
}

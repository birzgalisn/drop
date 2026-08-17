import { pluralize } from '@repo/shared';

import { Group } from '../../../../design-system/group/feature/group';
import { Text } from '../../../../design-system/text/feature/text';

export function UploadHeader({ count }: { count: number }) {
  if (count === 0) {
    return null;
  }

  return (
    <Group justify="space-between" align="center">
      <Text variant="title">Your files</Text>
      <Text>
        {count} {pluralize({ count, singular: 'file' })}
      </Text>
    </Group>
  );
}

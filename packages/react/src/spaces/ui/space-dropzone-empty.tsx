import { SpaceConfig } from '@repo/shared';

import { Stack } from '../../design-system/stack/feature/stack';
import { Text } from '../../design-system/text/feature/text';

export function SpaceDropzoneEmpty() {
  return (
    <Stack align="center" gap="tight" mih={180} justify="center" ta="center">
      <Text variant="title">Drop images here</Text>
      <Stack maw={360} ta="center">
        <Text>
          or click to browse — JPEG &amp; PNG, up to {SpaceConfig.FILE_MAX_MIB} MiB each,{' '}
          {SpaceConfig.MAX_FILES} files max
        </Text>
      </Stack>
    </Stack>
  );
}

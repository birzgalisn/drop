import { Group, Text } from '@mantine/core';

export function UploadHeader({ count }: { count: number }) {
  if (count === 0) {
    return null;
  }

  return (
    <Group justify="space-between" align="center">
      <Text fw={600}>Your files</Text>
      <Text size="sm" c="dimmed">
        {count} file{count === 1 ? '' : 's'}
      </Text>
    </Group>
  );
}

import { Button, Container, Group, Loader, Stack, Text } from '@mantine/core';

export function SpaceManageBootLoader() {
  return (
    <Group justify="center" mih="100vh">
      <Loader />
    </Group>
  );
}

export function SpaceManageBootError({
  message,
  onHome,
}: {
  message?: string;
  onHome: () => void;
}) {
  return (
    <Container size="sm" py={64} pos="relative" style={{ zIndex: 1 }}>
      <Stack gap="md" align="center">
        <Text c="dimmed" ta="center">
          {message ?? 'Space not found or you are not the author.'}
        </Text>
        <Button variant="light" onClick={onHome}>
          Start a new Drop
        </Button>
      </Stack>
    </Container>
  );
}

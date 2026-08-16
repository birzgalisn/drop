import { Text } from '../../text/feature/text';
import { useImageViewContext } from './image-view-context';

export function FileTableImageViewCaptionName() {
  const { active } = useImageViewContext();

  if (!active) {
    return null;
  }

  return (
    <Text variant="label" truncate>
      {active.name}
    </Text>
  );
}

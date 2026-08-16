import { Dates } from '@repo/shared';

import { Text } from '../../text/feature/text';
import { useImageViewContext } from './image-view-context';

export function FileTableImageViewCaptionDate() {
  const { active } = useImageViewContext();

  if (!active) {
    return null;
  }

  return <Text>{Dates.format(active.createdAt)}</Text>;
}

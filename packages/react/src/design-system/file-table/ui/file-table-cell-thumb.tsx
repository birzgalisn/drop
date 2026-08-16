import { Box } from '../../box/feature/box';
import { ProgressiveImage } from '../../media/feature/progressive-image';
import { MediaPlaceholder } from '../../media/ui/media-placeholder';

export function FileTableCellThumb({ src }: { src: string | null | undefined }) {
  if (!src) {
    return <MediaPlaceholder w={40} h={40} flex="none" aria-hidden />;
  }

  return (
    <Box pos="relative" w={40} h={40} flex="none">
      <ProgressiveImage src={src} alt="" />
    </Box>
  );
}

import { Box } from '../../box/feature/box';
import { Image, type ImageProps } from '../../image/feature/image';
import { getQrSvgDataUrl } from '../util/get-qr-svg-data-url';

export type QrCodeProps = Pick<ImageProps, 'alt'> & {
  data: string;
};

/** Square black-on-white QR. */
export function QrCode({ data, alt = 'QR code' }: QrCodeProps) {
  return (
    <Box flex="none">
      <Image src={getQrSvgDataUrl(data)} alt={alt} w="5.5rem" h="5.5rem" draggable={false} />
    </Box>
  );
}

import { Box } from '@mantine/core';

import { encode } from '../vendor/uqr';

const QR_SIZE_DEFAULT_PX = 112;
const QR_PIXEL_SIZE = 4;
const QR_BORDER = 2;
/** Corner radius as a fraction of module size — soft squares, still scannable. */
const QR_MODULE_RADIUS_RATIO = 0.32;
const WHITE = '#f6f1ea';
const BLACK = '#0b0d10';

const qrDataUrlCache = new Map<string, string>();

export interface QrCodeProps {
  /** Absolute URL to encode. */
  url: string;
  /** Display size in CSS pixels. Defaults to 112. */
  size?: number;
}

/** Rasterize once — hundreds of SVG rects stall page paints (e.g. file-row hover). */
function renderQrDataUrl(options: { url: string; size: number }): string {
  const { url, size } = options;
  const cacheKey = `${url}\0${size}`;
  const cached = qrDataUrlCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const result = encode(url, { ecc: 'M', border: QR_BORDER });
  const modules = result.size;
  const dim = modules * QR_PIXEL_SIZE;
  const radius = QR_PIXEL_SIZE * QR_MODULE_RADIUS_RATIO;
  const canvas = document.createElement('canvas');
  canvas.width = dim;
  canvas.height = dim;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return '';
  }

  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, dim, dim);
  ctx.fillStyle = BLACK;

  for (let row = 0; row < modules; row++) {
    const line = result.data[row];

    if (!line) {
      continue;
    }

    for (let col = 0; col < modules; col++) {
      if (!line[col]) {
        continue;
      }

      const x = col * QR_PIXEL_SIZE;
      const y = row * QR_PIXEL_SIZE;
      ctx.beginPath();
      ctx.roundRect(x, y, QR_PIXEL_SIZE, QR_PIXEL_SIZE, radius);
      ctx.fill();
    }
  }

  const dataUrl = canvas.toDataURL('image/png');
  qrDataUrlCache.set(cacheKey, dataUrl);

  return dataUrl;
}

/** Client-side QR code rasterized to PNG. */
export function QrCode({ url, size = QR_SIZE_DEFAULT_PX }: QrCodeProps) {
  const src = renderQrDataUrl({ url, size });

  return (
    <Box
      component="img"
      src={src}
      w={size}
      h={size}
      alt="QR code"
      style={{
        flexShrink: 0,
        display: 'block',
        borderRadius: 12,
      }}
    />
  );
}

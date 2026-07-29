import { registerAs } from '@nestjs/config';

import { mediaEnvSchema, type MediaEnvConfig } from './interfaces/media-env.interface';

export const mediaConfig = registerAs<MediaEnvConfig>('media', () => {
  const env = mediaEnvSchema.parse(process.env);

  return {
    root: env.MEDIA_ROOT,
    tusRoot: `${env.MEDIA_ROOT}/tus`,
  };
});

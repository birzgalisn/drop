import { z } from 'zod';

import { MediaConfig } from '../constants/media-config.constants';

export const mediaEnvSchema = z.object({
  MEDIA_ROOT: z.string().optional().default(MediaConfig.ROOT_DEFAULT),
});

export type MediaEnv = z.infer<typeof mediaEnvSchema>;

export interface MediaEnvConfig {
  /** Absolute path on disk where promoted (finished) media files live. */
  root: string;
  /** Absolute path on disk where tus stores in-progress uploads before promotion. */
  tusRoot: string;
}

export type MediaEnvNamespace = { media: MediaEnvConfig };

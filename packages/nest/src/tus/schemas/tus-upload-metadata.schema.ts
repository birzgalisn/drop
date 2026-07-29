import { uploadTypeSchema } from '@repo/shared';
import { z } from 'zod';

/** Every tus upload must declare which registry handler owns it. */
export const tusUploadMetadataSchema = z.object({
  uploadType: uploadTypeSchema,
});

export type TusUploadMetadata = z.infer<typeof tusUploadMetadataSchema>;

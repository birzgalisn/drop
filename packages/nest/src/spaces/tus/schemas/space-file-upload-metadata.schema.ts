import { spaceAcceptedMimeTypeSchema, UploadType } from '@repo/shared';
import { z } from 'zod';

/**
 * Tus metadata contract for space-file uploads. Extends the base `uploadType`
 * dispatch key with the space/file identity and declared mime so the hook can
 * validate against the DB row before a single byte is stored.
 */
export const spaceFileUploadMetadataSchema = z.object({
  uploadType: z.literal(UploadType.SpaceFile),
  spaceId: z.uuid(),
  fileId: z.uuid(),
  mimeType: spaceAcceptedMimeTypeSchema,
});

export type SpaceFileUploadMetadata = z.infer<typeof spaceFileUploadMetadataSchema>;

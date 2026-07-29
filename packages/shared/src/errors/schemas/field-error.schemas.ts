import { z } from 'zod';

import { AppErrorCode } from '../enums/app-error-code.enum';

/**
 * A single validation error tied to an input field.
 *
 * `path` mirrors the Zod issue path (dot-joined), which is intentionally kept
 * identical on both sides of the wire so the frontend can map it straight onto
 * a form field without any bespoke translation. An empty `path` denotes a
 * form-level (non-field) error.
 */
export const fieldErrorSchema = z.object({
  path: z.string(),
  message: z.string(),
});

export type FieldError = z.infer<typeof fieldErrorSchema>;

/**
 * The shape carried in a GraphQL error's `extensions` for any AppError.
 * This is the single contract shared between the API and the web client.
 */
export const appErrorExtensionsSchema = z.looseObject({
  code: z.enum(AppErrorCode),
  fieldErrors: z.array(fieldErrorSchema).optional(),
});

export type AppErrorExtensions = z.infer<typeof appErrorExtensionsSchema>;

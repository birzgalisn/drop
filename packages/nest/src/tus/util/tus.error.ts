import { AppError } from '@repo/shared';
import { z } from 'zod';

/** Error shape read by `@tus/server` from hook callbacks (`status_code`, `body`). */
export type TusErrorOptions = {
  statusCode: number;
  body: string;
  cause?: unknown;
};

export class TusError extends Error {
  readonly status_code: number;
  readonly body: string;

  constructor({ statusCode, body, cause }: TusErrorOptions) {
    super(body, cause ? { cause } : undefined);
    this.status_code = statusCode;
    this.body = body;
  }

  /** Maps a domain {@link AppError} onto the shape `@tus/server` understands. */
  static fromAppError(error: AppError): TusError {
    return new TusError({ statusCode: error.httpStatus, body: error.message, cause: error });
  }

  /**
   * Normalizes a thrown value into a {@link TusError} and throws it, so tus hooks
   * always report a consistent HTTP status/body. Mirrors the GraphQL boundary:
   * validation funnels through {@link AppError}, and anything else (including an
   * already-built TusError) bubbles up untouched.
   */
  static throw(error: unknown): never {
    if (error instanceof z.ZodError) {
      throw TusError.fromAppError(AppError.zod(error));
    }

    if (AppError.is(error)) {
      throw TusError.fromAppError(error);
    }

    throw error;
  }
}

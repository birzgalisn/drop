import { AppError, AppErrorCode, type AppErrorExtensions } from '@repo/shared';
import { GraphQLError } from 'graphql';

/**
 * Normalizes any thrown value into a {@link GraphQLError} with our error contract.
 *
 * - Existing GraphQLErrors pass through untouched.
 * - {@link import('@repo/shared').AppError}s are serialized with their `code`/`fieldErrors`.
 * - Everything else collapses to an opaque INTERNAL error (details are never
 *   leaked to the client; the original is attached for server-side logging).
 */
export class GraphqlErrorMapper {
  static from(exception: unknown): GraphQLError {
    if (exception instanceof GraphQLError) {
      return exception;
    }

    if (AppError.is(exception)) {
      const extensions: AppErrorExtensions = { code: exception.code };

      if (exception.fieldErrors && exception.fieldErrors.length > 0) {
        extensions.fieldErrors = exception.fieldErrors;
      }

      return new GraphQLError(exception.message, { extensions, originalError: exception });
    }

    return new GraphQLError('Internal server error', {
      extensions: { code: AppErrorCode.INTERNAL } satisfies AppErrorExtensions,
      originalError: exception instanceof Error ? exception : undefined,
    });
  }
}

import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { AppError, type FieldError } from '@repo/shared';

/**
 * Pulls our shared {@link FieldError} contract out of any error surfaced by
 * Apollo. GraphQL errors carry the AppError extensions the API attaches, so the
 * client can map validation failures straight onto form fields.
 */
export function getAppErrorFieldErrors(error: unknown): FieldError[] {
  if (!CombinedGraphQLErrors.is(error)) {
    return [];
  }

  return error.errors.flatMap((graphqlError) => {
    const extensions = AppError.parseExtensions(graphqlError.extensions);

    return extensions?.fieldErrors ?? [];
  });
}

/** Best-effort human-readable message for any error surfaced by Apollo. */
export function getAppErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const [first] = error.errors;

    if (first?.message) {
      return first.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

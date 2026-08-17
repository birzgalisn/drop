import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { AppError, AppErrorCodes, type FieldError } from '@repo/shared';

export class GraphqlErrors {
  private static readonly FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

  static fieldErrors(error: unknown): FieldError[] {
    return GraphqlErrors.unwrap(error).flatMap((graphqlError) => {
      const extensions = AppError.parseExtensions(graphqlError.extensions);

      return extensions?.fieldErrors ?? [];
    });
  }

  static message(error: unknown): string {
    const [first] = GraphqlErrors.unwrap(error);

    if (first?.message) {
      return first.message;
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return GraphqlErrors.FALLBACK_MESSAGE;
  }

  static httpStatus(error: unknown): number | undefined {
    const [first] = GraphqlErrors.unwrap(error);
    const extensions = AppError.parseExtensions(first?.extensions);

    if (!extensions) {
      return undefined;
    }

    return AppErrorCodes.HTTP_STATUS[extensions.code];
  }

  private static unwrap(error: unknown): CombinedGraphQLErrors['errors'] {
    if (!CombinedGraphQLErrors.is(error)) {
      return [];
    }

    return error.errors;
  }
}

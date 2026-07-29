import { type ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { type GqlContextType, GqlArgumentsHost } from '@nestjs/graphql';
import { AppError, AppErrorCode } from '@repo/shared';

import { GraphqlErrorMapper } from './util/graphql-error.util';

/**
 * Single boundary that turns thrown errors into a consistent client contract.
 *
 * Domain code stays framework-agnostic (it throws {@link AppError}); this
 * filter is the only place that knows about GraphQL, so adding a new error kind
 * never requires touching resolvers. Non-GraphQL transports map {@link AppError}
 * onto Nest HTTP exceptions, then fall back to Nest's default handling.
 */
@Catch()
export class GraphqlExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(GraphqlExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType<GqlContextType>() !== 'graphql') {
      super.catch(
        AppError.is(exception)
          ? new HttpException(exception.message, exception.httpStatus)
          : exception,
        host,
      );
      return;
    }

    const gqlError = GraphqlErrorMapper.from(exception);

    if (gqlError.extensions.code === AppErrorCode.INTERNAL && !AppError.is(exception)) {
      const gqlHost = GqlArgumentsHost.create(host);
      this.logger.error(
        `Unhandled error in ${gqlHost.getInfo<{ fieldName?: string }>()?.fieldName ?? 'GraphQL'}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    throw gqlError;
  }
}

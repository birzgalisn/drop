import { type ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { type GqlContextType, GqlArgumentsHost } from '@nestjs/graphql';
import { AppError, AppErrorCode } from '@repo/shared';

import { GraphqlErrorMapper } from './util/graphql-error.util';
import { HttpError } from './util/http-error';

@Catch()
export class GraphqlExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(GraphqlExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType<GqlContextType>() !== 'graphql') {
      super.catch(AppError.is(exception) ? HttpError.fromApp(exception) : exception, host);
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

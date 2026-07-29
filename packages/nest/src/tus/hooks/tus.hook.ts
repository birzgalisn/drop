import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppError } from '@repo/shared';
import { FileStore } from '@tus/file-store';
import { Server, type Upload } from '@tus/server';
import type { FastifyInstance } from 'fastify';

import type { TusUploadHandler } from '../interfaces/tus-handler.interface';
import type { TusOptions } from '../interfaces/tus.interface';
import { TusHandlerRegistry } from '../registry/tus-handler.registry';
import { tusUploadMetadataSchema } from '../schemas/tus-upload-metadata.schema';
import { TUS_OPTIONS } from '../tokens/tus.tokens';
import { TusError } from '../util/tus.error';

@Injectable()
export class TusHook implements OnModuleInit {
  private readonly logger = new Logger(TusHook.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly registry: TusHandlerRegistry,
    @Inject(TUS_OPTIONS) private readonly options: TusOptions,
  ) {}

  async onModuleInit() {
    const adapter = this.httpAdapterHost.httpAdapter;

    if (!(adapter instanceof FastifyAdapter)) {
      this.logger.warn(`Tus ${this.options.path} is only registered for Fastify`);
      return;
    }

    const server = new Server({
      path: this.options.path,
      datastore: new FileStore({ directory: this.options.root }),
      maxSize: this.options.maxUploadBytes,
      /**
       * Relative `Location` so the browser follows the same public host it used for `POST`
       * (avoids broken uploads when the API would otherwise emit an internal host behind a proxy).
       */
      relativeLocation: true,
      /**
       * Use `Forwarded` / `X-Forwarded-*` when building absolute URLs where the server still emits them.
       */
      respectForwardedHeaders: true,
      /**
       * Nest CORS does not apply after `reply.hijack()` — tus writes its own headers. Cookies
       * (author key) require credentials on create/PATCH responses, not only on OPTIONS.
       */
      allowedCredentials: true,
      onUploadCreate: async (req, upload) => {
        const handler = this.resolveHandler(upload);

        try {
          await handler.onUploadCreate?.(req, upload);
        } catch (err) {
          TusError.throw(err);
        }

        return {};
      },
      onUploadFinish: async (req, upload) => {
        const handler = this.resolveHandler(upload);

        try {
          await handler.onUploadFinish?.(req, upload);
        } catch (err) {
          TusError.throw(err);
        }

        return {};
      },
    });

    const fastify = adapter.getInstance<FastifyInstance>();
    const wildcard = `${this.options.path}/*`;

    fastify.addContentTypeParser('application/offset+octet-stream', (_request, _payload, done) =>
      done(null),
    );

    fastify.route({
      method: ['GET', 'POST', 'HEAD', 'PATCH', 'DELETE', 'OPTIONS'],
      url: this.options.path,
      handler: (request, reply) => {
        reply.hijack();
        void server.handle(request.raw, reply.raw);
      },
    });

    fastify.route({
      method: ['GET', 'POST', 'HEAD', 'PATCH', 'DELETE', 'OPTIONS'],
      url: wildcard,
      handler: (request, reply) => {
        reply.hijack();
        void server.handle(request.raw, reply.raw);
      },
    });

    this.logger.log(
      `Handling file uploads at ${this.options.path} (storage: ${this.options.root})`,
    );
  }

  /** Parses the `uploadType` metadata and looks up its registered handler, rejecting otherwise. */
  private resolveHandler(upload: Upload): TusUploadHandler {
    const metadataResult = tusUploadMetadataSchema.safeParse(upload.metadata ?? {});

    if (!metadataResult.success) {
      return TusError.throw(AppError.zod(metadataResult.error));
    }

    const handler = this.registry.get(metadataResult.data.uploadType);

    if (!handler) {
      return TusError.throw(
        AppError.badRequest(`No upload handler registered for "${metadataResult.data.uploadType}"`),
      );
    }

    return handler;
  }
}

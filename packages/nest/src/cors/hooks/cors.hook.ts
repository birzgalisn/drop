import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import type { CorsOptions } from '../interfaces/cors.interface';
import { CORS_OPTIONS } from '../tokens/cors.tokens';

@Injectable()
export class CorsHook implements OnModuleInit {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(CORS_OPTIONS) private readonly options: CorsOptions,
  ) {}

  onModuleInit() {
    const adapter = this.httpAdapterHost.httpAdapter;

    if (!adapter) {
      return;
    }

    adapter.enableCors(this.options);
  }
}

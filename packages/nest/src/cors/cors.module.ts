import { DynamicModule, Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { CorsHook } from './hooks/cors.hook';
import type { CorsRegisterAsyncOptions } from './interfaces/cors-register-async-options.interface';
import type { CorsOptions } from './interfaces/cors.interface';
import { CORS_OPTIONS } from './tokens/cors.tokens';

@Module({})
export class CorsModule {
  static registerAsync<TArgs extends readonly unknown[]>(
    asyncOptions: CorsRegisterAsyncOptions<TArgs>,
  ): DynamicModule {
    return {
      module: CorsModule,
      imports: asyncOptions.imports ?? [],
      providers: [
        ...(asyncOptions.providers ?? []),
        {
          provide: CORS_OPTIONS,
          inject: asyncOptions.inject ? [...asyncOptions.inject] : [],
          useFactory: asyncOptions.useFactory,
        },
        {
          provide: CorsHook,
          useFactory: (options: CorsOptions, httpAdapterHost: HttpAdapterHost) =>
            new CorsHook(httpAdapterHost, options),
          inject: [CORS_OPTIONS, HttpAdapterHost],
        },
      ],
    };
  }
}

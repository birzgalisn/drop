import { Module } from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { appConfig, NodeEnv } from '@repo/nest/config';
import { CorsHeaders, corsConfig, CorsModule } from '@repo/nest/cors';
import { DrizzleModule } from '@repo/nest/drizzle';
import { GraphqlExceptionFilter } from '@repo/nest/errors';
import { MediaModule, mediaConfig } from '@repo/nest/media';
import { PubSubModule } from '@repo/nest/pubsub';
import { TusConfig, TusModule } from '@repo/nest/tus';
import { SpaceConfig } from '@repo/shared';

import { GraphqlModule } from './graphql.module';

const appEnvFromConfig = appConfig.asProvider();
const corsEnvFromConfig = corsConfig.asProvider();
const mediaEnvFromConfig = mediaConfig.asProvider();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '../../.env.local', '.env'],
    }),
    CorsModule.registerAsync({
      imports: [...appEnvFromConfig.imports, ...corsEnvFromConfig.imports],
      inject: [...appEnvFromConfig.inject, ...corsEnvFromConfig.inject],
      useFactory: (app: ConfigType<typeof appConfig>, cors: ConfigType<typeof corsConfig>) => ({
        origin:
          app.nodeEnv === NodeEnv.PRODUCTION
            ? [`https://app.${cors.apex}`, `http://app.${cors.apex}`]
            : true,
        ...CorsHeaders.POLICY,
      }),
    }),
    DrizzleModule,
    MediaModule,
    PubSubModule,
    TusModule.registerAsync({
      imports: [...mediaEnvFromConfig.imports],
      inject: [...mediaEnvFromConfig.inject],
      useFactory: (media: ConfigType<typeof mediaConfig>) => ({
        root: media.tusRoot,
        path: TusConfig.PATH,
        maxUploadBytes: SpaceConfig.FILE_MAX_BYTES,
      }),
    }),
    GraphqlModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: GraphqlExceptionFilter }],
})
export class AppModule {}

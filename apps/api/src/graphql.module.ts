import path from 'node:path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { appConfig, NodeEnv } from '@repo/nest/config';
import { HealthModule } from '@repo/nest/health';
import { SpacesModule } from '@repo/nest/spaces';
import type { FastifyReply, FastifyRequest } from 'fastify';

const appEnvFromConfig = appConfig.asProvider();

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: appEnvFromConfig.imports,
      inject: appEnvFromConfig.inject,
      useFactory(app: ConfigType<typeof appConfig>) {
        const isDev = app.nodeEnv === NodeEnv.DEVELOPMENT;

        return {
          autoSchemaFile: isDev ? path.join(process.cwd(), 'src/_generated/schema.graphql') : true,
          sortSchema: isDev,
          playground: false,
          plugins: isDev ? [ApolloServerPluginLandingPageLocalDefault()] : [],
          /**
           * `@as-integrations/fastify` invokes the context function as
           * `(request, reply)`, so both the Fastify request (cookies in) and
           * reply (Set-Cookie out) are available to resolvers.
           */
          context: (req: FastifyRequest, reply: FastifyReply) => ({ req, reply }),
          subscriptions: {
            'graphql-ws': true,
          },
        };
      },
    }),
    HealthModule,
    SpacesModule,
  ],
})
export class GraphqlModule {}

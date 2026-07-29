import cookie from '@fastify/cookie';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SharpThreading } from '@repo/nest/media';
import 'reflect-metadata';

import { AppModule } from './app.module';

declare const module: {
  hot?: {
    accept: () => void | Promise<void>;
    dispose: (handler: () => void | Promise<void>) => void;
  };
};

async function bootstrap() {
  SharpThreading.configure();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true }),
  );

  await app.register(cookie);

  app.enableShutdownHooks();

  await app.listen(3000, '0.0.0.0');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

void bootstrap();

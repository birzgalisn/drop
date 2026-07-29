import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { printSchema } from 'graphql';

import { AppModule } from './app.module';

async function writeGraphqlSchema() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error'],
  });

  try {
    const gqlSchemaHost = app.get(GraphQLSchemaHost);
    const sdl = printSchema(gqlSchemaHost.schema);
    const outPath = path.join(process.cwd(), 'src/_generated/schema.graphql');

    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, `${sdl}\n`);
  } finally {
    await app.close();
  }
}

writeGraphqlSchema()
  .then(() => {
    // BullMQ / Redis clients can keep the event loop alive after schema write.
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

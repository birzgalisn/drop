import { registerAs } from '@nestjs/config';

import { drizzleEnvSchema, type DrizzleEnvConfig } from './interfaces/drizzle-env.interface';

export const drizzleConfig = registerAs<DrizzleEnvConfig>('drizzle', () => {
  const env = drizzleEnvSchema.parse(process.env);

  return {
    connectionString: env.DATABASE_URL,
  };
});

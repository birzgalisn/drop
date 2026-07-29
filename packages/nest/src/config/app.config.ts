import { registerAs } from '@nestjs/config';

import { appEnvSchema, type AppEnvConfig } from './interfaces/app-env.interface';

export const appConfig = registerAs<AppEnvConfig>('app', () => {
  const env = appEnvSchema.parse(process.env);

  return {
    nodeEnv: env.NODE_ENV,
  };
});

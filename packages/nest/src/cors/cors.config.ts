import { registerAs } from '@nestjs/config';

import { corsEnvSchema, type CorsEnvConfig } from './interfaces/cors-env.interface';

export const corsConfig = registerAs<CorsEnvConfig>('cors', () => {
  const env = corsEnvSchema.parse(process.env);

  return {
    apex: env.APEX,
  };
});

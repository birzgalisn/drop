import { z } from 'zod';

import { NodeEnv } from '../constants/node-env.constants';

export const appEnvSchema = z.object({
  NODE_ENV: z
    .enum([NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION, NodeEnv.TEST])
    .default(NodeEnv.DEVELOPMENT),
});

export type AppEnv = z.infer<typeof appEnvSchema>;

export interface AppEnvConfig {
  nodeEnv: AppEnv['NODE_ENV'];
}

export type AppEnvNamespace = { app: AppEnvConfig };

import { z } from 'zod';

export const corsEnvSchema = z.object({
  APEX: z.string().min(1),
});

export type CorsEnv = z.infer<typeof corsEnvSchema>;

export interface CorsEnvConfig {
  apex: string;
}

export type CorsEnvNamespace = { cors: CorsEnvConfig };

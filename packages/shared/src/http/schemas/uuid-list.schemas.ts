import { z } from 'zod';

export const uuidListSchema = z
  .string()
  .default('')
  .transform((value) => (value === '' ? [] : value.split(',')))
  .pipe(z.array(z.uuid()));

export type UuidList = z.infer<typeof uuidListSchema>;

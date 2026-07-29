import { z } from 'zod';

import { SpaceConfig } from '../constants/space-config.constants';

export const spaceSharePinSchema = z
  .string()
  .regex(
    new RegExp(`^\\d{${SpaceConfig.SHARE_PIN_LENGTH}}$`),
    `PIN must be ${SpaceConfig.SHARE_PIN_LENGTH} digits`,
  );

export const createShareInputSchema = z.object({
  spaceId: z.uuid(),
  expiryDays: z.literal(SpaceConfig.SHARE_EXPIRY_PRESETS_DAYS),
  pin: spaceSharePinSchema,
});

export type CreateShareInput = z.infer<typeof createShareInputSchema>;

export const createShareFormSchema = createShareInputSchema.omit({ spaceId: true });

export type CreateShareFormValues = z.infer<typeof createShareFormSchema>;

export const unlockShareInputSchema = z.object({
  token: z.string().min(1),
  pin: spaceSharePinSchema,
});

export type UnlockShareInput = z.infer<typeof unlockShareInputSchema>;

export const unlockShareFormSchema = unlockShareInputSchema.omit({ token: true });

export type UnlockShareFormValues = z.infer<typeof unlockShareFormSchema>;

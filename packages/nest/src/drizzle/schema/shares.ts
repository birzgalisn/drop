import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { spaces } from './spaces';

export const shares = pgTable('share', {
  id: uuid('id').primaryKey().defaultRandom(),
  spaceId: uuid('space_id')
    .notNull()
    .unique()
    .references(() => spaces.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { precision: 3, mode: 'date' }).notNull(),
  pinHash: text('pin_hash').notNull(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
});

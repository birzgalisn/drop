import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { SpaceStatus, spaceStatusEnum } from './enums';

export const spaces = pgTable('space', {
  id: uuid('id').primaryKey().defaultRandom(),
  status: spaceStatusEnum('status').notNull().default(SpaceStatus.DRAFT),
  authorKey: text('author_key').notNull(),
  ownerUserId: text('owner_user_id'),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
});

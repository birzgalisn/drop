import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { SpaceFileStatus, spaceFileStatusEnum } from './enums';
import { spaces } from './spaces';

export const spaceFiles = pgTable(
  'space_file',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    spaceId: uuid('space_id')
      .notNull()
      .references(() => spaces.id, { onDelete: 'cascade' }),
    originalName: text('original_name').notNull(),
    mimeType: text('mime_type').notNull(),
    byteSize: integer('byte_size').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    storageKey: text('storage_key').unique(),
    status: spaceFileStatusEnum('status').notNull().default(SpaceFileStatus.PENDING),
    thumbKey: text('thumb_key'),
    previewKey: text('preview_key'),
    createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  },
  (t) => [index('space_file_space_id_index').on(t.spaceId)],
);

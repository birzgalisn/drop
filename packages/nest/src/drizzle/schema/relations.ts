import { relations } from 'drizzle-orm';

import { shares } from './shares';
import { spaceFiles } from './space-files';
import { spaces } from './spaces';

export const spacesRelations = relations(spaces, ({ many, one }) => ({
  files: many(spaceFiles),
  share: one(shares),
}));

export const spaceFilesRelations = relations(spaceFiles, ({ one }) => ({
  space: one(spaces, { fields: [spaceFiles.spaceId], references: [spaces.id] }),
}));

export const sharesRelations = relations(shares, ({ one }) => ({
  space: one(spaces, { fields: [shares.spaceId], references: [spaces.id] }),
}));

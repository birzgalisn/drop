import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { NodePgDatabase, NodePgTransaction } from 'drizzle-orm/node-postgres';

import type * as schema from '../schema';

type Schema = typeof schema;
type SchemaRelations = ExtractTablesWithRelations<Schema>;

/** Module-level Drizzle handle (`DrizzleService.db`). */
export type DrizzleDatabase = NodePgDatabase<Schema>;

/** `db.transaction((tx) => …)` callback handle. */
export type DrizzleTransaction = NodePgTransaction<Schema, SchemaRelations>;

/**
 * Either the module db or a transaction — use-cases accept this so they can
 * run standalone or nested inside a caller-owned `transaction`.
 */
export type DrizzleClient = DrizzleDatabase | DrizzleTransaction;

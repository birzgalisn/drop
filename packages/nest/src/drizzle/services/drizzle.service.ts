import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { drizzleConfig } from '../drizzle.config';
import type { DrizzleClient } from '../interfaces/drizzle-client.interface';
import * as schema from '../schema';

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  private readonly pool: Pool;
  readonly db: ReturnType<typeof drizzle<typeof schema>>;

  constructor(@Inject(drizzleConfig.KEY) config: ConfigType<typeof drizzleConfig>) {
    this.pool = new Pool({ connectionString: config.connectionString });
    this.db = drizzle({ client: this.pool, schema });
  }

  /** Prefer a caller-owned tx when present; otherwise the module-level db. */
  client(tx?: DrizzleClient): DrizzleClient {
    return tx ?? this.db;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async ping(): Promise<void> {
    await this.pool.query('SELECT 1');
  }
}

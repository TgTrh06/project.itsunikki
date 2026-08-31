import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from './schema';

export type TrackerDatabase = NodePgDatabase<typeof schema>;

export function databaseSslConfig(environment: NodeJS.ProcessEnv = process.env) {
  const certificateAuthority = environment.DATABASE_SSL_CA?.replace(/\\n/g, '\n');
  if (certificateAuthority) return { ca: certificateAuthority, rejectUnauthorized: true };
  return environment.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined;
}

@Injectable()
export class PostgresDatabase implements OnModuleDestroy {
  private readonly pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5, ssl: databaseSslConfig() });

  async withAccount<T>(accountId: string, operation: (database: TrackerDatabase) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query("SELECT set_config('request.account_id', $1, true)", [accountId]);
      const result = await operation(drizzle(client, { schema }));
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }
  async onModuleDestroy() { await this.pool.end(); }
}

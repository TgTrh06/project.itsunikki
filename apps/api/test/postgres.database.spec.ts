import { databaseSslConfig } from '../src/infrastructure/persistence/postgres/postgres.database';

describe('databaseSslConfig', () => {
  it('uses the configured Supabase CA and verifies the server certificate', () => {
    expect(databaseSslConfig({ NODE_ENV: 'production', DATABASE_SSL_CA: 'first\\nsecond' })).toEqual({
      ca: 'first\nsecond',
      rejectUnauthorized: true,
    });
  });

  it('fails closed for production when a CA is absent', () => {
    expect(databaseSslConfig({ NODE_ENV: 'production' })).toEqual({ rejectUnauthorized: true });
  });
});

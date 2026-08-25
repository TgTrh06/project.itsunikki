import { PostgresTrackerRepository } from '../src/infrastructure/persistence/postgres/postgres-tracker.repository';

describe('PostgresTrackerRepository ownership boundary', () => {
  it('rejects malformed resource IDs before a database operation can escape account scope', async () => {
    const withAccount = jest.fn();
    const repository = new PostgresTrackerRepository({ withAccount } as never);

    expect(() => repository.updateTask('account-a', 'not-a-uuid', { completed: true }, 'corr')).toThrow('Task not found.');
    expect(withAccount).not.toHaveBeenCalled();
  });
});

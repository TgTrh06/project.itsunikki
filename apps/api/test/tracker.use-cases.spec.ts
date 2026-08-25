import { TrackerUseCases } from '../src/application/tracker/tracker.use-cases';

describe('TrackerUseCases', () => {
  it('passes the authenticated account to the repository for a task update', async () => {
    const repository = { updateTask: jest.fn().mockResolvedValue({}) };
    const useCases = new TrackerUseCases(repository as never);
    await useCases.updateTask('account-a', 'task-a', { completed: true }, 'corr');
    expect(repository.updateTask).toHaveBeenCalledWith('account-a', 'task-a', { completed: true }, 'corr');
  });
});

import { TrackerService } from '../src/tracker/tracker.service';

describe('TrackerService ownership boundary', () => {
  it('includes the authenticated account in an update query', async () => {
    const findOneAndUpdate = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011' }) });
    const audit = { accepted: jest.fn() };
    const service = new TrackerService({} as never, { findOneAndUpdate } as never, {} as never, {} as never, {} as never, audit as never);
    await service.updateTask('account-a', '507f1f77bcf86cd799439011', { completed: true }, 'corr');
    expect(findOneAndUpdate).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439011', accountId: 'account-a' }, { $set: { completed: true } }, { new: true });
  });
});

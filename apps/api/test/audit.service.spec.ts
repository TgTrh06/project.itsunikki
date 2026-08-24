import { AuditService } from '../src/tracker/audit.service';

describe('AuditService', () => {
  it('persists only minimal audit metadata', async () => {
    const create = jest.fn().mockResolvedValue({});
    const service = new AuditService({ create } as never);
    await service.accepted('account-1', 'food.created', 'food', 'food-1', 'corr-1');
    expect(create).toHaveBeenCalledWith({ actorId: 'account-1', action: 'food.created', resourceType: 'food', resourceId: 'food-1', outcome: 'accepted', correlationId: 'corr-1' });
  });
});

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseAuthGuard } from '../src/auth/supabase-auth.guard';

const contextFor = (authorization?: string) => {
  const request = { headers: { authorization } };
  return { switchToHttp: () => ({ getRequest: () => request }) } as unknown as ExecutionContext;
};

describe('SupabaseAuthGuard', () => {
  it('rejects a request without a bearer token', async () => {
    const guard = new SupabaseAuthGuard({ verify: jest.fn() } as never);
    await expect(guard.canActivate(contextFor())).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it('derives the account only from the verified token subject', async () => {
    const verify = jest.fn().mockResolvedValue({ sub: 'account-1' });
    const guard = new SupabaseAuthGuard({ verify } as never);
    await expect(guard.canActivate(contextFor('Bearer token'))).resolves.toBe(true);
    expect(verify).toHaveBeenCalledWith('token');
  });
});

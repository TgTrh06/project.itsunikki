import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { SupabaseAuthService } from './supabase-auth.service';

export interface AuthenticatedRequest extends Request { accountId?: string; correlationId?: string; }

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly auth: SupabaseAuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedException('Sign in is required.');
    const payload = await this.auth.verify(header.slice(7));
    if (!payload.sub) throw new UnauthorizedException('Your session is invalid or has expired. Sign in again.');
    request.accountId = payload.sub;
    request.correlationId = request.headers['x-correlation-id']?.toString() ?? crypto.randomUUID();
    return true;
  }
}

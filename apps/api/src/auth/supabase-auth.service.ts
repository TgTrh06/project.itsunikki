import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

@Injectable()
export class SupabaseAuthService {
  private readonly issuer = process.env.SUPABASE_JWT_ISSUER;
  private readonly jwks = this.issuer ? createRemoteJWKSet(new URL(`${this.issuer}/.well-known/jwks.json`)) : undefined;

  async verify(token: string): Promise<JWTPayload> {
    if (!this.issuer || !this.jwks) throw new ServiceUnavailableException('Authentication is not configured.');
    try {
      return (await jwtVerify(token, this.jwks, { issuer: this.issuer })).payload;
    } catch {
      throw new UnauthorizedException('Your session is invalid or has expired. Sign in again.');
    }
  }
}

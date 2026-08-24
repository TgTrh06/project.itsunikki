import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditEvent } from './schemas';

@Injectable()
export class AuditService {
  constructor(@InjectModel(AuditEvent.name) private readonly events: Model<AuditEvent>) {}
  async accepted(actorId: string, action: string, resourceType: string, resourceId: string, correlationId: string) {
    await this.events.create({ actorId, action, resourceType, resourceId, outcome: 'accepted', correlationId });
  }
}

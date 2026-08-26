import { Module } from '@nestjs/common';
import { TrackerController } from './tracker.controller';
import { TRACKER_REPOSITORY } from '../domain/tracker/tracker-repository.port';
import { TrackerUseCases } from '../application/tracker/tracker.use-cases';
import { PostgresDatabase } from '../infrastructure/persistence/postgres/postgres.database';
import { PostgresTrackerRepository } from '../infrastructure/persistence/postgres/postgres-tracker.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TrackerController],
  providers: [
    PostgresDatabase,
    PostgresTrackerRepository,
    { provide: TRACKER_REPOSITORY, useExisting: PostgresTrackerRepository },
    { provide: TrackerUseCases, useFactory: (repository: PostgresTrackerRepository) => new TrackerUseCases(repository), inject: [TRACKER_REPOSITORY] },
  ],
})
export class TrackerModule {}

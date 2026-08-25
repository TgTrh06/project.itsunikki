import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditService } from './audit.service';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
import { AuditEvent, AuditEventSchema, FoodEntry, FoodEntrySchema, Habit, HabitSchema, Profile, ProfileSchema, Task, TaskSchema, Workout, WorkoutSchema } from './schemas';
import { TRACKER_REPOSITORY } from '../domain/tracker/tracker-repository.port';
import { TrackerUseCases } from '../application/tracker/tracker.use-cases';
import { LegacyTrackerRepository } from '../infrastructure/persistence/mongoose/legacy-tracker.repository';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Profile.name, schema: ProfileSchema }, { name: Task.name, schema: TaskSchema },
    { name: Habit.name, schema: HabitSchema }, { name: Workout.name, schema: WorkoutSchema },
    { name: FoodEntry.name, schema: FoodEntrySchema }, { name: AuditEvent.name, schema: AuditEventSchema },
  ])],
  controllers: [TrackerController],
  providers: [
    TrackerService, AuditService, LegacyTrackerRepository,
    { provide: TRACKER_REPOSITORY, useExisting: LegacyTrackerRepository },
    { provide: TrackerUseCases, useFactory: (repository: LegacyTrackerRepository) => new TrackerUseCases(repository), inject: [TRACKER_REPOSITORY] },
  ],
})
export class TrackerModule {}

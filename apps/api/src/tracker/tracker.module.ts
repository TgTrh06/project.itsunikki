import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditService } from './audit.service';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
import { AuditEvent, AuditEventSchema, FoodEntry, FoodEntrySchema, Habit, HabitSchema, Profile, ProfileSchema, Task, TaskSchema, Workout, WorkoutSchema } from './schemas';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Profile.name, schema: ProfileSchema }, { name: Task.name, schema: TaskSchema },
    { name: Habit.name, schema: HabitSchema }, { name: Workout.name, schema: WorkoutSchema },
    { name: FoodEntry.name, schema: FoodEntrySchema }, { name: AuditEvent.name, schema: AuditEventSchema },
  ])],
  controllers: [TrackerController], providers: [TrackerService, AuditService],
})
export class TrackerModule {}

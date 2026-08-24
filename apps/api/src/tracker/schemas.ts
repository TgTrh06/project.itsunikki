import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Profile {
  @Prop({ required: true, unique: true, index: true }) accountId!: string;
  @Prop({ required: true, default: 'UTC' }) timezone!: string;
}
export type ProfileDocument = HydratedDocument<Profile>;
export const ProfileSchema = SchemaFactory.createForClass(Profile);

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, index: true }) accountId!: string;
  @Prop({ required: true, trim: true }) title!: string;
  @Prop({ required: true }) dueDate!: Date;
  @Prop({ enum: ['none', 'daily', 'weekly'], default: 'none' }) recurrence!: string;
  @Prop({ default: false }) completed!: boolean;
}
export type TaskDocument = HydratedDocument<Task>;
export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ accountId: 1, dueDate: 1 });

@Schema({ timestamps: true })
export class Habit {
  @Prop({ required: true, index: true }) accountId!: string;
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ min: 1, default: 1 }) target!: number;
  @Prop({ enum: ['daily', 'weekly'], default: 'daily' }) frequency!: string;
  @Prop({ type: [String], default: [] }) checkIns!: string[];
}
export type HabitDocument = HydratedDocument<Habit>;
export const HabitSchema = SchemaFactory.createForClass(Habit);

@Schema({ timestamps: true })
export class Workout {
  @Prop({ required: true, index: true }) accountId!: string;
  @Prop({ required: true, trim: true }) activity!: string;
  @Prop({ required: true }) performedAt!: Date;
  @Prop({ min: 0 }) durationMinutes!: number;
  @Prop({ type: Map, of: Number, default: {} }) metrics!: Record<string, number>;
}
export type WorkoutDocument = HydratedDocument<Workout>;
export const WorkoutSchema = SchemaFactory.createForClass(Workout);
WorkoutSchema.index({ accountId: 1, performedAt: -1 });

@Schema({ timestamps: true })
export class FoodEntry {
  @Prop({ required: true, index: true }) accountId!: string;
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, enum: ['breakfast', 'lunch', 'dinner', 'snack'] }) meal!: string;
  @Prop({ required: true, min: 0 }) kcal!: number;
  @Prop({ required: true, min: 0 }) carbohydrates!: number;
  @Prop({ required: true, min: 0 }) fat!: number;
  @Prop({ required: true, min: 0 }) protein!: number;
  @Prop({ required: true }) occurredAt!: Date;
  @Prop({ type: Map, of: Number, default: {} }) metrics!: Record<string, number>;
}
export type FoodEntryDocument = HydratedDocument<FoodEntry>;
export const FoodEntrySchema = SchemaFactory.createForClass(FoodEntry);
FoodEntrySchema.index({ accountId: 1, occurredAt: -1 });

@Schema({ timestamps: true })
export class AuditEvent {
  @Prop({ required: true, index: true }) actorId!: string;
  @Prop({ required: true }) action!: string;
  @Prop({ required: true }) resourceType!: string;
  @Prop({ required: true }) resourceId!: string;
  @Prop({ required: true }) outcome!: 'accepted' | 'denied';
  @Prop({ required: true }) correlationId!: string;
}
export const AuditEventSchema = SchemaFactory.createForClass(AuditEvent);

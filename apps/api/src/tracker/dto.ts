import { Type } from 'class-transformer';
import { IsDate, IsIn, IsInt, IsISO8601, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class ProfileDto { @IsString() @IsNotEmpty() @MaxLength(64) timezone!: string; }
export class TaskDto {
  @IsString() @IsNotEmpty() @MaxLength(160) title!: string;
  @Type(() => Date) @IsDate() dueDate!: Date;
  @IsOptional() @IsIn(['none', 'daily', 'weekly']) recurrence?: string;
  @IsOptional() completed?: boolean;
}
export class UpdateTaskDto extends PartialType(TaskDto) {}
export class HabitDto {
  @IsString() @IsNotEmpty() @MaxLength(120) name!: string;
  @IsInt() @Min(1) target!: number;
  @IsIn(['daily', 'weekly']) frequency!: string;
}
export class UpdateHabitDto extends PartialType(HabitDto) {}
export class CheckInDto { @IsISO8601() date!: string; }
export class WorkoutDto {
  @IsString() @IsNotEmpty() @MaxLength(120) activity!: string;
  @Type(() => Date) @IsDate() performedAt!: Date;
  @IsInt() @Min(0) durationMinutes!: number;
  @IsOptional() @IsObject() metrics?: Record<string, number>;
}
export class UpdateWorkoutDto extends PartialType(WorkoutDto) {}
export class FoodDto {
  @IsString() @IsNotEmpty() @MaxLength(160) name!: string;
  @IsIn(['breakfast', 'lunch', 'dinner', 'snack']) meal!: string;
  @IsNumber() @Min(0) kcal!: number;
  @IsNumber() @Min(0) carbohydrates!: number;
  @IsNumber() @Min(0) fat!: number;
  @IsNumber() @Min(0) protein!: number;
  @Type(() => Date) @IsDate() occurredAt!: Date;
  @IsOptional() @IsObject() metrics?: Record<string, number>;
}
export class UpdateFoodDto extends PartialType(FoodDto) {}

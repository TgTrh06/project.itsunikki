import { z } from 'zod';

export const profileSchema = z.object({ timezone: z.string().min(1).max(64) });
export const taskSchema = z.object({ title: z.string().min(1).max(160), dueDate: z.string().min(1), recurrence: z.literal('none') });
export const habitSchema = z.object({ name: z.string().min(1).max(120), target: z.number().int().min(1), frequency: z.literal('daily') });
export const workoutSchema = z.object({ activity: z.string().min(1).max(120), durationMinutes: z.number().int().min(0), performedAt: z.string().datetime() });
export const foodSchema = z.object({ name: z.string().min(1).max(160), kcal: z.number().min(0), carbohydrates: z.number().min(0), fat: z.number().min(0), protein: z.number().min(0), meal: z.literal('snack'), occurredAt: z.string().datetime() });

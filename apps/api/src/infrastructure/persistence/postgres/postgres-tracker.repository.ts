import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { TrackerRepository } from '../../../domain/tracker/tracker-repository.port';
import { PostgresDatabase, TrackerDatabase } from './postgres.database';
import { auditEvents, foodEntries, habits, profiles, tasks, workouts } from './schema';

type Values = Record<string, unknown>;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class PostgresTrackerRepository implements TrackerRepository {
  constructor(@Inject(PostgresDatabase) private readonly database: PostgresDatabase) {}

  profile(accountId: string) { return this.database.withAccount(accountId, async (db) => (await db.select().from(profiles).where(eq(profiles.accountId, accountId)))[0]); }
  updateProfile(accountId: string, data: object, correlationId: string) {
    const timezone = (data as Values).timezone as string;
    return this.database.withAccount(accountId, async (db) => {
      const [profile] = await db.insert(profiles).values({ accountId, timezone }).onConflictDoUpdate({ target: profiles.accountId, set: { timezone, updatedAt: new Date() } }).returning();
      await this.audit(db, accountId, 'profile.updated', 'profile', accountId, correlationId); return profile;
    });
  }
  listTasks(accountId: string) { return this.database.withAccount(accountId, (db) => db.select().from(tasks).where(eq(tasks.accountId, accountId)).orderBy(asc(tasks.dueDate))); }
  createTask(accountId: string, data: object, correlationId: string) { return this.create(tasks, accountId, data as Values, correlationId, 'task', 'created'); }
  updateTask(accountId: string, id: string, data: object, correlationId: string) { return this.update(tasks, accountId, id, data as Values, correlationId, 'task'); }
  deleteTask(accountId: string, id: string, correlationId: string) { return this.remove(tasks, accountId, id, correlationId, 'task'); }

  listHabits(accountId: string) { return this.database.withAccount(accountId, (db) => db.select().from(habits).where(eq(habits.accountId, accountId)).orderBy(asc(habits.createdAt))); }
  createHabit(accountId: string, data: object, correlationId: string) { return this.create(habits, accountId, data as Values, correlationId, 'habit', 'created'); }
  updateHabit(accountId: string, id: string, data: object, correlationId: string) { return this.update(habits, accountId, id, data as Values, correlationId, 'habit'); }
  deleteHabit(accountId: string, id: string, correlationId: string) { return this.remove(habits, accountId, id, correlationId, 'habit'); }
  checkInHabit(accountId: string, id: string, date: string, correlationId: string) {
    this.assertId(id, 'Habit');
    return this.database.withAccount(accountId, async (db) => {
      const [habit] = await db.update(habits).set({ checkIns: sql`CASE WHEN ${date}::date = ANY(${habits.checkIns}) THEN ${habits.checkIns} ELSE array_append(${habits.checkIns}, ${date}::date) END`, updatedAt: new Date() }).where(and(eq(habits.id, id), eq(habits.accountId, accountId))).returning();
      if (!habit) throw new NotFoundException('Habit not found.'); await this.audit(db, accountId, 'habit.checked_in', 'habit', id, correlationId); return habit;
    });
  }

  listWorkouts(accountId: string) { return this.database.withAccount(accountId, (db) => db.select().from(workouts).where(eq(workouts.accountId, accountId)).orderBy(desc(workouts.performedAt))); }
  createWorkout(accountId: string, data: object, correlationId: string) { return this.create(workouts, accountId, data as Values, correlationId, 'workout', 'created'); }
  updateWorkout(accountId: string, id: string, data: object, correlationId: string) { return this.update(workouts, accountId, id, data as Values, correlationId, 'workout'); }
  deleteWorkout(accountId: string, id: string, correlationId: string) { return this.remove(workouts, accountId, id, correlationId, 'workout'); }

  listFoods(accountId: string) { return this.database.withAccount(accountId, (db) => db.select().from(foodEntries).where(eq(foodEntries.accountId, accountId)).orderBy(desc(foodEntries.occurredAt))); }
  createFood(accountId: string, data: object, correlationId: string) { return this.create(foodEntries, accountId, data as Values, correlationId, 'food', 'created'); }
  updateFood(accountId: string, id: string, data: object, correlationId: string) { return this.update(foodEntries, accountId, id, data as Values, correlationId, 'food'); }
  deleteFood(accountId: string, id: string, correlationId: string) { return this.remove(foodEntries, accountId, id, correlationId, 'food'); }

  async dashboard(accountId: string) {
    const [tasks, habits, workouts, foods] = await Promise.all([this.listTasks(accountId), this.listHabits(accountId), this.listWorkouts(accountId), this.listFoods(accountId)]);
    const nutrition = foods.reduce((sum, food) => ({ kcal: sum.kcal + food.kcal, carbohydrates: sum.carbohydrates + food.carbohydrates, fat: sum.fat + food.fat, protein: sum.protein + food.protein }), { kcal: 0, carbohydrates: 0, fat: 0, protein: 0 });
    return { tasks, habits, workouts, nutrition };
  }

  private create(table: typeof tasks | typeof habits | typeof workouts | typeof foodEntries, accountId: string, values: Values, correlationId: string, resource: string, action: string) {
    return this.database.withAccount(accountId, async (db) => {
      const [value] = await db.insert(table).values({ ...values, accountId } as never).returning();
      await this.audit(db, accountId, `${resource}.${action}`, resource, value.id, correlationId); return value;
    });
  }
  private update(table: typeof tasks | typeof habits | typeof workouts | typeof foodEntries, accountId: string, id: string, values: Values, correlationId: string, resource: string) {
    this.assertId(id, resource[0].toUpperCase() + resource.slice(1));
    return this.database.withAccount(accountId, async (db) => {
      const [value] = await db.update(table).set({ ...values, updatedAt: new Date() } as never).where(and(eq(table.id, id), eq(table.accountId, accountId))).returning();
      if (!value) throw new NotFoundException(`${resource} not found.`); await this.audit(db, accountId, `${resource}.updated`, resource, id, correlationId); return value;
    });
  }
  private remove(table: typeof tasks | typeof habits | typeof workouts | typeof foodEntries, accountId: string, id: string, correlationId: string, resource: string) {
    this.assertId(id, resource[0].toUpperCase() + resource.slice(1));
    return this.database.withAccount(accountId, async (db) => {
      const [value] = await db.delete(table).where(and(eq(table.id, id), eq(table.accountId, accountId))).returning({ id: table.id });
      if (!value) throw new NotFoundException(`${resource} not found.`); await this.audit(db, accountId, `${resource}.deleted`, resource, id, correlationId);
    });
  }
  private audit(db: TrackerDatabase, actorId: string, action: string, resourceType: string, resourceId: string, correlationId: string) { return db.insert(auditEvents).values({ actorId, action, resourceType, resourceId, outcome: 'accepted', correlationId }); }
  private assertId(id: string, resource: string) { if (!UUID.test(id)) throw new NotFoundException(`${resource} not found.`); }
}

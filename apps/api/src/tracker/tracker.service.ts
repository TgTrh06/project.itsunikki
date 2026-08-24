import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditService } from './audit.service';
import { FoodDto, HabitDto, ProfileDto, TaskDto, WorkoutDto } from './dto';
import { FoodEntry, Habit, Profile, Task, Workout } from './schemas';

@Injectable()
export class TrackerService {
  constructor(
    @InjectModel(Profile.name) private readonly profiles: Model<Profile>,
    @InjectModel(Task.name) private readonly tasks: Model<Task>,
    @InjectModel(Habit.name) private readonly habits: Model<Habit>,
    @InjectModel(Workout.name) private readonly workouts: Model<Workout>,
    @InjectModel(FoodEntry.name) private readonly foods: Model<FoodEntry>,
    private readonly audit: AuditService,
  ) {}

  profile(accountId: string) { return this.profiles.findOne({ accountId }).lean(); }
  async updateProfile(accountId: string, dto: ProfileDto, correlationId: string) {
    const value = await this.profiles.findOneAndUpdate({ accountId }, { $set: dto }, { upsert: true, new: true }).lean();
    await this.audit.accepted(accountId, 'profile.updated', 'profile', accountId, correlationId); return value;
  }
  listTasks(accountId: string) { return this.tasks.find({ accountId }).sort({ dueDate: 1 }).lean(); }
  async createTask(accountId: string, dto: TaskDto, correlationId: string) { const value = await this.tasks.create({ accountId, ...dto, recurrence: dto.recurrence ?? 'none' }); await this.audit.accepted(accountId, 'task.created', 'task', value.id, correlationId); return value; }
  async updateTask(accountId: string, id: string, dto: Partial<TaskDto>, correlationId: string) { const value = await this.tasks.findOneAndUpdate(this.owned(id, accountId), { $set: dto }, { new: true }).lean(); if (!value) throw new NotFoundException('Task not found.'); await this.audit.accepted(accountId, 'task.updated', 'task', id, correlationId); return value; }
  async deleteTask(accountId: string, id: string, correlationId: string) { const value = await this.tasks.findOneAndDelete(this.owned(id, accountId)); if (!value) throw new NotFoundException('Task not found.'); await this.audit.accepted(accountId, 'task.deleted', 'task', id, correlationId); }
  listHabits(accountId: string) { return this.habits.find({ accountId }).lean(); }
  async createHabit(accountId: string, dto: HabitDto, correlationId: string) { const value = await this.habits.create({ accountId, ...dto }); await this.audit.accepted(accountId, 'habit.created', 'habit', value.id, correlationId); return value; }
  async updateHabit(accountId: string, id: string, dto: Partial<HabitDto>, correlationId: string) { return this.updateOwned(this.habits, accountId, id, dto, 'habit', correlationId); }
  async deleteHabit(accountId: string, id: string, correlationId: string) { return this.deleteOwned(this.habits, accountId, id, 'habit', correlationId); }
  async checkInHabit(accountId: string, id: string, date: string, correlationId: string) { const value = await this.habits.findOneAndUpdate(this.owned(id, accountId), { $addToSet: { checkIns: date } }, { new: true }).lean(); if (!value) throw new NotFoundException('Habit not found.'); await this.audit.accepted(accountId, 'habit.checked_in', 'habit', id, correlationId); return value; }
  listWorkouts(accountId: string) { return this.workouts.find({ accountId }).sort({ performedAt: -1 }).lean(); }
  async createWorkout(accountId: string, dto: WorkoutDto, correlationId: string) { const value = await this.workouts.create({ accountId, ...dto }); await this.audit.accepted(accountId, 'workout.created', 'workout', value.id, correlationId); return value; }
  async updateWorkout(accountId: string, id: string, dto: Partial<WorkoutDto>, correlationId: string) { return this.updateOwned(this.workouts, accountId, id, dto, 'workout', correlationId); }
  async deleteWorkout(accountId: string, id: string, correlationId: string) { return this.deleteOwned(this.workouts, accountId, id, 'workout', correlationId); }
  listFoods(accountId: string) { return this.foods.find({ accountId }).sort({ occurredAt: -1 }).lean(); }
  async createFood(accountId: string, dto: FoodDto, correlationId: string) { const value = await this.foods.create({ accountId, ...dto }); await this.audit.accepted(accountId, 'food.created', 'food', value.id, correlationId); return value; }
  async updateFood(accountId: string, id: string, dto: Partial<FoodDto>, correlationId: string) { return this.updateOwned(this.foods, accountId, id, dto, 'food', correlationId); }
  async deleteFood(accountId: string, id: string, correlationId: string) { return this.deleteOwned(this.foods, accountId, id, 'food', correlationId); }
  async dashboard(accountId: string) { const [tasks, habits, workouts, foods] = await Promise.all([this.listTasks(accountId), this.listHabits(accountId), this.listWorkouts(accountId), this.listFoods(accountId)]); const nutrition = foods.reduce((sum, food) => ({ kcal: sum.kcal + food.kcal, carbohydrates: sum.carbohydrates + food.carbohydrates, fat: sum.fat + food.fat, protein: sum.protein + food.protein }), { kcal: 0, carbohydrates: 0, fat: 0, protein: 0 }); return { tasks, habits, workouts, nutrition }; }
  private owned(id: string, accountId: string) { if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Record not found.'); return { _id: id, accountId }; }
  private async updateOwned(model: Model<any>, accountId: string, id: string, dto: object, resource: string, correlationId: string) { const value = await model.findOneAndUpdate(this.owned(id, accountId), { $set: dto }, { new: true }).lean(); if (!value) throw new NotFoundException(`${resource} not found.`); await this.audit.accepted(accountId, `${resource}.updated`, resource, id, correlationId); return value; }
  private async deleteOwned(model: Model<any>, accountId: string, id: string, resource: string, correlationId: string) { const value = await model.findOneAndDelete(this.owned(id, accountId)); if (!value) throw new NotFoundException(`${resource} not found.`); await this.audit.accepted(accountId, `${resource}.deleted`, resource, id, correlationId); }
}

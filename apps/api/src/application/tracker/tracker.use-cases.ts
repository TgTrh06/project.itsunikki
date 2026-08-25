import type { TrackerRepository } from '../../domain/tracker/tracker-repository.port';

export class TrackerUseCases {
  constructor(private readonly repository: TrackerRepository) {}
  profile(accountId: string) { return this.repository.profile(accountId); }
  updateProfile(accountId: string, dto: object, correlationId: string) { return this.repository.updateProfile(accountId, dto, correlationId); }
  listTasks(accountId: string) { return this.repository.listTasks(accountId); }
  createTask(accountId: string, dto: object, correlationId: string) { return this.repository.createTask(accountId, dto, correlationId); }
  updateTask(accountId: string, id: string, dto: object, correlationId: string) { return this.repository.updateTask(accountId, id, dto, correlationId); }
  deleteTask(accountId: string, id: string, correlationId: string) { return this.repository.deleteTask(accountId, id, correlationId); }
  listHabits(accountId: string) { return this.repository.listHabits(accountId); }
  createHabit(accountId: string, dto: object, correlationId: string) { return this.repository.createHabit(accountId, dto, correlationId); }
  updateHabit(accountId: string, id: string, dto: object, correlationId: string) { return this.repository.updateHabit(accountId, id, dto, correlationId); }
  deleteHabit(accountId: string, id: string, correlationId: string) { return this.repository.deleteHabit(accountId, id, correlationId); }
  checkInHabit(accountId: string, id: string, date: string, correlationId: string) { return this.repository.checkInHabit(accountId, id, date, correlationId); }
  listWorkouts(accountId: string) { return this.repository.listWorkouts(accountId); }
  createWorkout(accountId: string, dto: object, correlationId: string) { return this.repository.createWorkout(accountId, dto, correlationId); }
  updateWorkout(accountId: string, id: string, dto: object, correlationId: string) { return this.repository.updateWorkout(accountId, id, dto, correlationId); }
  deleteWorkout(accountId: string, id: string, correlationId: string) { return this.repository.deleteWorkout(accountId, id, correlationId); }
  listFoods(accountId: string) { return this.repository.listFoods(accountId); }
  createFood(accountId: string, dto: object, correlationId: string) { return this.repository.createFood(accountId, dto, correlationId); }
  updateFood(accountId: string, id: string, dto: object, correlationId: string) { return this.repository.updateFood(accountId, id, dto, correlationId); }
  deleteFood(accountId: string, id: string, correlationId: string) { return this.repository.deleteFood(accountId, id, correlationId); }
  dashboard(accountId: string) { return this.repository.dashboard(accountId); }
}

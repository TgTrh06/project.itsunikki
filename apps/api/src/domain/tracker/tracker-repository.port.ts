export const TRACKER_REPOSITORY = Symbol('TRACKER_REPOSITORY');

export interface TrackerRepository {
  profile(accountId: string): Promise<unknown>;
  updateProfile(accountId: string, data: object, correlationId: string): Promise<unknown>;
  listTasks(accountId: string): Promise<unknown>;
  createTask(accountId: string, data: object, correlationId: string): Promise<unknown>;
  updateTask(accountId: string, id: string, data: object, correlationId: string): Promise<unknown>;
  deleteTask(accountId: string, id: string, correlationId: string): Promise<void>;
  listHabits(accountId: string): Promise<unknown>;
  createHabit(accountId: string, data: object, correlationId: string): Promise<unknown>;
  updateHabit(accountId: string, id: string, data: object, correlationId: string): Promise<unknown>;
  deleteHabit(accountId: string, id: string, correlationId: string): Promise<void>;
  checkInHabit(accountId: string, id: string, date: string, correlationId: string): Promise<unknown>;
  listWorkouts(accountId: string): Promise<unknown>;
  createWorkout(accountId: string, data: object, correlationId: string): Promise<unknown>;
  updateWorkout(accountId: string, id: string, data: object, correlationId: string): Promise<unknown>;
  deleteWorkout(accountId: string, id: string, correlationId: string): Promise<void>;
  listFoods(accountId: string): Promise<unknown>;
  createFood(accountId: string, data: object, correlationId: string): Promise<unknown>;
  updateFood(accountId: string, id: string, data: object, correlationId: string): Promise<unknown>;
  deleteFood(accountId: string, id: string, correlationId: string): Promise<void>;
  dashboard(accountId: string): Promise<unknown>;
}

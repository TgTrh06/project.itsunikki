import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard, AuthenticatedRequest } from '../auth/supabase-auth.guard';
import { CheckInDto, FoodDto, HabitDto, ProfileDto, TaskDto, UpdateFoodDto, UpdateHabitDto, UpdateTaskDto, UpdateWorkoutDto, WorkoutDto } from './dto';
import { TrackerUseCases } from '../application/tracker/tracker.use-cases';

@Controller()
@UseGuards(SupabaseAuthGuard)
export class TrackerController {
  constructor(private readonly tracker: TrackerUseCases) {}
  private account(request: AuthenticatedRequest) { return request.accountId!; }
  private correlation(request: AuthenticatedRequest) { return request.correlationId!; }

  @Get('profile') profile(@Req() request: AuthenticatedRequest) { return this.tracker.profile(this.account(request)); }
  @Patch('profile') updateProfile(@Req() request: AuthenticatedRequest, @Body() dto: ProfileDto) { return this.tracker.updateProfile(this.account(request), dto, this.correlation(request)); }

  @Get('tasks') tasks(@Req() request: AuthenticatedRequest) { return this.tracker.listTasks(this.account(request)); }
  @Post('tasks') createTask(@Req() request: AuthenticatedRequest, @Body() dto: TaskDto) { return this.tracker.createTask(this.account(request), dto, this.correlation(request)); }
  @Patch('tasks/:id') updateTask(@Req() request: AuthenticatedRequest, @Param('id') id: string, @Body() dto: UpdateTaskDto) { return this.tracker.updateTask(this.account(request), id, dto, this.correlation(request)); }
  @Delete('tasks/:id') deleteTask(@Req() request: AuthenticatedRequest, @Param('id') id: string) { return this.tracker.deleteTask(this.account(request), id, this.correlation(request)); }

  @Get('habits') habits(@Req() request: AuthenticatedRequest) { return this.tracker.listHabits(this.account(request)); }
  @Post('habits') createHabit(@Req() request: AuthenticatedRequest, @Body() dto: HabitDto) { return this.tracker.createHabit(this.account(request), dto, this.correlation(request)); }
  @Patch('habits/:id') updateHabit(@Req() request: AuthenticatedRequest, @Param('id') id: string, @Body() dto: UpdateHabitDto) { return this.tracker.updateHabit(this.account(request), id, dto, this.correlation(request)); }
  @Delete('habits/:id') deleteHabit(@Req() request: AuthenticatedRequest, @Param('id') id: string) { return this.tracker.deleteHabit(this.account(request), id, this.correlation(request)); }
  @Post('habits/:id/check-ins') checkIn(@Req() request: AuthenticatedRequest, @Param('id') id: string, @Body() dto: CheckInDto) { return this.tracker.checkInHabit(this.account(request), id, dto.date, this.correlation(request)); }

  @Get('workouts') workouts(@Req() request: AuthenticatedRequest) { return this.tracker.listWorkouts(this.account(request)); }
  @Post('workouts') createWorkout(@Req() request: AuthenticatedRequest, @Body() dto: WorkoutDto) { return this.tracker.createWorkout(this.account(request), dto, this.correlation(request)); }
  @Patch('workouts/:id') updateWorkout(@Req() request: AuthenticatedRequest, @Param('id') id: string, @Body() dto: UpdateWorkoutDto) { return this.tracker.updateWorkout(this.account(request), id, dto, this.correlation(request)); }
  @Delete('workouts/:id') deleteWorkout(@Req() request: AuthenticatedRequest, @Param('id') id: string) { return this.tracker.deleteWorkout(this.account(request), id, this.correlation(request)); }

  @Get('foods') foods(@Req() request: AuthenticatedRequest) { return this.tracker.listFoods(this.account(request)); }
  @Post('foods') createFood(@Req() request: AuthenticatedRequest, @Body() dto: FoodDto) { return this.tracker.createFood(this.account(request), dto, this.correlation(request)); }
  @Patch('foods/:id') updateFood(@Req() request: AuthenticatedRequest, @Param('id') id: string, @Body() dto: UpdateFoodDto) { return this.tracker.updateFood(this.account(request), id, dto, this.correlation(request)); }
  @Delete('foods/:id') deleteFood(@Req() request: AuthenticatedRequest, @Param('id') id: string) { return this.tracker.deleteFood(this.account(request), id, this.correlation(request)); }

  @Get('dashboard') dashboard(@Req() request: AuthenticatedRequest) { return this.tracker.dashboard(this.account(request)); }
  @Get('history') history(@Req() request: AuthenticatedRequest) { return this.tracker.dashboard(this.account(request)); }
}

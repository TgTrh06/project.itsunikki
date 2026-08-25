import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { TrackerModule } from './tracker/tracker.module';

@Module({
  imports: [AuthModule, TrackerModule],
  controllers: [HealthController],
})
export class AppModule {}

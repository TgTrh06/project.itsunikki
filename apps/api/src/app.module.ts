import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { TrackerModule } from './tracker/tracker.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/itsunikki'),
    AuthModule,
    TrackerModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

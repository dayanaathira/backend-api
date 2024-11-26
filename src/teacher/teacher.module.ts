import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { LoggingService } from '../logging/logging.service';

@Module({
  providers: [
    TeacherService,
    LoggingService
  ],
  controllers: [TeacherController]
})
export class TeacherModule {}

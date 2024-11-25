import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeacherModule } from './teacher/teacher.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DbMigrationService } from './database/db-migration/db-migration.service';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    LoggingModule,
    TeacherModule,    
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DbMigrationService,
  ],
})
export class AppModule {}

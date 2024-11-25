import { Module } from '@nestjs/common';
import { DbMigrationService } from './db-migration.service';
import { LoggingService } from '../../logging/logging.service';

@Module({
   providers: [DbMigrationService, LoggingService],
   exports: [DbMigrationService]
})
export class DbMigrationModule {}

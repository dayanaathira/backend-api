import { MikroORM } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../logging/logging.service';

/**
 * Service responsible for managing database migrations.
 */
@Injectable()
export class DbMigrationService {
   constructor(
    private readonly orm: MikroORM,
    private readonly logger: LoggingService
   ) { }

   /**
   * Runs database migrations if necessary.
   *
   * @returns {Promise<void>} - A Promise that resolves when migrations are applied successfully.
   * @throws {Error} - Throws an error if there is an issue running migrations.
   */
   async runMigrations(): Promise<void> {
      try {
         const isMigrationUpToDate = await this.isMigrationUpToDate();

         if (isMigrationUpToDate) {
            this.logger.getLogger().info('Migration is up to date with no changes.',
               {label: DbMigrationService.name + ' runMigrations' });
            return;
         }

         //create migration
         await this.createMigration();

         // then apply the migration
         await this.applyMigration();

      } catch (error) {
         this.logger.getLogger().error('Error running migrations:',
            {label: DbMigrationService.name + ' runMigrations' });
         throw error;
      }
   }

   /**
   * Applies pending migrations to the database.
   *
   * @returns {Promise<void>} - A Promise that resolves when migrations are applied successfully.
   * @throws {Error} - Throws an error if there is an issue applying migrations.
   */
   async applyMigration(): Promise<void> {
      try {
         this.logger.getLogger().info('Applying migrations...', {label: DbMigrationService.name + ' applyMigration'});

         // Run all pending migrations and control the transactional context
         await this.orm.em.transactional(async em => {
            await this.orm.getMigrator().up({ transaction: em.getTransactionContext() });
         });

         this.logger.getLogger().info('Migrations completed.', {label: DbMigrationService.name + ' applyMigration'});
      } catch (error) {
         this.logger.getLogger().error('Error creating migration:',
            {label: DbMigrationService.name + ' applyMigration'});
         throw error;
      }
   }

   /**
   * Creates a new migration based on changes detected in the entities.
   *
   * @returns {Promise<void>} - A Promise that resolves when migration is created successfully.
   * @throws {Error} - Throws an error if there is an issue creating migration.
   */
   async createMigration(): Promise<void> {
      try {
         this.logger.getLogger().info('Creating migration...', {label: DbMigrationService.name + ' runMigrations'});
         await this.orm.getMigrator().createMigration();
      } catch (error) {
         this.logger.getLogger().error('Error creating migration:',
            {label: DbMigrationService.name + ' createMigration'});
         throw error;
      }
   }

   /**
   * Checks if database schema is up to-date.
   *
   * @returns {Promise<boolean>} - A Promise that resolves to true
   * if the database schema is up to-date, otherwise false.
   * @throws {Error} - Throws an error if there is an issue checking migration status.
   */
   async isMigrationUpToDate(): Promise<boolean> {
      try {
         const hasPendingMigration = (await this.orm.getMigrator().getPendingMigrations()).length === 0;
         const isSchemaUpToDate = await this.orm.getMigrator().checkMigrationNeeded();
         // Return true if there are no pending migrations and the schema is up to-date.
         return hasPendingMigration && !isSchemaUpToDate;
      } catch (error) {
      // Log any errors that occur during schema comparison
         this.logger.getLogger().error('Error checking migration status:',
            {label: DbMigrationService.name + ' isMigrationUpToDate' });
         throw error;
      }
   }

}
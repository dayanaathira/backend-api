import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/mysql';
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Logger } from "@nestjs/common";
import { format } from 'sql-formatter';

const logger = new Logger('MikroOrm');

/**
 * Configuration object for database connection and migrationsww setup.
 * @remarks
 * This configuration object is used to define database connection parameters,
 * entity and migration paths, and other related settings.
 *
 * @returns {import("mikro-orm").MikroORMOptions} The MikroORM configuration object.
 */


class CustomMigrationGenerator extends TSMigrationGenerator {

    private includedTables = [
      'teachers',
      'students',
      'teachers_student_items'
    ];

    generateMigrationFile(className: string, diff: { up: string[]; down: string[] }): string {
        const filteredDiff = this.filterDiff(diff);
        return super.generateMigrationFile(className, filteredDiff);
    }

    private filterDiff(diff: { up: string[]; down: string[] }): { up: string[]; down: string[] } {
        const filteredUp = diff.up.filter(sql => this.includedTables.some(table => sql.includes(`\`${table}\``)));
        const filteredDown = diff.down.filter(sql => this.includedTables.some(table => sql.includes(`\`${table}\``)));
        return { up: filteredUp, down: filteredDown };
    }

    createStatement(sql: string, padLeft: number): string {
        sql = format(sql, { language: 'mariadb' });
        sql = sql.replace(/default 'NULL'/gi, 'default NULL');
        return super.createStatement(sql.replace(/\n/g, ' '), padLeft)
    }

}

export default defineConfig({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    entities: ['./dist/**/*.entity.js'],             // path to our JS entities (dist), relative to `baseDir`
    entitiesTs: ['src/**/*.entity.ts'],             // path to our TS entities (source), relative to `baseDir`
    metadataProvider: TsMorphMetadataProvider,
    allowGlobalContext: true,
    metadataCache: { enabled: true },
    logger: logger.log.bind(logger),          // The logger function for logging db queries, disable in prod!
    debug: true,                             // Enable debug mode

    extensions: [
        Migrator                                      // Handle migrationsww, generate, apply and revert
    ],
    migrations: {                                  // Migrations options
        tableName: 'mikro_orm_migrations_teacher',         // Name of the migrationsww table in the database
        glob: '!(*.d).{js,ts}',                   // Glob pattern to match migration files
        path: 'dist/migrations',                 // Path to the migration files (compiled)
        pathTs: 'migrations',                   // Path to the migration files (source)
        transactional: true,                   // Whether migrationsww should run within transactions
        disableForeignKeys: true,             // Whether to disable foreign key checks during migrationsww
        allOrNothing: true,                  // Whether to roll back all migrationsww in case of failure
        dropTables: false,                   // Whether to drop all tables before running migrationsww
        safe: false,                       // Whether to perform safe migrationsww (dry-run)
        snapshot: true,                   // Whether to create a snapshot of the database before migration
        emit: 'ts',                      // Language to emit (js or ts)vihjyukjoiuhj
        generator: CustomMigrationGenerator, // migration generator, e.g. to allow custom formatting
        snapshotName: '.snapshot-training',
    },
});


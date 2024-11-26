import { IMigrator, MikroORM } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { DbMigrationService } from './db-migration.service';
import { LoggingService } from '../../logging/logging.service';
import { Mocks } from '../../utils/mock.utils';

jest.mock('@mikro-orm/core');

describe('DbMigrationService', () => {
   let dbMigrationService: DbMigrationService;
   let mockOrm: jest.Mocked<MikroORM>;
   let mockLogger: jest.Mocked<LoggingService>;

   const setupMocks = (
      getPendingMigrationsReturn: any[],
      checkMigrationNeededReturn: boolean,
   ): { mockOrm: jest.Mocked<MikroORM>; mockLogger: jest.Mocked<LoggingService> } => {

      mockLogger = Mocks.loggerService;

      mockOrm = {
         em: {
            transactional: jest.fn().mockImplementation((callback) => callback({
               getTransactionContext: jest.fn(),
            })),
         },
         getMigrator: jest.fn().mockReturnValue({
            getPendingMigrations: jest.fn().mockResolvedValue(getPendingMigrationsReturn),
            checkMigrationNeeded: jest.fn().mockResolvedValue(checkMigrationNeededReturn),
            createMigration: jest.fn().mockResolvedValue([]),
            up: jest.fn(),
         }),
      } as unknown as jest.Mocked<MikroORM>;

      return { mockOrm, mockLogger };
   };


   beforeEach(async () => {
      const {
         mockOrm: setupMockOrm,
         mockLogger: setupMockLogger
      } = setupMocks([], false);

      mockOrm = setupMockOrm;
      mockLogger = setupMockLogger;

      const module: TestingModule = await Test.createTestingModule({
         providers: [
            DbMigrationService,
            {
               provide: LoggingService,
               useValue: mockLogger
            },
            {
               provide: MikroORM,
               useValue: mockOrm
            }
         ],
      }).compile();

      dbMigrationService = module.get<DbMigrationService>(DbMigrationService);
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('DBMigration service should be defined', () => {
      expect(dbMigrationService).toBeDefined();
   });

   describe('runMigrations', () => {
      it('should not run migrations if the database is up to date', async () => {
         await dbMigrationService.runMigrations();

         expect(mockOrm.getMigrator().up).not.toHaveBeenCalled();
         expect(mockLogger.getLogger().info).toHaveBeenCalledWith(
            'Migration is up to date with no changes.', {
               label: 'DbMigrationService runMigrations',
            });
      });

      it('should run migrations if the database is not up to date', async () => {
         jest.spyOn(mockOrm, 'getMigrator').mockReturnValue({
            getPendingMigrations: jest.fn().mockResolvedValue(['some-pending-migration']),
            checkMigrationNeeded: jest.fn().mockResolvedValue(true),
            createMigration: jest.fn().mockResolvedValue([]),
            up: jest.fn(),
         } as unknown as jest.Mocked<IMigrator>);

         await dbMigrationService.runMigrations();

         expect(mockOrm.getMigrator().up).toHaveBeenCalled();
         expect(mockLogger.getLogger().info).toHaveBeenCalledTimes(3);
         expect(mockLogger.getLogger().info).toHaveBeenCalledWith('Creating migration...', {
            label: 'DbMigrationService runMigrations',
         });
         expect(mockLogger.getLogger().info).toHaveBeenCalledWith('Applying migrations...', {
            label: 'DbMigrationService applyMigration',
         });
         expect(mockLogger.getLogger().info).toHaveBeenCalledWith('Migrations completed.', {
            label: 'DbMigrationService applyMigration',
         });
      });

      it('should throw an error if there is an issue running migrations', async () => {
         const mockErrorMsg = 'Migration creation failed';
         jest.spyOn(mockOrm, 'getMigrator').mockReturnValue({
            getPendingMigrations: jest.fn().mockResolvedValue(['some-pending-migration']),
            checkMigrationNeeded: jest.fn().mockResolvedValue(true),
            createMigration: jest.fn().mockResolvedValue([]),
            up: jest.fn().mockRejectedValue(new Error(mockErrorMsg)),
         } as unknown as jest.Mocked<IMigrator>);

         await expect(dbMigrationService.runMigrations()).rejects.toThrowError(mockErrorMsg);
         expect(mockLogger.getLogger().error).toHaveBeenCalledWith('Error running migrations:',
            { label: 'DbMigrationService runMigrations' }
         );
      });
   });

   describe('applyMigration', () => {
      it('should apply pending migrations', async () => {
         jest.spyOn(mockOrm, 'getMigrator').mockReturnValue({
            getPendingMigrations: jest.fn().mockResolvedValue(['some-pending-migration']),
            up: jest.fn().mockResolvedValue(undefined),
         } as unknown as jest.Mocked<IMigrator>);

         await dbMigrationService.applyMigration();

         expect(mockOrm.getMigrator().up).toHaveBeenCalled();
         expect(mockLogger.getLogger().info).toHaveBeenCalledWith('Applying migrations...', {
            label: 'DbMigrationService applyMigration',
         });
         expect(mockLogger.getLogger().info).toHaveBeenCalledWith('Migrations completed.', {
            label: 'DbMigrationService applyMigration',
         });
      });

      it('should throw an error if there is an issue applying migrations', async () => {
         const mockErrorMsg = 'Migration application failed';
         jest.spyOn(mockOrm, 'getMigrator').mockReturnValue({
            getPendingMigrations: jest.fn().mockResolvedValue(['some-pending-migration']),
            up: jest.fn().mockRejectedValue(new Error(mockErrorMsg)),
         } as unknown as jest.Mocked<IMigrator>);

         await expect(dbMigrationService.applyMigration()).rejects.toThrowError(mockErrorMsg);
         expect(mockLogger.getLogger().error).toHaveBeenCalled();
      });
   });

   describe('createMigration', () => {
      it('should create a new migration', async () => {
         jest.spyOn(mockOrm, 'getMigrator').mockReturnValue({
            createMigration: jest.fn().mockResolvedValue(undefined),
         } as unknown as jest.Mocked<IMigrator>);

         await dbMigrationService.createMigration();

         expect(mockOrm.getMigrator().createMigration).toHaveBeenCalled();
         expect(mockLogger.getLogger().info).toHaveBeenCalledWith('Creating migration...', {
            label: 'DbMigrationService runMigrations',
         });
      });

      it('should throw an error if there is an issue creating a migration', async () => {
         jest.spyOn(mockOrm, 'getMigrator').mockReturnValue({
            createMigration: jest.fn().mockRejectedValue(new Error('Migration creation failed')),
         } as unknown as jest.Mocked<IMigrator>);

         mockLogger.getLogger().error = jest.fn();

         await expect(dbMigrationService.createMigration()).rejects.toThrowError('Migration creation failed');
         expect(mockLogger.getLogger().error).toHaveBeenCalled();
      });
   });

   describe('isMigrationUpToDate', () => {
      it('should return true if there are no pending migrations and the schema is up to date', async () => {
         jest.spyOn(mockOrm, 'getMigrator').mockReturnValue({
            getPendingMigrations: jest.fn().mockResolvedValue([]),
            checkMigrationNeeded: jest.fn().mockResolvedValue(false),
         } as unknown as jest.Mocked<IMigrator>);

         const isUpToDate = await dbMigrationService.isMigrationUpToDate();

         expect(isUpToDate).toBe(true);
         expect(mockOrm.getMigrator().getPendingMigrations).toHaveBeenCalled();
         expect(mockOrm.getMigrator().checkMigrationNeeded).toHaveBeenCalled();
         expect(mockLogger.getLogger().error).not.toHaveBeenCalled();
      });

      it('should return false if there are pending migrations or the schema is not up to date', async () => {
         jest.spyOn(mockOrm, 'getMigrator').mockReturnValue({
            getPendingMigrations: jest.fn().mockResolvedValue([{ name: 'migration1' }]),
            checkMigrationNeeded: jest.fn().mockResolvedValue(true),
         } as unknown as jest.Mocked<IMigrator>);

         mockLogger.getLogger().error = jest.fn();

         const isUpToDate = await dbMigrationService.isMigrationUpToDate();

         expect(isUpToDate).toBe(false);
         expect(mockOrm.getMigrator().getPendingMigrations).toHaveBeenCalled();
         expect(mockOrm.getMigrator().checkMigrationNeeded).toHaveBeenCalled();
         expect(mockLogger.getLogger().error).not.toHaveBeenCalled();
      });

      it('should throw an error if there is an issue checking migration status', async () => {
         jest.spyOn(mockOrm, 'getMigrator').mockReturnValue({
            getPendingMigrations: jest.fn().mockRejectedValue(new Error('Migration check failed')),
            checkMigrationNeeded: jest.fn().mockResolvedValue(true),
         } as unknown as jest.Mocked<IMigrator>);

         mockLogger.getLogger().error = jest.fn();

         await expect(dbMigrationService.isMigrationUpToDate()).rejects.toThrowError('Migration check failed');
         expect(mockLogger.getLogger().error).toHaveBeenCalled();
      });
   });
});
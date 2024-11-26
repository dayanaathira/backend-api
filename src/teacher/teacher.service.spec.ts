import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { LoggingService } from '../logging/logging.service';
import { EntityManager } from '@mikro-orm/mysql';
import { Mocks } from '../utils/mock.utils';
import { Teachers } from './entity/teachers.entity';
import { Students } from './entity/students.entity';
import { isArray } from 'class-validator';

describe('TeacherService', () => {
  let service: TeacherService;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        LoggingService,
        {
          provide: EntityManager,
          useValue: Mocks.MockEntityManager
        },
      ],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add new teachers and students', async () => {
    Mocks.MockEntityManager.transactional.mockImplementation(async (cb) => cb(Mocks.MockEntityManager));
    Mocks.MockEntityManager.findOne.mockImplementation((entity, condition) => {
      if (entity === Teachers && condition.name?.$eq === 'Teacher A') return null;
      if (entity === Students && condition.name?.$eq === 'Student 1') return null;
      if (entity === Students && condition.name?.$eq === 'Student 2') return null;
      return null;
    });
    Mocks.MockEntityManager.create.mockImplementation((entity, data) => data);
    Mocks.MockEntityManager.persistAndFlush.mockResolvedValue(undefined);
    Mocks.MockEntityManager.findOne.mockImplementationOnce(() => Mocks.mockTeacher); 

    const result = await service.addTeachers(Mocks.createdTeacherWithStudents);

    expect(Array.isArray(result)).toEqual(false);
    expect(Mocks.MockEntityManager.create).toHaveBeenCalledTimes(2);
    expect(Mocks.MockEntityManager.persistAndFlush).toHaveBeenCalledTimes(2);
  });

  it('should return error when creating teacher with invalid data', async () => {
    jest.spyOn(em, 'qb').mockReturnValue(Mocks.error);
    await expect(service.addTeachers(Mocks.createdTeacherWithStudents)).rejects.toThrow('Unable to add teachers and students');
  });
});

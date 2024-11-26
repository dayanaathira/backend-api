import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { LoggingService } from '../logging/logging.service';
import { EntityManager } from '@mikro-orm/mysql';
import { Mocks } from '../utils/mock.utils';
import { TeacherService } from './teacher.service';
import { HttpStatus } from '@nestjs/common';

describe('TeacherController', () => {
  let controller: TeacherController;
  let service: TeacherService;

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
      controllers: [TeacherController],
    }).compile();

    controller = module.get<TeacherController>(TeacherController);
    service = module.get<TeacherService>(TeacherService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST / should create new teachers', async() => {
    jest.spyOn(service, 'addTeachers').mockReturnValue(Mocks.createdResponse);
    const response = await controller.createTeacher(Mocks.createdTeacherWithStudents);
    expect(Array.isArray(response.data)).toBe(false);
    expect(response.statusCode).toEqual(HttpStatus.CREATED);
    expect(response.message).toEqual('Successfully created.');
  });

  it('POST / should return error', async () => {
    jest.spyOn(service, 'addTeachers').mockRejectedValue(new Error('DB or Query error'));
    await expect(controller.createTeacher(Mocks.createdTeacherWithStudents))
      .rejects.toThrow('Unable to add teachers and students');
  });
  
});

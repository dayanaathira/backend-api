import { AddTeachersWrapperDto } from "../teacher/dto/add-teachers.dto";
import { LoggingService } from "../logging/logging.service";

export class Mocks {
    static MockEntityManager: any = {
        findOne: jest.fn(),
        find: jest.fn(),
        findAll: jest.fn(),
        findOneOrFail: jest.fn(),
        persistAndFlush: jest.fn(),
        execute: jest.fn(),
        create: jest.fn(),
        removeAndFlush: jest.fn(),
        getCount: jest.fn(),
        getResultList: jest.fn(),
        transactional: jest.fn().mockImplementation(fn => {
            if (typeof fn === 'function') {
                return fn({ ...Mocks.MockEntityManager })
            }
            return jest.fn();
        }),
        createQueryBuilder: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            execute: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockResolvedValue(10),
            groupBy: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getResultList: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            clone: jest.fn().mockReturnThis(),
            count: jest.fn().mockResolvedValue(2)
        }),
        qb: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            execute: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            getResultList: jest.fn().mockReturnThis(),
            clone: jest.fn().mockReturnThis(),
            count: jest.fn().mockResolvedValue(2)
        })
    };

    static loggerService: jest.Mocked<LoggingService> = {
        getLogger: jest.fn().mockReturnValue({
            info: jest.fn(),
            error: jest.fn()
        }),
    } as unknown as jest.Mocked<LoggingService>;

    static error: any = new Error('Something went wrong');

    static createdResponse: any = {
        "teacher": [
            {
                "id": 11,
                "name": "Kelly",
                "subject": "Economics",
                "students": [
                    {
                        "id": 13,
                        "name": "Yuu",
                        "grade": 55
                    }
                ]
            }
        ]
    };

    static createdTeacherWithStudents: AddTeachersWrapperDto = {
        "teachers": [
            {
                "name": "Kelly",
                "subject": "Economics",
                "student": [
                    {
                        "name": "Yuu",
                        "grade": 55
                    }
                ]
            }
        ]
    };

    static mockTeacher: any = {
        id: 1,
        name: 'Teacher A',
        subject: 'Math',
        students: []
    };

}
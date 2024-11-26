import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { AddTeachersWrapperDto } from './dto/add-teachers.dto';
import { LoggingService } from '../logging/logging.service';
import { CustomApiResponse } from '../utils/api-response.util';

@Controller('teacher')
export class TeacherController {
    constructor(
        private readonly teacherService: TeacherService,
        private readonly logger: LoggingService
    ) {}

    @Post()
    @CustomApiResponse('Create new teachers with students', 'Add new teachers and students', HttpStatus.CREATED)
    async createTeacher(@Body() createTeacherDto: AddTeachersWrapperDto) {
        try {
            const result = await this.teacherService.addTeachers(createTeacherDto);
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Successfully created.',
                data: result, // Return the result to the client
            };
        } catch (error) {
            this.logger.getLogger().error(error.message, { label: TeacherController.name });
            throw new HttpException('Unable to add teachers and students', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
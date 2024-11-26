import { EntityManager } from '@mikro-orm/mysql';
import { Injectable, Logger } from '@nestjs/common';
import { AddTeachersWrapperDto } from './dto/add-teachers.dto';
import { Teachers } from './entity/teachers.entity';
import { Students } from './entity/students.entity';
import { TeachersStudentItems } from './entity/teachers-students-items.entity';
import { mapToTeacherDTO } from './dto/teacher.dto';

@Injectable()
export class TeacherService {
    private readonly logger = new Logger(TeacherService.name);

    constructor(private readonly em: EntityManager) { }

    async addTeachers(addTeachersDto: AddTeachersWrapperDto): Promise<any> {
        return this.em.transactional(async (em) => {
            const teachers = [];
            try {
                for (const teacherDto of addTeachersDto.teachers) {
                    let teacher = await this.em.findOne(Teachers, { name: { $eq: teacherDto.name } });

                    // If teacher doesn't exist, create new teacher
                    if (!teacher) {
                        teacher = this.em.create(Teachers, {
                            name: teacherDto.name,
                            subject: teacherDto.subject,
                        });
                        await this.em.persistAndFlush(teacher);
                    }

                    // Loop through students to insert them into the database
                    for (const studentDto of teacherDto.student) {
                        let student = await this.em.findOne(Students, { name: { $eq: studentDto.name } });
                        if (!student) {
                            student = this.em.create(Students, {
                                name: studentDto.name,
                                grade: studentDto.grade,
                            });
                            await this.em.persistAndFlush(student);
                        }

                        // Insert the relationship into TeachersStudentItems if it doesn't exist
                        const existingRelation = await this.em.findOne(TeachersStudentItems, { teachers: teacher, students: student });
                        if (!existingRelation) {
                            const studentItems = this.em.create(TeachersStudentItems, {
                                students: student,
                                teachers: teacher,
                            });
                            await this.em.persistAndFlush(studentItems);
                        }
                    }

                    // Re-fetch the teacher with students to ensure it is populated correctly
                    const teacherWithStudents = await this.em.findOne(Teachers, teacher.id, {
                        populate: ['students.students']
                    });

                    if (teacherWithStudents) {
                        const teacherDTO = mapToTeacherDTO(teacherWithStudents);
                        teachers.push(teacherDTO);
                    }
                }
                return { teacher: teachers };
            } catch (error) {
                Logger.error('Error adding teachers: ', error);
                throw new Error('Unable to add teachers and students');
            }
        });
    }
}
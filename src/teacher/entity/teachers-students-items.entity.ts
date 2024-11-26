import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Teachers } from "./teachers.entity";
import { Students } from "./students.entity";

@Entity()
export class TeachersStudentItems {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => Teachers, { fieldName: 'teacher_id', cascade: [Cascade.PERSIST], eager: false})
    teachers: Teachers;

    @ManyToOne(() => Students, { fieldName: 'student_id', cascade: [Cascade.PERSIST], eager: false})
    students: Students;
}
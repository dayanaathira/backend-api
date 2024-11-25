import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Teachers } from "./teachers.entity";
import { Students } from "./students.entity";

@Entity()
export class StudentsItems {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => Teachers, { fieldName: 'teacher_id', mapToPk: true, nullable: true, cascade: [Cascade.PERSIST], eager: false})
    teachers: Teachers;

    @ManyToOne(() => Students, { fieldName: 'student_id', mapToPk: true, nullable: true, cascade: [Cascade.PERSIST], eager: false})
    students: Students;
}
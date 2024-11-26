import { StudentDTO } from "./student.dto";

export class TeacherDTO {
    id: number;
    name: string;
    subject: string;
    students: StudentDTO[];

    constructor(id: number, name: string, subject: string, students: StudentDTO[]) {
        this.id = id;
        this.name = name;
        this.subject = subject;
        this.students = students;
    }
}

// Updated mapper function
export function mapToTeacherDTO(teacherWithStudents: any): TeacherDTO {
    const students = teacherWithStudents.students.map((student: any) => 
        new StudentDTO(student.students.id, student.students.name, student.students.grade) 
    );

    return new TeacherDTO(
        teacherWithStudents.id,
        teacherWithStudents.name,
        teacherWithStudents.subject,
        students
    );
}

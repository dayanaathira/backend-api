export class StudentDTO {
    id: number;
    name?: string; 
    grade?: string; 

    constructor(id: number, name?: string, grade?: string) {
        this.id = id;
        this.name = name;
        this.grade = grade;
    }
}
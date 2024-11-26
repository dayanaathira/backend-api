import {  Cascade, Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { TeachersStudentItems } from "./teachers-students-items.entity";

@Entity()
export class Teachers {
    @PrimaryKey()
    id!: number;

    @Property()
    name: string;

    @Property({ nullable: true })
    subject?: string;

    @OneToMany(() => TeachersStudentItems, stud => stud.teachers, {cascade: [Cascade.PERSIST], eager: false})
    students? = new Collection<TeachersStudentItems>(this);
}
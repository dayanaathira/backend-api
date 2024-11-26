import { Cascade, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { TeachersStudentItems } from "./teachers-students-items.entity";

@Entity()
export class Students {
    @PrimaryKey()
    id!: number;

    @Property()
    name: string;

    @Property()
    grade: number;

    @OneToMany(() => TeachersStudentItems, teach => teach.students, {cascade: [Cascade.PERSIST], eager: false})
    teacher? = new Collection<TeachersStudentItems>(this);
}
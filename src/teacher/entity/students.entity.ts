import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Teachers } from "./teachers.entity";

@Entity()
export class Students {
    @PrimaryKey()
    id!: number;

    @Property()
    name: string;

    @Property()
    grade: number;
}
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Teachers {
    @PrimaryKey()
    id!: number;

    @Property()
    name: string;

    @Property({ nullable: true })
    subject?: string;

}
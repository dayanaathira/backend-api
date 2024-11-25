import { Migration } from '@mikro-orm/migrations';

export class Migration20241125084802 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`students\` (   \`id\` int unsigned not null auto_increment primary key,   \`name\` varchar(255) not null,   \`grade\` int not null ) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`create table \`teachers\` (   \`id\` int unsigned not null auto_increment primary key,   \`name\` varchar(255) not null,   \`subject\` varchar(255) null ) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`create table \`students_items\` (   \`id\` int unsigned not null auto_increment primary key,   \`teacher_id\` int unsigned null,   \`student_id\` int unsigned null ) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`students_items\` add index \`students_items_teacher_id_index\` (\`teacher_id\`);`);
    this.addSql(`alter table \`students_items\` add index \`students_items_student_id_index\` (\`student_id\`);`);
    this.addSql(`alter table \`students_items\` add constraint \`students_items_teacher_id_foreign\` foreign key (\`teacher_id\`) references \`teachers\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`students_items\` add constraint \`students_items_student_id_foreign\` foreign key (\`student_id\`) references \`students\` (\`id\`) on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`students_items\` drop foreign key \`students_items_student_id_foreign\`;`);
    this.addSql(`alter table \`students_items\` drop foreign key \`students_items_teacher_id_foreign\`;`);
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20241126130347 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`teachers_student_items\` (   \`id\` int unsigned not null auto_increment primary key,   \`teacher_id\` int unsigned not null,   \`student_id\` int unsigned not null ) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`teachers_student_items\` add index \`teachers_student_items_teacher_id_index\` (\`teacher_id\`);`);
    this.addSql(`alter table \`teachers_student_items\` add index \`teachers_student_items_student_id_index\` (\`student_id\`);`);
    this.addSql(`alter table \`teachers_student_items\` add constraint \`teachers_student_items_teacher_id_foreign\` foreign key (\`teacher_id\`) references \`teachers\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`teachers_student_items\` add constraint \`teachers_student_items_student_id_foreign\` foreign key (\`student_id\`) references \`students\` (\`id\`) on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`students_items\` add constraint \`students_items_teacher_id_foreign\` foreign key (\`teacher_id\`) references \`teachers\` (\`id\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`students_items\` add constraint \`students_items_student_id_foreign\` foreign key (\`student_id\`) references \`students\` (\`id\`) on update cascade on delete set null;`);
  }

}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { AddStudentsDto } from "./add-students.dto";

class AddTeachersDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    subject: string;

    @IsArray()
    @ApiProperty({ type: [AddStudentsDto] })
    student: AddStudentsDto[];
}

export class AddTeachersWrapperDto {
    @IsArray()
    @ApiProperty({ type: [AddTeachersDto] })
    teachers: AddTeachersDto[];
}

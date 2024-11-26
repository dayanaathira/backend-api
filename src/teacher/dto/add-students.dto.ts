import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class AddStudentsDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsNumber()
    @ApiProperty()
    grade: number;
}
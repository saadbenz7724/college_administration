import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSubjectDto{
    @IsNotEmpty()
    @IsString()
    subjectName: string;

    @IsNumber()
    @IsOptional()
    classId?: number;

    @IsNumber()
    @IsOptional()
    teacherId?: number;
}
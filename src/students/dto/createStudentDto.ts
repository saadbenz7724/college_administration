import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateStudentDto{
    @IsNumber()
    rollNumber: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsNumber()
    @IsPositive()
    age: number;

    @IsOptional()
    @IsNumber()
    classId?: number;
}
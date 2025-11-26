import { IsBoolean, IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateAttendanceDto{
    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsBoolean()
    present: boolean;

    @IsNumber()
    @IsNotEmpty()
    studentId: number;

    @IsNumber()
    @IsNotEmpty()
    classId: number;
}
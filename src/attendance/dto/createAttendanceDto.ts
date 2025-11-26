import { IsDate, IsNotEmpty } from "class-validator";

export class CreateAttendanceDto{
    @IsDate()
    date: string;

    @IsNotEmpty()
    present: boolean;

    studentId: number;

    classId: number;
}
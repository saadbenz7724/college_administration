import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/createAttendanceDto';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService){}

    @Post()
    create(@Body()dto: CreateAttendanceDto){
        return this.attendanceService.create(dto);
    }

    @Get('class/:id')
    getClassAttendance(@Param('id')id: number){
        return this.attendanceService.getClassAttendance(id);
    }

    @Get('student/:id')
    getStudentAttendance(@Param('id')id: number){
        return this.attendanceService.getStudentsAttendance(id);
    }
}

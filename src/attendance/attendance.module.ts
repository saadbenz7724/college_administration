import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { Student } from 'src/students/student.entity';
import { Class } from 'src/classes/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Student, Class])],
  controllers: [AttendanceController],
  providers: [AttendanceService]
})
export class AttendanceModule {}

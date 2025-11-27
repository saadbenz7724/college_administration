import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/createAttendanceDto';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attenRepo: Repository<Attendance>
    ){}
    async create(dto: CreateAttendanceDto){
        
        const atten = this.attenRepo.create({
            present: dto.present,
            date: new Date(dto.date),
            student: {id: dto.studentId},
            classEntity: {id: dto.classId},
        });
        return await this.attenRepo.save(atten);
    }

    async getClassAttendance(classId: number){
        return this.attenRepo.find({
            where: {classEntity:{id: classId}},
            relations: ['student'],
        });
    }

    async getStudentsAttendance(studentId: number){
        return this.attenRepo.find({
            where: {student: {id: studentId}}
        });
    }
}


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
        const atten = await this.attenRepo.create({
            present: dto.present,
            date: dto.date,
            student: {id: dto.studentId},
            class: {id: dto.classId},
        });
        return this.attenRepo.save(atten);
    }

    async getClassAttendance(classId: number){
        return this.attenRepo.find({
            where: {class:{id: classId}},
            relations: ['student'],
        });
    }

    async getStudentsAttendance(studentId: number){
        return this.attenRepo.find({
            where: {student: {id: studentId}}
        });
    }
}

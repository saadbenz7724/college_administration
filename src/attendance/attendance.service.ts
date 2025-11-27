import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/createAttendanceDto';
import { Student } from 'src/students/student.entity';
import { Class } from 'src/classes/class.entity';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attenRepo: Repository<Attendance>,
        @InjectRepository(Student)
        private studentRepo: Repository<Student>,
        @InjectRepository(Class)
        private classRepo: Repository<Class>,
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
        const cls = await this.classRepo.findOne({where: {id: classId}})
        if(!cls) throw new NotFoundException(`Class with ID ${classId} not found`);
        const data = await this.attenRepo.find({
            where: {classEntity:{id: classId}},
            relations: ['student'],
        });
        return data;
    }

    async getStudentsAttendance(studentId: number){
        const student = await this.studentRepo.findOne({where: {id: studentId}});
        if(!student) throw new NotFoundException(`Student with ID ${studentId} not found`);
        const data = await this.attenRepo.find({
            where: {student: {id: studentId}}
        });
        return data;
    }
}


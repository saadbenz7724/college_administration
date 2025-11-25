import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './subject.entity';
import { Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/createSubjectDto';

@Injectable()
export class SubjectsService {
    constructor(
        @InjectRepository(Course)
        private subjectRepo: Repository<Course>,
    ){}

    async create(createSubjectDto: CreateSubjectDto){
        const sub = await this.subjectRepo.create(createSubjectDto)
        return this.subjectRepo.save(sub);
    }

    async findAll(){
        return this.subjectRepo.find();
    }

    async findOne(id: number){
        const sub = await this.subjectRepo.findOne({where: {id}})
        if(!sub) throw new NotFoundException(`Subject with ID ${id} not found`);
        return sub;
    }

    async update(id: number, createSubjectDto: CreateSubjectDto){
        const sub = await this.subjectRepo.findOne({where:{id}})
        if(!sub) throw new NotFoundException(`Subject with ID ${id} not found`);
        await this.subjectRepo.update(id, createSubjectDto);
        return {message: 'subject updated successfully'};
    }

    async remove(id: number){
        const sub = await this.subjectRepo.findOne({where: {id}})
        if(!sub) throw new NotFoundException(`Subject with ID ${id} not found`);
        await this.subjectRepo.delete(id)
        return {message: 'subject deleted successfully'};
    }

    async findByClass(classId: number){
        return this.subjectRepo.find({
            where: {classes: {id: classId}},
            relations: ['teacher', 'classes'],
        });
    }

    async findByTeacher(teacherId: number){
        const subjects = await this.subjectRepo.find({
            where: {teacher: {id: teacherId}},
            relations: ['classes', 'teacher'],
        });
        if(!subjects.length) return null;
        const teacher = subjects[0].teacher;

        return {
            teacher: {
                id: teacher.id,
                name: teacher.name,
                email: teacher.email,
            },
            subjects: subjects.map(s=> ({
                id: s.id,
                subjectName: s.subjectName,
                classes: s.classes,
            })),
        };
    }
}

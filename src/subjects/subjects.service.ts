import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './subject.entity';
import { Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/createSubjectDto';
import { Teacher } from 'src/teachers/teacher.entity';
import Redis from 'ioredis';

@Injectable()
export class SubjectsService {
    constructor(
        @InjectRepository(Course)
        private subjectRepo: Repository<Course>,
        @InjectRepository(Teacher)
        private teacherRepo: Repository<Teacher>,
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    ){}

    async create(createSubjectDto: CreateSubjectDto){
        const sub = await this.subjectRepo.create(createSubjectDto)
        await this.redisClient.del('all-subjects');
        return this.subjectRepo.save(sub);
    }

    async findAll(){
        const cacheKey = 'all-subjects';
        const cache = await this.redisClient.get(cacheKey);
        if(cache) return JSON.parse(cache);
        const subjects = await this.subjectRepo.find();
        await this.redisClient.set(cacheKey, JSON.stringify(subjects), 'EX', 100)
        return subjects;
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
        await this.redisClient.del('all-subjects');
        return {message: 'subject updated successfully'};
    }

    async remove(id: number){
        const sub = await this.subjectRepo.findOne({where: {id}})
        if(!sub) throw new NotFoundException(`Subject with ID ${id} not found`);
        await this.subjectRepo.delete(id)
        await this.redisClient.del('all-subjects');
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

    async assignTeacher(subjectId: number, teacherId: number){
        const subject = await this.subjectRepo.findOne({
            where: {id: subjectId},
        });
        if(!subject) throw new NotFoundException(`Subject with ID ${subjectId} not found`);
        const teacher = await this.teacherRepo.findOne({
            where: {id: teacherId}
        });
        if(!teacher) throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
        subject.teacher = teacher;
        return this.subjectRepo.save(subject);
    }
}

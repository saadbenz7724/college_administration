import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto } from './dto/createTeacherDto';
import { UpdateTeacherDto } from './dto/updateTeacherDto';
import { Class } from 'src/classes/class.entity';
import Redis from 'ioredis';

@Injectable()
export class TeachersService {
    constructor(
        @InjectRepository(Teacher)
        private teacherRepo: Repository<Teacher>,
        @InjectRepository(Class)
        private classRepo: Repository<Class>,
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    ){}

    async findAll(){
        const cacheKey = 'all-teachers';
        const cache = await this.redisClient.get(cacheKey);
        if(cache){
            return JSON.parse(cache);
        }
        const teacher = await this.teacherRepo.find()
        await this.redisClient.set(cacheKey, JSON.stringify(teacher), 'EX', 100)
        return teacher;
    }

    async findOne(id: number){
        const teacher = await this.teacherRepo.findOne({where:{id}})
        if(!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
        return teacher;
    }

    async create(createTeacherDto: CreateTeacherDto){
        const teacher = await this.teacherRepo.create(createTeacherDto);
        await this.redisClient.del('all-teachers');
        return this.teacherRepo.save(teacher);
    }

    async update(id: number, updateTeacherDto: UpdateTeacherDto){
        const teacher = await this.teacherRepo.findOne({where: {id}})
        if(!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
        await this.teacherRepo.update(id, updateTeacherDto)
        await this.redisClient.del('all-teachers')
        return {message: 'Teacher updated successfully'}
    }

    async remove(id: number){
        const teacher = await this.teacherRepo.findOne({where: {id}})
        if(!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
        await this.teacherRepo.delete(id);
        await this.redisClient.del('all-teachers');
        return { message: 'Teacher deleted successfully' };
    }

    async assignClassToTeacher(teacherId: number, classId: number){
        const teacher = await this.teacherRepo.findOne({
            where: {id: teacherId},
            relations: ['classes'],
        });
        if(!teacher) throw new NotFoundException(`teacher with ID ${teacherId} not found`);
        const cls = await this.classRepo.findOne({
            where: {id: classId}
        });
        if(!cls) throw new NotFoundException(`Class with ID ${classId} not found`);
        const alreadyAssigned = teacher.classes.some(c => c.id === classId)
        if(alreadyAssigned){
            return {
                message: 'Class already assign to this teacher',
                teacherId,
                classId,
            };
        }
        teacher.classes.push(cls);
        await this.teacherRepo.save(teacher);
        return{
            message: 'Class assigned successfully',
            teacherId,
            classId,
        };
    }

    async getClassesOfTeacher(teacherId: number){
        const teacher = await this.teacherRepo.findOne({
            where: {id: teacherId},
            relations: ['classes']
        });
        if(!teacher) throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
        return teacher.classes;
    }

    async getTeacherDetails(id: number){
        const teacher = await this.teacherRepo.findOne({
            where: {id},
            relations: ['classes', 'subjects'],
        });
        if(!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
        return teacher;
    }

    async getTeacherSummary(){
        const teacher = await this.teacherRepo.find({
            relations: ['classes', 'subjects']
        });

        return teacher.map(t => ({
            id: t.id,
            name: t.name,
            email: t.email,
            totalClasses: t.classes?.length || 0,
            totalSubjects: t.subjects?.length || 0
        }));
    }
}

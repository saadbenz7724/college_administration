import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './class.entity';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/createClassDto';
import { UpdateClassDto } from './dto/updateClassDto';
import Redis from 'ioredis';

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Class)
        private classRepo: Repository<Class>,
        @Inject('REDIS_CLIENT')private readonly redisClient: Redis,
    ){}

    async findAll(){
        const cacheKey = 'all-classes';
        const cache = await this.redisClient.get(cacheKey);
        if(cache) return JSON.parse(cache);
        const classes = await this.classRepo.find();
        await this.redisClient.set(cacheKey, JSON.stringify(classes), 'EX', 100)
        return classes;
    }

    async findOne(id: number){
        const cls = await this.classRepo.findOne({where: {id}})
        if(!cls) throw new NotFoundException(`Class with ID ${id} not found`);
        return cls;
    }

    async create(createClassDto: CreateClassDto){
        const cls = this.classRepo.create(createClassDto);
        return this.classRepo.save(cls);
    }

    async update(id: number, updateClassDto: UpdateClassDto){
        const cls = await this.classRepo.findOne({where: {id}})
        if(!cls) throw new NotFoundException(`Class with ID ${id} not found`);
        await this.classRepo.update(id, updateClassDto)
        return {message: 'Class updated successfully'}
    }

    async remove(id: number){
        const cls = await this.classRepo.findOne({where: {id}})
        if(!cls) throw new NotFoundException(`Class with ID ${id} not found`);
        await this.classRepo.delete(id)
        return {message: 'Class deleted successfully'}
    }
    async getClassWithStudents(id: number){
        const cls = await this.classRepo.findOne({
            where: {id},
            relations: ['students'],
        });
        if(!cls) throw new NotFoundException(`Class with ID ${id} not found`);
        const totalStudents = cls.students.length;
        return{
            id: cls.id,
            className: cls.className,
            roomNumber: cls.roomNumber,
            totalStudents,
            students: cls.students.map(student=>{
                const {classId, ...result} = student
                return result;
            }),
        };
    }
}

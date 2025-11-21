import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto } from './dto/createTeacherDto';
import { UpdateTeacherDto } from './dto/updateTeacherDto';

@Injectable()
export class TeachersService {
    constructor(
        @InjectRepository(Teacher)
        private teacherRepo: Repository<Teacher>,
    ){}

    async findAll(){
        return this.teacherRepo.find()
    }

    async findOne(id: number){
        const teacher = await this.teacherRepo.findOne({where:{id}})
        if(!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
        return teacher;
    }

    async create(createTeacherDto: CreateTeacherDto){
        const teacher = await this.teacherRepo.create(createTeacherDto);
        return this.teacherRepo.save(teacher);
    }

    async update(id: number, updateTeacherDto: UpdateTeacherDto){
        const teacher = await this.teacherRepo.findOne({where: {id}})
        if(!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
        await this.teacherRepo.update(id, updateTeacherDto)
        return {message: 'Teacher updated successfully'}
    }

    async remove(id: number){
        const teacher = await this.teacherRepo.findOne({where: {id}})
        if(!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
        await this.teacherRepo.delete(id);
        return { message: 'Teacher deleted successfully' };
    }
}

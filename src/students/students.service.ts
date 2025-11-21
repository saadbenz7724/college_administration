import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private studentRepo: Repository<Student>,
    ){}

    async findAll(){
        return this.studentRepo.find();
    }

    async findOne(id: number){
        const student = await this.studentRepo.findOne({where:{id}})
        if(!student) throw new NotFoundException(`Student with ID ${id} not found`);
        return student;
    }

    async create(body: any){
        const student = await this.studentRepo.create(body)
        return this.studentRepo.save(student);
    }

    async update(id: number, body: any){
        const student = await this.studentRepo.findOneBy({id})
        if(!student) throw new NotFoundException(`Student with ID ${id} not found`);
        await this.studentRepo.update(id, body)
        return {message: 'student updated successfully'}
    }

    async remove(id: number){
        const student = await this.studentRepo.findOneBy({id})
        if(!student) throw new NotFoundException(`Student with ID ${id} not found`);
        await this.studentRepo.delete(id)
        return {message: 'Student deleted successfully'}

    }
}

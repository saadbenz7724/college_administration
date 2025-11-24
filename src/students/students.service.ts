import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentDto } from './dto/createStudentDto';
import { UpdateStudentDto } from './dto/updateStudentDto';

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

    async create(createStudentDto: CreateStudentDto){
        const student = await this.studentRepo.create(createStudentDto)
        return this.studentRepo.save(student);
    }

    async update(id: number, updateStudentDto: UpdateStudentDto){
        const student = await this.studentRepo.findOne({where:{id}})
        if(!student) throw new NotFoundException(`Student with ID ${id} not found`);
        await this.studentRepo.update(id, updateStudentDto)
        return {message: 'student updated successfully'}
    }

    async remove(id: number){
        const student = await this.studentRepo.findOne({where: {id}})
        if(!student) throw new NotFoundException(`Student with ID ${id} not found`);
        await this.studentRepo.delete(id)
        return {message: 'Student deleted successfully'}

    }

    async getStudentsWithClass(){
        const student = await this.studentRepo.find({
            relations: ['classEntity'],
        });
        return student.map(({classId, ...rest})=>rest)
    }
}
